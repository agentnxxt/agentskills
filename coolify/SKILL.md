---
name: coolify
description: |
  Manage Coolify self-hosting platform via its REST API. Deploy applications,
  databases, and services. Manage servers, projects, environments, and teams.
  Use when: (1) deploying or managing apps/DBs/services on Coolify,
  (2) provisioning or validating servers, (3) managing projects/environments,
  (4) automating Coolify operations via API, (5) installing or configuring Coolify.
---

# Coolify API Skill

## Quick Start

### Authentication

```bash
# Base URL pattern
COOLIFY_URL="http://<ip>:8000/api/v1"

# All requests need Bearer token (create in UI: Keys & Tokens → API tokens)
curl -s -H "Authorization: Bearer $COOLIFY_TOKEN" "$COOLIFY_URL/version"
```

Token permissions: `read-only` (default), `read:sensitive`, `view:sensitive`, `*` (full access).
Tokens are scoped to the team that created them.

### Helper Script

Use [scripts/coolify-api.sh](scripts/coolify-api.sh) for common operations:

```bash
source scripts/coolify-api.sh

# Required env vars
export COOLIFY_URL="http://your-server:8000/api/v1"
export COOLIFY_TOKEN="your-token"

# Examples
coolify_api GET /servers
coolify_api POST /applications '{"project_uuid":"...","server_uuid":"...","environment_name":"production"}'
coolify_api GET /applications/{uuid}/start
```

## Concept Model

```
Team (token scope)
└── Project (organizational unit)
    └── Environment (dev, staging, production)
        └── Resources (applications, databases, services)
            └── Deployed on → Server
```

- **Servers** — SSH-accessible machines (VPS, Raspberry Pi, EC2)
- **Projects** — Group environments and resources
- **Environments** — Isolated deployment contexts within a project
- **Resources** — Apps, databases, services running as Docker containers
- **Reverse Proxy** — Caddy or Traefik for routing + auto SSL via Let's Encrypt

## Common Workflows

### Deploy an application

1. List servers: `GET /servers` → pick `server_uuid`
2. List projects: `GET /projects` → pick `project_uuid`, note environment
3. Create app: `POST /applications` with git repo details
4. Set env vars: `POST /applications/{uuid}/environment-variables`
5. Deploy: `GET /applications/{uuid}/start`
6. Check: `GET /applications/{uuid}`

### Create a database

1. Pick type endpoint: `POST /databases/postgresql` (or mysql, mongodb, redis, mariadb, clickhouse, keydb, dragonfly)
2. Configure backups: `PATCH /databases/{uuid}/backups`
3. Start: `GET /databases/{uuid}/start`

### Manage deployments

- List all: `GET /deployments`
- Deploy by tag/UUID: `GET /deployments/deploy?tag=v1.0&uuid={app-uuid}`
- Cancel: `POST /deployments/{uuid}/cancel`
- App-specific: `GET /applications/{uuid}/deployments`

### Provision a Hetzner server

1. List locations: `GET /hetzner/locations`
2. List server types: `GET /hetzner/server-types`
3. Create: `POST /hetzner/servers` with location, type, SSH key

## API Endpoint Groups

| Group | Reference | Key operations |
|-------|-----------|----------------|
| Applications | [api-applications.md](references/api-applications.md) | CRUD, deploy, env vars, logs, start/stop |
| Databases | [api-databases.md](references/api-databases.md) | CRUD by type, backups, start/stop |
| Servers | [api-servers.md](references/api-servers.md) | CRUD, validate, resources, domains |
| Services | [api-services.md](references/api-services.md) | CRUD, env vars, start/stop |
| Projects & Envs | [api-projects-environments.md](references/api-projects-environments.md) | Project CRUD, environment management |
| Deployments | [api-deployments.md](references/api-deployments.md) | List, cancel, deploy by tag |
| Other | [api-other.md](references/api-other.md) | Teams, private keys, GitHub apps, cloud tokens, Hetzner |
| Installation | [installation.md](references/installation.md) | Install commands, requirements, manual setup |

## API Conventions

- Base: `http://<ip>:8000/api/v1` (except `/health` and `/feedback` which skip `/v1`)
- Auth: `Authorization: Bearer <token>` header on every request
- UUIDs identify most resources; some accept name-or-uuid
- Lifecycle actions use GET: `/applications/{uuid}/start`, `/stop`, `/restart`
- Env vars support bulk update via `/environment-variables/bulk`
- Sensitive data redacted unless token has `view:sensitive` or `*` permission
