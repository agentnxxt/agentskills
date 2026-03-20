export const tools = [
    {
        name: "admin_list_themes",
        api: "admin",
        description: "List all installed themes.",
        inputSchema: { type: "object", properties: {} },
        handler: async (client) => client.get("/themes/"),
    },
    {
        name: "admin_activate_theme",
        api: "admin",
        description: "Activate an installed theme by name.",
        inputSchema: {
            type: "object",
            required: ["name"],
            properties: {
                name: { type: "string", description: "Theme name e.g. casper, dawn, source" },
            },
        },
        handler: async (client, args) => client.put(`/themes/${args.name}/activate/`, {}),
    },
];
//# sourceMappingURL=themes.js.map