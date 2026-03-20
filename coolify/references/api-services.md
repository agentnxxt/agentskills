# Services API

Base path: `/services`

## CRUD

| Method | Path | Description |
|--------|------|-------------|
| GET | `/services` | List all services |
| POST | `/services` | Create service (500+ one-click options) |
| GET | `/services/{uuid}` | Get service details |
| PATCH | `/services/{uuid}` | Update service |
| DELETE | `/services/{uuid}` | Delete service |

## Environment Variables

| Method | Path | Description |
|--------|------|-------------|
| GET | `/services/{uuid}/environment-variables` | List env vars |
| POST | `/services/{uuid}/environment-variables` | Create env var |
| PATCH | `/services/{uuid}/environment-variables` | Update env var |
| PATCH | `/services/{uuid}/environment-variables/bulk` | Bulk update env vars |
| DELETE | `/services/{uuid}/environment-variables` | Delete env var |

## Lifecycle

| Method | Path | Description |
|--------|------|-------------|
| GET | `/services/{uuid}/start` | Start service |
| GET | `/services/{uuid}/stop` | Stop service |
| GET | `/services/{uuid}/restart` | Restart service |
