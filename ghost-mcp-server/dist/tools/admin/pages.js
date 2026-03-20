export const tools = [
    {
        name: "admin_list_pages",
        api: "admin",
        description: "List static pages via Admin API.",
        inputSchema: {
            type: "object",
            properties: {
                limit: { type: "string" },
                page: { type: "string" },
                filter: { type: "string" },
                order: { type: "string" },
                include: { type: "string", description: "authors,tags" },
                fields: { type: "string" },
                formats: { type: "string" },
            },
        },
        handler: async (client, args) => client.get("/pages/", args),
    },
    {
        name: "admin_get_page",
        api: "admin",
        description: "Get a single page by ID or slug.",
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
            const { id, slug, ...params } = args;
            const c = client;
            if (slug)
                return c.get(`/pages/slug/${slug}/`, params);
            return c.get(`/pages/${id}/`, params);
        },
    },
    {
        name: "admin_create_page",
        api: "admin",
        description: "Create a new static page.",
        inputSchema: {
            type: "object",
            required: ["title"],
            properties: {
                title: { type: "string" },
                html: { type: "string" },
                lexical: { type: "string" },
                status: { type: "string", enum: ["draft", "published"] },
                slug: { type: "string" },
                featured: { type: "boolean" },
                tags: { type: "array", items: { type: "object" } },
                authors: { type: "array", items: { type: "object" } },
                custom_excerpt: { type: "string" },
                visibility: { type: "string", enum: ["public", "members", "paid"] },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
                og_title: { type: "string" },
                og_description: { type: "string" },
                twitter_title: { type: "string" },
                twitter_description: { type: "string" },
                canonical_url: { type: "string" },
                custom_template: { type: "string" },
            },
        },
        handler: async (client, args) => client.post("/pages/", { pages: [args] }),
    },
    {
        name: "admin_update_page",
        api: "admin",
        description: "Update a page. Must include updated_at for conflict detection.",
        inputSchema: {
            type: "object",
            required: ["id", "updated_at"],
            properties: {
                id: { type: "string" },
                updated_at: { type: "string" },
                title: { type: "string" },
                html: { type: "string" },
                lexical: { type: "string" },
                status: { type: "string" },
                slug: { type: "string" },
                featured: { type: "boolean" },
                visibility: { type: "string" },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
                custom_template: { type: "string" },
            },
        },
        handler: async (client, args) => {
            const { id, ...body } = args;
            return client.put(`/pages/${id}/`, { pages: [body] });
        },
    },
    {
        name: "admin_delete_page",
        api: "admin",
        description: "Permanently delete a page by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
        },
        handler: async (client, args) => client.delete(`/pages/${args.id}/`),
    },
];
//# sourceMappingURL=pages.js.map