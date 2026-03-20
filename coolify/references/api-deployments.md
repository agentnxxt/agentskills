# Deployments API

Base path: `/deployments`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/deployments` | List all deployments |
| GET | `/deployments/{uuid}` | Get deployment details |
| POST | `/deployments/{uuid}/cancel` | Cancel a running deployment |
| GET | `/deployments/deploy` | Deploy by tag or UUID (query params) |
| GET | `/applications/{uuid}/deployments` | List deployments for specific app |

## Deploy by Tag

```
GET /deployments/deploy?tag=v1.0.0&uuid={application-uuid}
```

Triggers a deployment of the specified tag for the given application.
