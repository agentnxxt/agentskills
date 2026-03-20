import type { GhostContentClient } from "../../content-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "content_list_authors",
    api: "content",
    description: "List public authors via the Content API.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "string" },
        page: { type: "string" },
        filter: { type: "string" },
        order: { type: "string" },
        include: { type: "string", description: "count.posts" },
        fields: { type: "string" },
      },
    },
    handler: async (client, args) =>
      (client as GhostContentClient).get("/authors/", args as Record<string, string>),
  },
  {
    name: "content_get_author",
    api: "content",
    description: "Get an author by ID or slug via the Content API.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        slug: { type: "string" },
        include: { type: "string", description: "count.posts" },
        fields: { type: "string" },
      },
    },
    handler: async (client, args) => {
      const { id, slug, ...params } = args as Record<string, string>;
      const c = client as GhostContentClient;
      if (slug) return c.get(`/authors/slug/${slug}/`, params);
      return c.get(`/authors/${id}/`, params);
    },
  },
];
