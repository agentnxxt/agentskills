# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="Ghost MCP Server"
LABEL org.opencontainers.image.description="MCP server for Ghost CMS — 56 tools covering Admin API & Content API"
LABEL org.opencontainers.image.source="https://github.com/AgentNXXT/ghost-mcp-server"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Non-root user for security
RUN addgroup -S mcp && adduser -S mcp -G mcp
USER mcp

# Environment variables (all required at runtime — no defaults for secrets)
ENV GHOST_URL=""
ENV GHOST_ADMIN_API_KEY=""
ENV GHOST_CONTENT_API_KEY=""
ENV GHOST_API_VERSION="v5.0"

ENTRYPOINT ["node", "dist/index.js"]
