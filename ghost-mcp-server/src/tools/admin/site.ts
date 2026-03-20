import type { GhostAdminClient } from "../../admin-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "admin_get_site",
    api: "admin",
    description: "Get public site information (title, description, url, version).",
    inputSchema: { type: "object", properties: {} },
    handler: async (client) => (client as GhostAdminClient).get("/site/"),
  },
  {
    name: "admin_get_settings",
    api: "admin",
    description: "Get all Ghost site settings (title, description, logo, SEO, social, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        group: {
          type: "string",
          description: "Filter by group: site, theme, private, members, email, amp, labs, slack, unsplash, views, firstpromoter, portal, announcement, comments, analytics",
        },
      },
    },
    handler: async (client, args) =>
      (client as GhostAdminClient).get("/settings/", args as Record<string, string>),
  },
  {
    name: "admin_update_settings",
    api: "admin",
    description: "Update Ghost site settings. Pass an array of {key, value} pairs.",
    inputSchema: {
      type: "object",
      required: ["settings"],
      properties: {
        settings: {
          type: "array",
          items: {
            type: "object",
            required: ["key", "value"],
            properties: {
              key: { type: "string", description: "Setting key e.g. title, description, logo, cover_image, icon, accent_color, lang, timezone, navigation, secondary_navigation, meta_title, meta_description, og_title, og_description, twitter_title, twitter_description, members_support_address, default_content_visibility, portal_plans, portal_name, portal_button" },
              value: { description: "Setting value (string, boolean, array, or object)" },
            },
          },
          description: "Array of settings to update",
        },
      },
    },
    handler: async (client, args) => {
      const { settings } = args as { settings: unknown[] };
      return (client as GhostAdminClient).put("/settings/", { settings });
    },
  },
];
