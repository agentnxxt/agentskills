import { SignJWT } from "jose";

/**
 * Generates a short-lived JWT for the Ghost Admin API.
 * The Admin API key is in the format "id:secret" where secret is hex-encoded.
 */
export async function generateAdminToken(adminApiKey: string): Promise<string> {
  const [id, secret] = adminApiKey.split(":");
  if (!id || !secret) {
    throw new Error(
      "Invalid Admin API key format. Expected format: id:secret (copy from Ghost Admin > Settings > Integrations)"
    );
  }

  const secretBytes = Buffer.from(secret, "hex");
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256", kid: id })
    .setIssuedAt(now)
    .setExpirationTime(now + 5 * 60) // 5 minute expiry
    .setAudience("/admin/")
    .sign(secretBytes);
}
