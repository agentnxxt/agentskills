export const tools = [
    {
        name: "content_list_tiers",
        api: "content",
        description: "List publicly visible membership tiers via the Content API.",
        inputSchema: {
            type: "object",
            properties: {
                limit: { type: "string" },
                filter: { type: "string" },
                include: { type: "string", description: "monthly_price,yearly_price,benefits" },
                fields: { type: "string" },
            },
        },
        handler: async (client, args) => client.get("/tiers/", args),
    },
];
//# sourceMappingURL=tiers.js.map