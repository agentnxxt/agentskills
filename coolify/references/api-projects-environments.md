# Projects & Environments API

## Projects

Base path: `/projects`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/projects` | List all projects |
| POST | `/projects` | Create project |
| GET | `/projects/{uuid}` | Get project details |
| PATCH | `/projects/{uuid}` | Update project |
| DELETE | `/projects/{uuid}` | Delete project |

## Environments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/projects/{uuid}/environments` | List environments in project |
| POST | `/projects/{uuid}/environments` | Create environment |
| GET | `/projects/{name-or-uuid}/environments/{name-or-uuid}` | Get environment (accepts name or UUID) |
| DELETE | `/projects/{uuid}/environments/{uuid}` | Delete environment |

## Notes

- Projects are the top-level organizational unit
- Each project contains one or more environments (e.g., dev, staging, production)
- Resources (apps, DBs, services) belong to an environment within a project
- Environment endpoints accept both name and UUID for lookup
