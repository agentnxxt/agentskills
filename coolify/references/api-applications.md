# Applications API

Base path: `/applications`

## CRUD

| Method | Path | Description |
|--------|------|-------------|
| GET | `/applications` | List all applications |
| POST | `/applications` | Create application (see variants below) |
| GET | `/applications/{uuid}` | Get application details |
| PATCH | `/applications/{uuid}` | Update application |
| DELETE | `/applications/{uuid}` | Delete application |

## Creation Variants

POST `/applications` with different body shapes:

- **Public repo** — git URL accessible without auth
- **Private (GitHub App)** — uses installed GitHub App for access
- **Private (Deploy Key)** — uses SSH deploy key
- **Dockerfile (no git)** — inline Dockerfile content
- **Docker Image (no git)** — pull from registry
- **Docker Compose** — compose file based deployment

Required fields vary by type. Common fields: `project_uuid`, `server_uuid`, `environment_name`.

## Environment Variables

| Method | Path | Description |
|--------|------|-------------|
| GET | `/applications/{uuid}/environment-variables` | List env vars |
| POST | `/applications/{uuid}/environment-variables` | Create env var |
| PATCH | `/applications/{uuid}/environment-variables` | Update env var |
| PATCH | `/applications/{uuid}/environment-variables/bulk` | Bulk update env vars |
| DELETE | `/applications/{uuid}/environment-variables` | Delete env var |

## Lifecycle

| Method | Path | Description |
|--------|------|-------------|
| GET | `/applications/{uuid}/start` | Start application |
| GET | `/applications/{uuid}/stop` | Stop application |
| GET | `/applications/{uuid}/restart` | Restart application |

## Logs & Deployments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/applications/{uuid}/logs` | Retrieve application logs |
| GET | `/applications/{uuid}/deployments` | List deployments for this app |
