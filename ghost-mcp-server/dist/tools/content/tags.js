export const tools = [
    {
        name: "content_list_tags",
        api: "content",
        description: "List public tags via the Content API.",
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
        name: "content_get_tag",
        api: "content",
        description: "Get a tag by ID or slug via the Content API.",
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
            const { id, slug, ...params } = args;
            const c = client;
            if (slug)
                return c.get(`/tags/slug/${slug}/`, params);
            return c.get(`/tags/${id}/`, params);
        },
    },
];
//# sourceMappingURL=tags.js.map