export const tools = [
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
        handler: async (client, args) => client.get("/authors/", args),
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
            const { id, slug, ...params } = args;
            const c = client;
            if (slug)
                return c.get(`/authors/slug/${slug}/`, params);
            return c.get(`/authors/${id}/`, params);
        },
    },
];
//# sourceMappingURL=authors.js.map