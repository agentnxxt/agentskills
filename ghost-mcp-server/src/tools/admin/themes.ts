import type { GhostAdminClient } from "../../admin-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "admin_list_themes",
    api: "admin",
    description: "List all installed themes.",
    inputSchema: { type: "object", properties: {} },
    handler: async (client) => (client as GhostAdminClient).get("/themes/"),
  },
  {
    name: "admin_activate_theme",
    api: "admin",
    description: "Activate an installed theme by name.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Theme name e.g. casper, dawn, source" },
      },
    },
    handler: async (client, args) =>
      (client as GhostAdminClient).put(`/themes/${(args as Record<string, string>).name}/activate/`, {}),
  },
];
