# Other API Endpoints

## Teams

| Method | Path | Description |
|--------|------|-------------|
| GET | `/teams` | List all teams |
| GET | `/teams/{id}` | Get team details |
| GET | `/teams/{id}/members` | Get team members |
| GET | `/teams/current` | Get authenticated team |
| GET | `/teams/current/members` | Get authenticated team members |

## Private Keys

| Method | Path | Description |
|--------|------|-------------|
| GET | `/private-keys` | List private keys |
| POST | `/private-keys` | Create private key |
| GET | `/private-keys/{uuid}` | Get private key |
| PATCH | `/private-keys/{uuid}` | Update private key |
| DELETE | `/private-keys/{uuid}` | Delete private key |

## GitHub Apps

| Method | Path | Description |
|--------|------|-------------|
| GET | `/github-apps` | List GitHub Apps |
| POST | `/github-apps` | Create GitHub App |
| GET | `/github-apps/{id}/repositories` | List repos for GitHub App |
| GET | `/github-apps/{id}/branches` | List branches for repo |
| PATCH | `/github-apps/{id}` | Update GitHub App |
| DELETE | `/github-apps/{id}` | Delete GitHub App |

## Cloud Tokens

| Method | Path | Description |
|--------|------|-------------|
| GET | `/cloud-tokens` | List cloud provider tokens |
| POST | `/cloud-tokens` | Create cloud provider token |
| GET | `/cloud-tokens/{uuid}` | Get cloud provider token |
| PATCH | `/cloud-tokens/{uuid}` | Update cloud provider token |
| DELETE | `/cloud-tokens/{uuid}` | Delete cloud provider token |
| POST | `/cloud-tokens/{uuid}/validate` | Validate cloud provider token |

## Hetzner

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hetzner/locations` | List Hetzner locations |
| GET | `/hetzner/server-types` | List Hetzner server types |
| GET | `/hetzner/images` | List Hetzner images |
| GET | `/hetzner/ssh-keys` | List Hetzner SSH keys |
| POST | `/hetzner/servers` | Create Hetzner server |

## System

| Method | Path | Description |
|--------|------|-------------|
| GET | `/version` | Get Coolify version |
| GET | `/healthcheck` | Health check |
| GET | `/enable-api` | Enable API access |
| GET | `/disable-api` | Disable API access |

## Resources

| Method | Path | Description |
|--------|------|-------------|
| GET | `/resources` | List all resources across projects |
