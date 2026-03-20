# Servers API

Base path: `/servers`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/servers` | List all servers |
| POST | `/servers` | Create server |
| GET | `/servers/{uuid}` | Get server details |
| PATCH | `/servers/{uuid}` | Update server |
| DELETE | `/servers/{uuid}` | Delete server |
| GET | `/servers/{uuid}/resources` | List resources on server |
| GET | `/servers/{uuid}/domains` | List domains on server |
| GET | `/servers/{uuid}/validate` | Validate server connectivity |

## Notes

- Servers are SSH-accessible machines (VPS, bare metal, Raspberry Pi, cloud instances)
- Creating a server requires a private key UUID for SSH access
- Validate checks SSH connectivity and Docker availability
- Resources endpoint returns all apps, databases, and services on that server
