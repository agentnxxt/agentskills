import type { GhostContentClient } from "../../content-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "content_list_tiers",
    api: "content",
    description: "List publicly visible membership tiers via the Content API.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "string" },
        filter: { type: "string" },
        include: { type: "string", description: "monthly_price,yearly_price,benefits" },
        fields: { type: "string" },
      },
    },
    handler: async (client, args) =>
      (client as GhostContentClient).get("/tiers/", args as Record<string, string>),
  },
];
