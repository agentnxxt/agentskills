import type { GhostAdminClient } from "../../admin-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "admin_list_tiers",
    api: "admin",
    description: "List all membership tiers (free and paid).",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "string" },
        filter: { type: "string", description: "e.g. 'type:paid', 'active:true'" },
        include: { type: "string", description: "monthly_price,yearly_price,benefits" },
        order: { type: "string" },
      },
    },
    handler: async (client, args) =>
      (client as GhostAdminClient).get("/tiers/", args as Record<string, string>),
  },
  {
    name: "admin_get_tier",
    api: "admin",
    description: "Get a tier by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        include: { type: "string", description: "monthly_price,yearly_price,benefits" },
      },
    },
    handler: async (client, args) => {
      const { id, ...params } = args as Record<string, string>;
      return (client as GhostAdminClient).get(`/tiers/${id}/`, params);
    },
  },
  {
    name: "admin_create_tier",
    api: "admin",
    description: "Create a new paid membership tier.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        welcome_page_url: { type: "string" },
        visibility: { type: "string", enum: ["public", "none"] },
        benefits: { type: "array", items: { type: "string" }, description: "List of benefit strings" },
        monthly_price: { type: "object", description: "{amount: 500, currency: 'usd'} (amount in cents)" },
        yearly_price: { type: "object", description: "{amount: 5000, currency: 'usd'} (amount in cents)" },
        trial_days: { type: "number", description: "Free trial length in days" },
        feature_image: { type: "string" },
      },
    },
    handler: async (client, args) =>
      (client as GhostAdminClient).post("/tiers/", { tiers: [args] }),
  },
  {
    name: "admin_update_tier",
    api: "admin",
    description: "Update a tier by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        visibility: { type: "string", enum: ["public", "none"] },
        benefits: { type: "array", items: { type: "string" } },
        monthly_price: { type: "object" },
        yearly_price: { type: "object" },
        trial_days: { type: "number" },
        welcome_page_url: { type: "string" },
        active: { type: "boolean" },
        feature_image: { type: "string" },
      },
    },
    handler: async (client, args) => {
      const { id, ...body } = args as Record<string, unknown>;
      return (client as GhostAdminClient).put(`/tiers/${id}/`, { tiers: [body] });
    },
  },
];
