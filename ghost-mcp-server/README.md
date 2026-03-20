# Ghost MCP Server

A full [Model Context Protocol](https://modelcontextprotocol.io) server for [Ghost CMS](https://ghost.org), exposing both the **Admin API** and **Content API** as MCP tools.

## Features

- **38 tools** covering the full Ghost Admin API and Content API
- JWT authentication for the Admin API (auto-generated, short-lived tokens)
- Key-based authentication for the Content API
- Works with Claude Desktop, Claude Code, and any MCP-compatible client
- TypeScript with full type safety

## Tools Reference

### Admin API (requires `GHOST_ADMIN_API_KEY`)

| Category | Tools |
|----------|-------|
| **Posts** | `admin_list_posts`, `admin_get_post`, `admin_create_post`, `admin_update_post`, `admin_delete_post` |
| **Pages** | `admin_list_pages`, `admin_get_page`, `admin_create_page`, `admin_update_page`, `admin_delete_page` |
| **Tags** | `admin_list_tags`, `admin_get_tag`, `admin_create_tag`, `admin_update_tag`, `admin_delete_tag` |
| **Members** | `admin_list_members`, `admin_get_member`, `admin_create_member`, `admin_update_member`, `admin_delete_member`, `admin_list_member_subscriptions`, `admin_create_member_complimentary_subscription` |
| **Tiers** | `admin_list_tiers`, `admin_get_tier`, `admin_create_tier`, `admin_update_tier` |
| **Newsletters** | `admin_list_newsletters`, `admin_get_newsletter`, `admin_create_newsletter`, `admin_update_newsletter` |
| **Offers** | `admin_list_offers`, `admin_get_offer`, `admin_create_offer`, `admin_update_offer` |
| **Users** | `admin_list_users`, `admin_get_user`, `admin_update_user`, `admin_delete_user` |
| **Webhooks** | `admin_create_webhook`, `admin_update_webhook`, `admin_delete_webhook` |
| **Themes** | `admin_list_themes`, `admin_activate_theme` |
| **Images** | `admin_upload_image` |
| **Site/Settings** | `admin_get_site`, `admin_get_settings`, `admin_update_settings` |

### Content API (requires `GHOST_CONTENT_API_KEY`)

| Category | Tools |
|----------|-------|
| **Posts** | `content_list_posts`, `content_get_post` |
| **Pages** | `content_list_pages`, `content_get_page` |
| **Tags** | `content_list_tags`, `content_get_tag` |
| **Authors** | `content_list_authors`, `content_get_author` |
| **Tiers** | `content_list_tiers` |

## Docker

### Pull & run from Docker Hub

```bash
docker run --rm -i \
  -e GHOST_URL=https://your-site.ghost.io \
  -e GHOST_ADMIN_API_KEY=your_id:your_secret \
  -e GHOST_CONTENT_API_KEY=your_content_key \
  agentnxxt/ghost-mcp-server
```

### Docker Compose

```yaml
services:
  ghost-mcp:
    image: agentnxxt/ghost-mcp-server:latest
    stdin_open: true
    environment:
      GHOST_URL: https://your-site.ghost.io
      GHOST_ADMIN_API_KEY: your_id:your_secret
      GHOST_CONTENT_API_KEY: your_content_key
      GHOST_API_VERSION: v5.0   # optional
```

### Claude Desktop with Docker

```json
{
  "mcpServers": {
    "ghost": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "GHOST_URL=https://your-site.ghost.io",
        "-e", "GHOST_ADMIN_API_KEY=your_id:your_secret",
        "-e", "GHOST_CONTENT_API_KEY=your_content_key",
        "agentnxxt/ghost-mcp-server:latest"
      ]
    }
  }
}
```

### Available tags

| Tag | Description |
|-----|-------------|
| `latest` | Latest build from `main` |
| `1.0.0` | Specific release |
| `sha-abc1234` | Pinned to a specific commit |

---

## Setup (from source)

### 1. Install

```bash
npm install
npm run build
```

### 2. Get your API keys

In Ghost Admin → **Settings → Integrations → Add custom integration**:
- Copy the **Admin API Key** (format: `id:secret`)
- Copy the **Content API Key**

### 3. Configure

#### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "ghost": {
      "command": "node",
      "args": ["/absolute/path/to/ghost-mcp/dist/index.js"],
      "env": {
        "GHOST_URL": "https://your-site.ghost.io",
        "GHOST_ADMIN_API_KEY": "your_id:your_secret",
        "GHOST_CONTENT_API_KEY": "your_content_api_key"
      }
    }
  }
}
```

#### Claude Code

```bash
claude mcp add ghost \
  -e GHOST_URL=https://your-site.ghost.io \
  -e GHOST_ADMIN_API_KEY=your_id:your_secret \
  -e GHOST_CONTENT_API_KEY=your_content_key \
  -- node /path/to/ghost-mcp/dist/index.js
```

#### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GHOST_URL` | ✅ | Your Ghost site URL e.g. `https://demo.ghost.io` |
| `GHOST_ADMIN_API_KEY` | For admin tools | `id:secret` from Ghost Integrations |
| `GHOST_CONTENT_API_KEY` | For content tools | Key from Ghost Integrations |
| `GHOST_API_VERSION` | Optional | API version, defaults to `v5.0` |

## Usage Examples

Once connected to Claude, you can use natural language:

```
"List my last 5 published posts"
"Create a draft post titled 'Hello World' with tag 'News'"
"Get the member count for my paid tier"
"Update the site title to 'My Blog'"
"Create a webhook for post.published events pointing to https://my-server.com/hook"
"Show me all active offers"
"Upload this image and give me the URL: https://example.com/photo.jpg"
```

## Ghost Filter Syntax

Many list tools accept a `filter` parameter using Ghost's NQL syntax:

```
status:published                    # published posts only
featured:true                       # featured posts
tag:news                            # posts with tag 'news'
tag:news+featured:true              # AND
tag:news,tag:tech                   # OR  
published_at:>2024-01-01            # date comparison
status:[draft,scheduled]            # IN list
-status:published                   # NOT
```

## Development

```bash
# Run in dev mode (no build step)
GHOST_URL=https://demo.ghost.io \
GHOST_ADMIN_API_KEY=id:secret \
npm run dev
```
