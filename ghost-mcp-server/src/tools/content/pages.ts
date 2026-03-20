import type { GhostContentClient } from "../../content-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "content_list_pages",
    api: "content",
    description: "List published static pages via the public Content API.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "string" },
        page: { type: "string" },
        filter: { type: "string" },
        order: { type: "string" },
        include: { type: "string", description: "authors,tags" },
        fields: { type: "string" },
        formats: { type: "string", description: "html,plaintext" },
      },
    },
    handler: async (client, args) =>
      (client as GhostContentClient).get("/pages/", args as Record<string, string>),
  },
  {
    name: "content_get_page",
    api: "content",
    description: "Get a single published page by ID or slug.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        slug: { type: "string" },
        include: { type: "string" },
        formats: { type: "string" },
        fields: { type: "string" },
      },
    },
    handler: async (client, args) => {
      const { id, slug, ...params } = args as Record<string, string>;
      const c = client as GhostContentClient;
      if (slug) return c.get(`/pages/slug/${slug}/`, params);
      return c.get(`/pages/${id}/`, params);
    },
  },
];
