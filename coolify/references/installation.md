# Coolify Installation

## Requirements

- **CPU:** 2 cores minimum
- **RAM:** 2 GB minimum
- **Storage:** 30 GB free
- **Architectures:** AMD64, ARM64
- **OS:** Debian/Ubuntu, CentOS/Fedora/RHEL, SUSE, Arch, Alpine, Raspberry Pi OS 64-bit

## Quick Install

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

## Custom Install (with env vars)

```bash
env ROOT_USERNAME=admin \
    ROOT_USER_EMAIL=admin@example.com \
    ROOT_USER_PASSWORD=SecurePassword123 \
    AUTOUPDATE=false \
    bash -c 'curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
```

| Variable | Default | Description |
|----------|---------|-------------|
| `ROOT_USERNAME` | — | Admin username |
| `ROOT_USER_EMAIL` | — | Admin email |
| `ROOT_USER_PASSWORD` | — | Admin password |
| `DOCKER_ADDRESS_POOL_BASE` | `10.0.0.0/8` | Docker network CIDR |
| `DOCKER_ADDRESS_POOL_SIZE` | `24` | Pool size (16-28) |
| `AUTOUPDATE` | `true` | Enable auto-updates |
| `REGISTRY_URL` | `ghcr.io` | Custom Docker registry |

## Manual Install

```bash
# 1. Create directories
mkdir -p /data/coolify/{source,ssh,applications,databases,backups,services,proxy,webhooks-during-maintenance}
mkdir -p /data/coolify/ssh/{keys,mux}
mkdir -p /data/coolify/proxy/dynamic

# 2. Generate SSH key
ssh-keygen -f /data/coolify/ssh/keys/[email protected] -t ed25519 -N '' -C root@coolify
cat /data/coolify/ssh/keys/[email protected] >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 3. Download configs
curl -fsSL https://cdn.coollabs.io/coolify/docker-compose.yml -o /data/coolify/source/docker-compose.yml
curl -fsSL https://cdn.coollabs.io/coolify/docker-compose.prod.yml -o /data/coolify/source/docker-compose.prod.yml
curl -fsSL https://cdn.coollabs.io/coolify/.env.production -o /data/coolify/source/.env
curl -fsSL https://cdn.coollabs.io/coolify/upgrade.sh -o /data/coolify/source/upgrade.sh

# 4. Set permissions
chown -R 9999:root /data/coolify
chmod -R 700 /data/coolify

# 5. Generate secrets
sed -i "s|APP_ID=.*|APP_ID=$(openssl rand -hex 16)|g" /data/coolify/source/.env
sed -i "s|APP_KEY=.*|APP_KEY=base64:$(openssl rand -base64 32)|g" /data/coolify/source/.env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=$(openssl rand -base64 32)|g" /data/coolify/source/.env
sed -i "s|REDIS_PASSWORD=.*|REDIS_PASSWORD=$(openssl rand -base64 32)|g" /data/coolify/source/.env
sed -i "s|PUSHER_APP_ID=.*|PUSHER_APP_ID=$(openssl rand -hex 32)|g" /data/coolify/source/.env
sed -i "s|PUSHER_APP_KEY=.*|PUSHER_APP_KEY=$(openssl rand -hex 32)|g" /data/coolify/source/.env
sed -i "s|PUSHER_APP_SECRET=.*|PUSHER_APP_SECRET=$(openssl rand -hex 32)|g" /data/coolify/source/.env

# 6. Create Docker network
docker network create --attachable coolify

# 7. Start Coolify
docker compose --env-file /data/coolify/source/.env \
  -f /data/coolify/source/docker-compose.yml \
  -f /data/coolify/source/docker-compose.prod.yml \
  up -d --pull always --remove-orphans --force-recreate
```

## Post-Install

Access at `http://<server-ip>:8000` and create admin account.
API available at `http://<server-ip>:8000/api/v1` after generating a token in Keys & Tokens.
