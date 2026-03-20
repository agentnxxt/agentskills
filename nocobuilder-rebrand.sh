#!/bin/bash
# NocoBuilder Rebrand Script — run inside a fresh clone of simstudioai/sim
# Usage:
#   git clone https://github.com/simstudioai/sim.git nocobuilder
#   cd nocobuilder
#   bash nocobuilder-rebrand.sh

set -e

echo "=== NocoBuilder Rebrand Script ==="
echo "Rebranding SimStudio → NocoBuilder (powered by AgentNXXT)"

# 1. Bulk text replacements (order matters — most specific first)
echo "[1/9] Replacing simstudioai, SimStudio, sim-studio, simstudio..."
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.toml" -o -name "*.yaml" -o -name "*.yml" -o -name "*.md" -o -name "*.mdx" -o -name "*.sh" -o -name "*.tpl" -o -name "*.xml" -o -name "*.txt" -o -name "*.cfg" -o -name "*.ini" -o -name "*.env*" -o -name "Dockerfile*" -o -name "LICENSE*" -o -name "NOTICE*" -o -name "CONTRIBUTING*" \) \
  ! -path "./.git/*" ! -path "*/node_modules/*" ! -path "*/bun.lock" ! -path "*/.next/*" \
  -exec grep -lI "simstudio\|SimStudio\|sim-studio\|simstudioai\|Sim Studio" {} \; 2>/dev/null | \
  xargs sed -i'' -e \
    's|simstudioai|nocobuilder|g' \
  -e 's|SimStudioClient|NocoBuilderClient|g' \
  -e 's|SimStudio|NocoBuilder|g' \
  -e 's|Sim Studio|NocoBuilder|g' \
  -e 's|sim-studio|nocobuilder|g' \
  -e 's|simstudio-ts-sdk|nocobuilder-ts-sdk|g' \
  -e 's|simstudio-sdk|nocobuilder-sdk|g' \
  -e 's|simstudio|nocobuilder|g'

# 2. Replace sim.ai domain
echo "[2/9] Replacing sim.ai → nocobuilder.cloud..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.md" -o -name "*.mdx" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.py" -o -name "*.toml" -o -name "*.sh" -o -name "*.xml" -o -name "*.txt" \) \
  ! -path "./.git/*" ! -path "*/node_modules/*" \
  -exec grep -lI "sim\.ai" {} \; 2>/dev/null | \
  xargs sed -i'' -e \
    's|docs\.sim\.ai|docs.nocobuilder.cloud|g' \
  -e 's|https://sim\.ai|https://nocobuilder.cloud|g' \
  -e 's|http://sim\.ai|http://nocobuilder.cloud|g' \
  -e 's|sim\.ai|nocobuilder.cloud|g'

# 3. Replace apps/sim path references (including Dockerfiles)
echo "[3/9] Replacing apps/sim → apps/nocobuilder..."
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.yaml" -o -name "*.yml" -o -name "*.md" -o -name "*.sh" -o -name "*.toml" -o -name "Dockerfile*" -o -name "*.Dockerfile" \) \
  ! -path "./.git/*" ! -path "*/node_modules/*" \
  -exec grep -lI "apps/sim" {} \; 2>/dev/null | \
  xargs sed -i'' -e 's|apps/sim|apps/nocobuilder|g'

# 4. Replace helm/sim path references
echo "[4/9] Replacing helm/sim → helm/nocobuilder..."
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.yaml" -o -name "*.yml" -o -name "*.md" -o -name "*.sh" -o -name "*.toml" \) \
  ! -path "./.git/*" ! -path "*/node_modules/*" \
  -exec grep -lI "helm/sim" {} \; 2>/dev/null | \
  xargs sed -i'' -e 's|helm/sim|helm/nocobuilder|g'

# 5. Rename directories
echo "[5/9] Renaming directories..."
mv apps/sim apps/nocobuilder 2>/dev/null || true
mv helm/sim helm/nocobuilder 2>/dev/null || true
mv packages/python-sdk/simstudio packages/python-sdk/nocobuilder 2>/dev/null || true

# 6. Rename files
echo "[6/9] Renaming files..."
# Cursor rules
for f in .cursor/rules/sim-*.mdc; do [ -f "$f" ] && mv "$f" "${f//sim-/noco-}"; done 2>/dev/null || true
# Claude rules
for f in .claude/rules/sim-*.md; do [ -f "$f" ] && mv "$f" "${f//sim-/noco-}"; done 2>/dev/null || true
# Devcontainer
mv .devcontainer/sim-commands.sh .devcontainer/noco-commands.sh 2>/dev/null || true
# Components
mv apps/nocobuilder/app/form/\[identifier\]/components/powered-by-sim.tsx \
   apps/nocobuilder/app/form/\[identifier\]/components/powered-by-nocobuilder.tsx 2>/dev/null || true
mv apps/docs/components/ui/sim-logo.tsx apps/docs/components/ui/nocobuilder-logo.tsx 2>/dev/null || true

# 7. Fix imports for renamed files + remaining brand refs
echo "[7/9] Fixing imports and remaining references..."
find . -name "*.ts" -o -name "*.tsx" | grep -v ".git/" | grep -v "node_modules/" | \
  xargs grep -l "powered-by-sim" 2>/dev/null | xargs sed -i'' -e 's/powered-by-sim/powered-by-nocobuilder/g' 2>/dev/null || true
find . -name "*.ts" -o -name "*.tsx" -o -name "*.md" -o -name "*.mdx" | grep -v ".git/" | grep -v "node_modules/" | \
  xargs grep -l "sim-logo" 2>/dev/null | xargs sed -i'' -e 's/sim-logo/nocobuilder-logo/g' 2>/dev/null || true
find . -name "*.sh" -o -name "*.md" | grep -v ".git/" | \
  xargs grep -l "sim-commands" 2>/dev/null | xargs sed -i'' -e 's/sim-commands/noco-commands/g' 2>/dev/null || true

# Devcontainer aliases
sed -i'' -e 's/sim-start/noco-start/g; s/sim-app/noco-app/g; s/sim-sockets/noco-sockets/g; s/sim-rebuild/noco-rebuild/g; s/sim-migrate/noco-migrate/g; s/sim-generate/noco-generate/g' \
  .devcontainer/noco-commands.sh .devcontainer/post-create.sh .devcontainer/README.md 2>/dev/null || true

# Fix package name
sed -i'' -e 's/"name": "sim"/"name": "nocobuilder"/' apps/nocobuilder/package.json 2>/dev/null || true
sed -i'' -e 's/"author": "Sim"/"author": "AgentNXXT"/g' packages/cli/package.json packages/ts-sdk/package.json 2>/dev/null || true

# PoweredBySim → PoweredByNocoBuilder
find . -name "*.ts" -o -name "*.tsx" | grep -v ".git/" | grep -v "node_modules/" | \
  xargs grep -l "PoweredBySim" 2>/dev/null | xargs sed -i'' -e 's/PoweredBySim/PoweredByNocoBuilder/g' 2>/dev/null || true

# Update "Powered by" text
sed -i'' -e 's|<span>Powered by</span>|<span>Powered by AgentNXXT</span>|g' \
  apps/nocobuilder/app/form/\[identifier\]/components/powered-by-nocobuilder.tsx 2>/dev/null || true

# Remaining "Sim" brand refs
sed -i'' -e 's/"Sim"/"NocoBuilder"/g' \
  apps/nocobuilder/app/\(home\)/components/testimonials/testimonials.tsx \
  apps/nocobuilder/app/\(home\)/components/collaboration/collaboration.tsx \
  apps/nocobuilder/lib/core/config/env.ts \
  apps/docs/components/ui/nocobuilder-logo.tsx \
  apps/docs/app/api/og/route.tsx 2>/dev/null || true

# SIM_AGENT env vars
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.env*" \) ! -path "./.git/*" ! -path "*/node_modules/*" | \
  xargs grep -l "SIM_AGENT" 2>/dev/null | \
  xargs sed -i'' -e 's/SIM_AGENT_API_URL_DEFAULT/NOCO_AGENT_API_URL_DEFAULT/g; s/SIM_AGENT_API_URL/NOCO_AGENT_API_URL/g; s/Sim Agent/NocoBuilder Agent/g' 2>/dev/null || true

# Internal URL ref
sed -i'' -e 's/sim-app.default.svc/nocobuilder-app.default.svc/g' apps/nocobuilder/.env.example 2>/dev/null || true

echo "[8/9] Fixing Docker configs for Docker Hub (agentnxxt/*)..."
# Docker: replace @sim/db in Dockerfiles
find ./docker -name "*.Dockerfile" -exec sed -i'' -e 's|@sim/db|@nocobuilder/db|g' {} \; 2>/dev/null || true

# Docker: update prod compose to use Docker Hub
sed -i'' -e 's|ghcr.io/simstudioai/sim:|agentnxxt/nocobuilder:|g' \
  -e 's|ghcr.io/simstudioai/realtime:|agentnxxt/nocobuilder-realtime:|g' \
  -e 's|ghcr.io/simstudioai/migrations:|agentnxxt/nocobuilder-migrations:|g' \
  -e 's|ghcr.io/nocobuilder/nocobuilder:|agentnxxt/nocobuilder:|g' \
  -e 's|ghcr.io/nocobuilder/realtime:|agentnxxt/nocobuilder-realtime:|g' \
  -e 's|ghcr.io/nocobuilder/migrations:|agentnxxt/nocobuilder-migrations:|g' \
  docker-compose.prod.yml 2>/dev/null || true

# Docker: replace SIM_AGENT in compose files
find . -name "docker-compose*.yml" ! -path "./.git/*" \
  -exec sed -i'' -e 's/SIM_AGENT_API_URL/NOCO_AGENT_API_URL/g' {} \; 2>/dev/null || true

# 9. Verify
echo "[9/9] Verifying..."
COUNT=$(grep -rn "simstudio\|SimStudio\|simstudioai" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yaml" --include="*.yml" --include="*.md" --include="*.py" --include="*.toml" . 2>/dev/null | grep -v ".git/" | grep -v "node_modules/" | wc -l)
echo "Remaining simstudio references: $COUNT"

echo ""
echo "=== Rebrand complete! ==="
echo ""
echo "Next steps:"
echo "  git add -A"
echo "  git commit -m 'Rebrand SimStudio to NocoBuilder (powered by AgentNXXT)'"
echo "  git remote set-url origin https://github.com/AgentNXXT/nocobuilder.git"
echo "  git push -u origin main"
echo ""
echo "Deploy with Coolify:"
echo "  1. Add GitHub repo AgentNXXT/nocobuilder in Coolify"
echo "  2. Select Docker Compose, point to docker-compose.coolify.yml"
echo "  3. Set env vars: NEXT_PUBLIC_APP_URL, BETTER_AUTH_SECRET,"
echo "     ENCRYPTION_KEY, INTERNAL_API_SECRET, POSTGRES_PASSWORD,"
echo "     NEXT_PUBLIC_SOCKET_URL"
echo "  4. Deploy!"
