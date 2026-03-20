#!/usr/bin/env bash
# Coolify API helper — source this file, then call coolify_api
# Requires: COOLIFY_URL and COOLIFY_TOKEN env vars
#
# Usage:
#   source coolify-api.sh
#   coolify_api GET /servers
#   coolify_api POST /applications '{"project_uuid":"...","server_uuid":"..."}'
#   coolify_api PATCH /applications/abc-123 '{"name":"new-name"}'
#   coolify_api DELETE /applications/abc-123

coolify_api() {
  local method="$1" path="$2" body="$3"

  if [ -z "$COOLIFY_URL" ] || [ -z "$COOLIFY_TOKEN" ]; then
    echo "Error: Set COOLIFY_URL and COOLIFY_TOKEN env vars" >&2
    return 1
  fi

  local args=(
    -s -X "$method"
    -H "Authorization: Bearer $COOLIFY_TOKEN"
    -H "Content-Type: application/json"
    -H "Accept: application/json"
  )

  if [ -n "$body" ]; then
    args+=(-d "$body")
  fi

  curl "${args[@]}" "${COOLIFY_URL}${path}"
}

# Convenience wrappers

coolify_list_servers()  { coolify_api GET /servers; }
coolify_list_projects() { coolify_api GET /projects; }
coolify_list_apps()     { coolify_api GET /applications; }
coolify_list_dbs()      { coolify_api GET /databases; }
coolify_list_services() { coolify_api GET /services; }
coolify_list_teams()    { coolify_api GET /teams; }
coolify_version()       { coolify_api GET /version; }

coolify_app_start()   { coolify_api GET "/applications/$1/start"; }
coolify_app_stop()    { coolify_api GET "/applications/$1/stop"; }
coolify_app_restart() { coolify_api GET "/applications/$1/restart"; }
coolify_app_logs()    { coolify_api GET "/applications/$1/logs"; }

coolify_db_start()   { coolify_api GET "/databases/$1/start"; }
coolify_db_stop()    { coolify_api GET "/databases/$1/stop"; }
coolify_db_restart() { coolify_api GET "/databases/$1/restart"; }

coolify_svc_start()   { coolify_api GET "/services/$1/start"; }
coolify_svc_stop()    { coolify_api GET "/services/$1/stop"; }
coolify_svc_restart() { coolify_api GET "/services/$1/restart"; }

coolify_deploy_tag() { coolify_api GET "/deployments/deploy?tag=$1&uuid=$2"; }
