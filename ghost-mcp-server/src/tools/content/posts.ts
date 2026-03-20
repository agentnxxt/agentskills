import type { GhostContentClient } from "../../content-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "content_list_posts",
    api: "content",
    description: "List published posts via the public Content API. Supports filtering, pagination, ordering.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "string", description: "Number of results (default 15, use 'all' for all)" },
        page: { type: "string", description: "Page number" },
        filter: { type: "string", description: "Ghost filter e.g. 'tag:news+featured:true'" },
        order: { type: "string", description: "e.g. 'published_at DESC'" },
        include: { type: "string", description: "authors,tags" },
        fields: { type: "string", description: "Comma-separated fields to return" },
        formats: { type: "string", description: "html,plaintext" },
      },
    },
    handler: async (client, args) =>
      (client as GhostContentClient).get("/posts/", args as Record<string, string>),
  },
  {
    name: "content_get_post",
    api: "content",
    description: "Get a single published post by ID or slug.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        slug: { type: "string" },
        include: { type: "string", description: "authors,tags" },
        formats: { type: "string", description: "html,plaintext" },
        fields: { type: "string" },
      },
    },
    handler: async (client, args) => {
      const { id, slug, ...params } = args as Record<string, string>;
      const c = client as GhostContentClient;
      if (slug) return c.get(`/posts/slug/${slug}/`, params);
      return c.get(`/posts/${id}/`, params);
    },
  },
];
