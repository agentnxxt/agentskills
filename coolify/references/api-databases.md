# Databases API

Base path: `/databases`

## CRUD

| Method | Path | Description |
|--------|------|-------------|
| GET | `/databases` | List all databases |
| GET | `/databases/{uuid}` | Get database details |
| PATCH | `/databases/{uuid}` | Update database |
| DELETE | `/databases/{uuid}` | Delete database |

## Create by Type

| Method | Path | Database |
|--------|------|----------|
| POST | `/databases/postgresql` | PostgreSQL |
| POST | `/databases/mysql` | MySQL |
| POST | `/databases/mariadb` | MariaDB |
| POST | `/databases/mongodb` | MongoDB |
| POST | `/databases/redis` | Redis |
| POST | `/databases/keydb` | KeyDB |
| POST | `/databases/clickhouse` | ClickHouse |
| POST | `/databases/dragonfly` | DragonFly |

## Backups

| Method | Path | Description |
|--------|------|-------------|
| GET | `/databases/{uuid}/backups` | Get database backups |
| POST | `/databases/{uuid}/backups` | Create database backup |
| PATCH | `/databases/{uuid}/backups` | Update backup settings |
| DELETE | `/databases/{uuid}/backup-configuration` | Delete backup config |
| GET | `/databases/backup-executions` | List backup executions |
| DELETE | `/databases/backup-executions/{uuid}` | Delete backup execution |

## Lifecycle

| Method | Path | Description |
|--------|------|-------------|
| GET | `/databases/{uuid}/start` | Start database |
| GET | `/databases/{uuid}/stop` | Stop database |
| GET | `/databases/{uuid}/restart` | Restart database |
