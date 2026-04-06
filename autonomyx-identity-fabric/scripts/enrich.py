"""
autonomyx-identity-fabric — ENRICH mode
Fetches fresh profile data from provider APIs for stale account nodes,
re-derives linkage hashes, discovers new linked_via edges, and upserts into SurrealDB.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import os
import json
from datetime import datetime, timezone, timedelta
from typing import Any, Optional

import httpx
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from surrealdb import Surreal

from resolve import get_db, hmac_hash, SURREAL_NS, SURREAL_DB

# ── env ───────────────────────────────────────────────────────────────────────
ENC_KEY  = bytes.fromhex(os.environ["IDENTITY_FABRIC_ENC_KEY"])   # 32 bytes
HMAC_KEY = os.environ["IDENTITY_FABRIC_HMAC_KEY"].encode()
TTL_HOURS = 24


# ── encryption ────────────────────────────────────────────────────────────────
def encrypt(plaintext: str) -> str:
    """AES-256-GCM encrypt. Returns base64-encoded nonce+ciphertext."""
    aesgcm = AESGCM(ENC_KEY)
    nonce = os.urandom(12)
    ct = aesgcm.encrypt(nonce, plaintext.encode(), None)
    return base64.b64encode(nonce + ct).decode()


def decrypt(blob: str) -> str:
    raw = base64.b64decode(blob)
    nonce, ct = raw[:12], raw[12:]
    return AESGCM(ENC_KEY).decrypt(nonce, ct, None).decode()


# ── provider connectors ───────────────────────────────────────────────────────
# Each connector: async fetch_profile(token: str) -> dict | None

async def _get(url: str, token: str, headers: dict | None = None) -> dict | None:
    h = {"Authorization": f"Bearer {token}", **(headers or {})}
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url, headers=h)
        if r.status_code == 200:
            return r.json()
        if r.status_code == 401:
            return None  # token expired — caller marks node stale
        r.raise_for_status()
    return None


async def fetch_google(token: str) -> dict | None:
    data = await _get("https://openidconnect.googleapis.com/v1/userinfo", token)
    if not data:
        return None
    return {
        "provider": "google",
        "provider_sub": str(data.get("sub", "")),
        "email": data.get("email", "").lower() or None,
        "email_verified": bool(data.get("email_verified")),
        "display_name": data.get("name"),
        "profile_photo_url": data.get("picture"),
        "org": data.get("hd"),           # Google Workspace domain
        "raw_profile": data,
    }


async def fetch_github(token: str) -> dict | None:
    profile = await _get("https://api.github.com/user", token,
                          {"Accept": "application/vnd.github+json"})
    if not profile:
        return None
    emails = await _get("https://api.github.com/user/emails", token,
                         {"Accept": "application/vnd.github+json"}) or []
    primary_email = next(
        (e["email"] for e in emails if e.get("primary") and e.get("verified")), None
    )
    return {
        "provider": "github",
        "provider_sub": str(profile.get("id", "")),
        "email": (primary_email or "").lower() or None,
        "email_verified": primary_email is not None,
        "username": profile.get("login"),
        "display_name": profile.get("name"),
        "profile_photo_url": profile.get("avatar_url"),
        "bio": profile.get("bio"),
        "org": profile.get("company"),
        "location": profile.get("location"),
        "raw_profile": profile,
    }


async def fetch_microsoft(token: str) -> dict | None:
    data = await _get("https://graph.microsoft.com/v1.0/me", token)
    if not data:
        return None
    email = (data.get("mail") or data.get("userPrincipalName") or "").lower() or None
    return {
        "provider": "microsoft",
        "provider_sub": data.get("id", ""),
        "email": email,
        "email_verified": True,  # corporate accounts are always verified
        "display_name": data.get("displayName"),
        "phone": data.get("mobilePhone"),
        "bio": data.get("jobTitle"),
        "org": data.get("companyName"),
        "location": data.get("officeLocation"),
        "raw_profile": data,
    }


async def fetch_apple(token: str) -> dict | None:
    # Apple OIDC — decode JWT claims without library for minimal deps
    import base64 as b64
    try:
        parts = token.split(".")
        if len(parts) < 2:
            return None
        padded = parts[1] + "=" * (4 - len(parts[1]) % 4)
        claims = json.loads(b64.urlsafe_b64decode(padded))
    except Exception:
        return None
    email = claims.get("email", "").lower() or None
    is_private = claims.get("is_private_email") in (True, "true")
    return {
        "provider": "apple",
        "provider_sub": claims.get("sub", ""),
        "email": None if is_private else email,   # skip relay emails for linkage
        "email_verified": not is_private and bool(claims.get("email_verified")),
        "raw_profile": {**claims, "is_private_email": is_private},
    }


async def fetch_linkedin(token: str) -> dict | None:
    data = await _get("https://api.linkedin.com/v2/userinfo", token)
    if not data:
        return None
    return {
        "provider": "linkedin",
        "provider_sub": data.get("sub", ""),
        "email": (data.get("email") or "").lower() or None,
        "email_verified": bool(data.get("email_verified")),
        "display_name": data.get("name"),
        "profile_photo_url": data.get("picture"),
        "raw_profile": data,
    }


async def fetch_twitter(token: str) -> dict | None:
    data = await _get(
        "https://api.twitter.com/2/users/me?user.fields=name,username,description,profile_image_url,location",
        token,
    )
    if not data:
        return None
    user = data.get("data", {})
    return {
        "provider": "twitter",
        "provider_sub": user.get("id", ""),
        "username": user.get("username"),
        "display_name": user.get("name"),
        "bio": user.get("description"),
        "profile_photo_url": user.get("profile_image_url"),
        "location": user.get("location"),
        "raw_profile": user,
    }


async def fetch_logto(token: str, logto_domain: str) -> dict | None:
    data = await _get(f"https://{logto_domain}/oidc/userinfo", token)
    if not data:
        return None
    identities = data.get("identities", {})
    linked_stubs = [
        {"provider": prov, "provider_sub": str(info.get("userId", ""))}
        for prov, info in identities.items()
    ]
    return {
        "provider": "logto",
        "provider_sub": data.get("sub", ""),
        "email": (data.get("email") or "").lower() or None,
        "email_verified": bool(data.get("email_verified")),
        "phone": data.get("phone_number"),
        "username": data.get("username"),
        "display_name": data.get("name"),
        "profile_photo_url": data.get("picture"),
        "linked_account_stubs": linked_stubs,
        "raw_profile": data,
    }


async def fetch_okta(token: str, okta_domain: str) -> dict | None:
    data = await _get(f"https://{okta_domain}/oauth2/v1/userinfo", token)
    if not data:
        return None
    return {
        "provider": "okta",
        "provider_sub": data.get("sub", ""),
        "email": (data.get("email") or "").lower() or None,
        "email_verified": bool(data.get("email_verified")),
        "phone": data.get("phone_number"),
        "username": data.get("preferred_username"),
        "display_name": data.get("name"),
        "org": data.get("organization"),
        "raw_profile": data,
    }


async def fetch_auth0(token: str, auth0_domain: str) -> dict | None:
    data = await _get(f"https://{auth0_domain}/userinfo", token)
    if not data:
        return None
    identities = data.get("identities", [])
    linked_stubs = [
        {"provider": i.get("provider"), "provider_sub": str(i.get("user_id", ""))}
        for i in identities if i.get("provider") != data.get("sub", "").split("|")[0]
    ]
    return {
        "provider": "auth0",
        "provider_sub": data.get("sub", ""),
        "email": (data.get("email") or "").lower() or None,
        "email_verified": bool(data.get("email_verified")),
        "phone": data.get("phone_number"),
        "username": data.get("preferred_username") or data.get("nickname"),
        "display_name": data.get("name"),
        "profile_photo_url": data.get("picture"),
        "linked_account_stubs": linked_stubs,
        "raw_profile": data,
    }


async def fetch_keycloak(token: str, keycloak_realm_url: str) -> dict | None:
    data = await _get(f"{keycloak_realm_url}/protocol/openid-connect/userinfo", token)
    if not data:
        return None
    attrs = data.get("attributes", {})
    return {
        "provider": "keycloak",
        "provider_sub": data.get("sub", ""),
        "email": (data.get("email") or "").lower() or None,
        "email_verified": bool(data.get("email_verified")),
        "phone": (attrs.get("phone") or [None])[0],
        "username": data.get("preferred_username"),
        "display_name": data.get("name"),
        "raw_profile": data,
    }


# Provider dispatch table
PROVIDER_FETCHERS = {
    "google":    lambda token, cfg: fetch_google(token),
    "github":    lambda token, cfg: fetch_github(token),
    "microsoft": lambda token, cfg: fetch_microsoft(token),
    "apple":     lambda token, cfg: fetch_apple(token),
    "linkedin":  lambda token, cfg: fetch_linkedin(token),
    "twitter":   lambda token, cfg: fetch_twitter(token),
    "logto":     lambda token, cfg: fetch_logto(token, cfg.get("logto_domain", os.environ.get("LOGTO_DOMAIN", ""))),
    "okta":      lambda token, cfg: fetch_okta(token, cfg.get("okta_domain", "")),
    "auth0":     lambda token, cfg: fetch_auth0(token, cfg.get("auth0_domain", "")),
    "keycloak":  lambda token, cfg: fetch_keycloak(token, cfg.get("keycloak_realm_url", "")),
}


# ── SurrealDB upsert ──────────────────────────────────────────────────────────
async def upsert_account(db: Surreal, tenant_id: str, profile: dict) -> str:
    """Upsert account node; return the SurrealDB record ID."""
    provider = profile["provider"]
    sub = profile["provider_sub"]
    record_id = f"account:`{provider}|{sub}`"

    # Re-derive hashes
    raw_email = (profile.get("email") or "").lower() or None
    raw_phone  = profile.get("phone")
    h_email = hmac_hash(raw_email, tenant_id) if raw_email else None
    h_phone = hmac_hash(raw_phone, tenant_id) if raw_phone else None

    # Encrypt raw profile
    enc_blob = encrypt(json.dumps(profile.get("raw_profile", {})))

    ttl = (datetime.now(timezone.utc) + timedelta(hours=TTL_HOURS)).isoformat()

    await db.query(
        """
        UPSERT $id SET
          tenant_id        = $tenant,
          provider         = $provider,
          provider_sub     = $sub,
          email            = $email,
          email_verified   = $ev,
          phone            = $phone,
          username         = $username,
          display_name     = $display_name,
          profile_photo_url= $photo,
          bio              = $bio,
          org              = $org,
          location         = $location,
          hashed_email     = $he,
          hashed_phone     = $hp,
          raw_profile_enc  = $enc,
          stale            = false,
          ttl_refresh_at   = $ttl,
          last_seen        = time::now()
        """,
        {
            "id": record_id,
            "tenant": tenant_id,
            "provider": provider,
            "sub": sub,
            "email": raw_email,
            "ev": profile.get("email_verified", False),
            "phone": raw_phone,
            "username": profile.get("username"),
            "display_name": profile.get("display_name"),
            "photo": profile.get("profile_photo_url"),
            "bio": profile.get("bio"),
            "org": profile.get("org"),
            "location": profile.get("location"),
            "he": h_email,
            "hp": h_phone,
            "enc": enc_blob,
            "ttl": ttl,
        },
    )
    return record_id


async def discover_and_write_links(
    db: Surreal, tenant_id: str, new_account_id: str, profile: dict
) -> list[dict]:
    """
    After upserting an account, look for other accounts with matching hashed_email
    or hashed_phone and write linked_via edges. Also expands linked_account_stubs
    from Logto/Auth0 identity maps.
    Returns list of new edges created.
    """
    new_edges = []

    raw_email = (profile.get("email") or "").lower() or None
    raw_phone  = profile.get("phone")

    # Email-based linkage
    if raw_email:
        h = hmac_hash(raw_email, tenant_id)
        ev = profile.get("email_verified", False)
        confidence = "HIGH" if ev else "MEDIUM"
        signal = "verified_email_match" if ev else "unverified_email_match"
        result = await db.query(
            "SELECT id FROM account WHERE hashed_email=$h AND id != $me AND tenant_id=$t",
            {"h": h, "me": new_account_id, "t": tenant_id},
        )
        peers = result[0].get("result", []) if result else []
        for peer in peers:
            edge_id = f"linked_via:{new_account_id.replace(':', '_')}__{str(peer['id']).replace(':', '_')}"
            await db.query(
                """
                IF NOT EXISTS (SELECT * FROM linked_via WHERE in=$a AND out=$b) THEN
                  RELATE $a->linked_via->$b SET confidence=$c, signal=$s, asserted_at=time::now(), asserted_by='system'
                END
                """,
                {"a": new_account_id, "b": str(peer["id"]), "c": confidence, "s": signal},
            )
            new_edges.append({"type": "linked_via", "from": new_account_id, "to": str(peer["id"]),
                               "confidence": confidence, "signal": signal})

    # Phone-based linkage
    if raw_phone:
        h = hmac_hash(raw_phone, tenant_id)
        result = await db.query(
            "SELECT id FROM account WHERE hashed_phone=$h AND id != $me AND tenant_id=$t",
            {"h": h, "me": new_account_id, "t": tenant_id},
        )
        peers = result[0].get("result", []) if result else []
        for peer in peers:
            await db.query(
                """
                IF NOT EXISTS (SELECT * FROM linked_via WHERE in=$a AND out=$b) THEN
                  RELATE $a->linked_via->$b SET confidence='HIGH', signal='phone_match', asserted_at=time::now(), asserted_by='system'
                END
                """,
                {"a": new_account_id, "b": str(peer["id"])},
            )
            new_edges.append({"type": "linked_via", "from": new_account_id, "to": str(peer["id"]),
                               "confidence": "HIGH", "signal": "phone_match"})

    # Stub-based linkage (Logto / Auth0 identity maps)
    for stub in profile.get("linked_account_stubs", []):
        stub_provider = stub.get("provider", "")
        stub_sub = stub.get("provider_sub", "")
        if not stub_provider or not stub_sub:
            continue
        result = await db.query(
            "SELECT id FROM account WHERE provider=$p AND provider_sub=$s AND tenant_id=$t",
            {"p": stub_provider, "s": stub_sub, "t": tenant_id},
        )
        rows = result[0].get("result", []) if result else []
        for row in rows:
            await db.query(
                """
                IF NOT EXISTS (SELECT * FROM linked_via WHERE in=$a AND out=$b) THEN
                  RELATE $a->linked_via->$b SET confidence='HIGH', signal='logto_session', asserted_at=time::now(), asserted_by='system'
                END
                """,
                {"a": new_account_id, "b": str(row["id"])},
            )
            new_edges.append({"type": "linked_via", "from": new_account_id, "to": str(row["id"]),
                               "confidence": "HIGH", "signal": "logto_session"})

    return new_edges


# ── main ENRICH entry point ───────────────────────────────────────────────────
async def enrich(
    account_ids: list[str],
    tenant_id: str,
    tokens: dict[str, str],          # {account_id: oauth_token}
    provider_config: dict | None = None,  # extra config per provider
    caller: str = "system",
) -> dict:
    """
    Enrich a list of account node IDs with fresh provider data.

    tokens: map of account_id → OAuth access token for that account.
    provider_config: optional extra config, e.g. {"logto_domain": "...", "okta_domain": "..."}

    Returns summary of enrichment results.
    """
    cfg = provider_config or {}
    db = await get_db()
    results = []
    total_new_edges = []

    try:
        # Load existing account nodes
        node_result = await db.query("SELECT * FROM $ids", {"ids": account_ids})
        nodes = node_result[0].get("result", []) if node_result else []

        for node in nodes:
            account_id = str(node["id"])
            provider = node.get("provider", "")
            token = tokens.get(account_id)

            if not token:
                results.append({"account_id": account_id, "status": "skipped_no_token"})
                # Mark as stale so caller knows it needs a re-auth
                await db.query(
                    "UPDATE $id SET stale=true", {"id": account_id}
                )
                continue

            fetcher = PROVIDER_FETCHERS.get(provider)
            if not fetcher:
                results.append({"account_id": account_id, "status": "unsupported_provider", "provider": provider})
                continue

            try:
                profile = await fetcher(token, cfg)
            except Exception as e:
                results.append({"account_id": account_id, "status": "fetch_error", "error": str(e)})
                await db.query("UPDATE $id SET stale=true", {"id": account_id})
                continue

            if profile is None:
                # Token expired or revoked
                await db.query("UPDATE $id SET stale=true", {"id": account_id})
                results.append({"account_id": account_id, "status": "token_expired"})
                continue

            # Upsert enriched data
            upserted_id = await upsert_account(db, tenant_id, profile)

            # Discover new linkage edges
            new_edges = await discover_and_write_links(db, tenant_id, upserted_id, profile)
            total_new_edges.extend(new_edges)

            results.append({
                "account_id": account_id,
                "status": "enriched",
                "new_edges": len(new_edges),
            })

        # Audit log
        await db.query(
            "CREATE audit_log SET tenant_id=$t, action='ENRICH', actor=$a, detail=$d, ts=time::now()",
            {"t": tenant_id, "a": caller,
             "d": f"Enriched {len([r for r in results if r['status']=='enriched'])} accounts, "
                  f"{len(total_new_edges)} new edges"},
        )

        return {
            "enriched_count": len([r for r in results if r["status"] == "enriched"]),
            "skipped_count":  len([r for r in results if r["status"] != "enriched"]),
            "new_edges":      total_new_edges,
            "details":        results,
        }

    finally:
        await db.close()


if __name__ == "__main__":
    import asyncio, json, sys
    print("ENRICH module — import and call enrich(account_ids, tenant_id, tokens)")
