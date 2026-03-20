export const tools = [
    {
        name: "admin_list_tags",
        api: "admin",
        description: "List all tags. Include count.posts to get post count per tag.",
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
        handler: async (client, args) => client.get("/tags/", args),
    },
    {
        name: "admin_get_tag",
        api: "admin",
        description: "Get a tag by ID or slug.",
        inputSchema: {
            type: "object",
            properties: {
                id: { type: "string" },
                slug: { type: "string" },
                include: { type: "string" },
            },
        },
        handler: async (client, args) => {
            const { id, slug, ...params } = args;
            const c = client;
            if (slug)
                return c.get(`/tags/slug/${slug}/`, params);
            return c.get(`/tags/${id}/`, params);
        },
    },
    {
        name: "admin_create_tag",
        api: "admin",
        description: "Create a new tag.",
        inputSchema: {
            type: "object",
            required: ["name"],
            properties: {
                name: { type: "string" },
                slug: { type: "string" },
                description: { type: "string" },
                visibility: { type: "string", enum: ["public", "internal"] },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
                og_title: { type: "string" },
                og_description: { type: "string" },
                og_image: { type: "string" },
                twitter_title: { type: "string" },
                twitter_description: { type: "string" },
                twitter_image: { type: "string" },
                canonical_url: { type: "string" },
                accent_color: { type: "string", description: "Hex color e.g. #ff0000" },
                feature_image: { type: "string" },
            },
        },
        handler: async (client, args) => client.post("/tags/", { tags: [args] }),
    },
    {
        name: "admin_update_tag",
        api: "admin",
        description: "Update a tag by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                name: { type: "string" },
                slug: { type: "string" },
                description: { type: "string" },
                visibility: { type: "string", enum: ["public", "internal"] },
                accent_color: { type: "string" },
                feature_image: { type: "string" },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
            },
        },
        handler: async (client, args) => {
            const { id, ...body } = args;
            return client.put(`/tags/${id}/`, { tags: [body] });
        },
    },
    {
        name: "admin_delete_tag",
        api: "admin",
        description: "Delete a tag by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
        },
        handler: async (client, args) => client.delete(`/tags/${args.id}/`),
    },
];
//# sourceMappingURL=tags.js.map