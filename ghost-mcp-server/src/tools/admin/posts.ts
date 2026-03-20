import type { GhostAdminClient } from "../../admin-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "admin_list_posts",
    api: "admin",
    description: "List posts via Admin API. Supports filtering, pagination, ordering, and field selection.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "string", description: "Number of results to return (default 15, use 'all' for all)" },
        page: { type: "string", description: "Page number for pagination" },
        filter: { type: "string", description: "Ghost filter string e.g. 'status:published+featured:true'" },
        order: { type: "string", description: "Order results e.g. 'published_at DESC'" },
        include: { type: "string", description: "Comma-separated relations: authors,tags" },
        fields: { type: "string", description: "Comma-separated fields to return" },
        formats: { type: "string", description: "Content formats: html,mobiledoc,lexical,plaintext" },
      },
    },
    handler: async (client, args) =>
      (client as GhostAdminClient).get("/posts/", args as Record<string, string>),
  },
  {
    name: "admin_get_post",
    api: "admin",
    description: "Get a single post by ID or slug via Admin API.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Post ID" },
        slug: { type: "string", description: "Post slug (alternative to id)" },
        include: { type: "string", description: "authors,tags" },
        formats: { type: "string", description: "html,mobiledoc,lexical,plaintext" },
        fields: { type: "string" },
      },
    },
    handler: async (client, args) => {
      const { id, slug, ...params } = args as Record<string, string>;
      const c = client as GhostAdminClient;
      if (slug) return c.get(`/posts/slug/${slug}/`, params);
      return c.get(`/posts/${id}/`, params);
    },
  },
  {
    name: "admin_create_post",
    api: "admin",
    description: "Create a new post. Use status 'published' to publish immediately or 'scheduled' with published_at to schedule.",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        html: { type: "string", description: "HTML content body" },
        lexical: { type: "string", description: "Lexical editor JSON string" },
        mobiledoc: { type: "string", description: "Mobiledoc JSON string (legacy)" },
        status: { type: "string", enum: ["draft", "published", "scheduled"], default: "draft" },
        slug: { type: "string" },
        featured: { type: "boolean" },
        tags: { type: "array", items: { type: "object" }, description: "e.g. [{name: 'News'}, {slug: 'tech'}]" },
        authors: { type: "array", items: { type: "object" }, description: "e.g. [{id: 'authorId'}]" },
        custom_excerpt: { type: "string" },
        published_at: { type: "string", description: "ISO 8601 datetime for scheduling" },
        visibility: { type: "string", enum: ["public", "members", "paid", "tiers"] },
        canonical_url: { type: "string" },
        og_title: { type: "string" },
        og_description: { type: "string" },
        og_image: { type: "string" },
        twitter_title: { type: "string" },
        twitter_description: { type: "string" },
        twitter_image: { type: "string" },
        meta_title: { type: "string" },
        meta_description: { type: "string" },
        email_only: { type: "boolean" },
        tiers: { type: "array", items: { type: "object" }, description: "Restrict to specific tiers" },
        newsletter: { type: "object", description: "{id: 'newsletterId'} to send as email" },
        email_segment: { type: "string", description: "Segment filter for email: all, free, paid" },
      },
    },
    handler: async (client, args) =>
      (client as GhostAdminClient).post("/posts/", { posts: [args] }),
  },
  {
    name: "admin_update_post",
    api: "admin",
    description: "Update a post. Must include updated_at matching the current value to prevent conflicts.",
    inputSchema: {
      type: "object",
      required: ["id", "updated_at"],
      properties: {
        id: { type: "string" },
        updated_at: { type: "string", description: "Current updated_at timestamp (conflict guard)" },
        title: { type: "string" },
        html: { type: "string" },
        lexical: { type: "string" },
        status: { type: "string", enum: ["draft", "published", "scheduled"] },
        slug: { type: "string" },
        featured: { type: "boolean" },
        tags: { type: "array", items: { type: "object" } },
        authors: { type: "array", items: { type: "object" } },
        visibility: { type: "string" },
        published_at: { type: "string" },
        custom_excerpt: { type: "string" },
        og_title: { type: "string" },
        og_description: { type: "string" },
        twitter_title: { type: "string" },
        twitter_description: { type: "string" },
        meta_title: { type: "string" },
        meta_description: { type: "string" },
        canonical_url: { type: "string" },
        email_only: { type: "boolean" },
      },
    },
    handler: async (client, args) => {
      const { id, ...body } = args as Record<string, unknown>;
      return (client as GhostAdminClient).put(`/posts/${id}/`, { posts: [body] });
    },
  },
  {
    name: "admin_delete_post",
    api: "admin",
    description: "Permanently delete a post by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string", description: "Post ID" } },
    },
    handler: async (client, args) =>
      (client as GhostAdminClient).delete(`/posts/${(args as Record<string, string>).id}/`),
  },
];
