export const tools = [
    {
        name: "admin_list_newsletters",
        api: "admin",
        description: "List all newsletters.",
        inputSchema: {
            type: "object",
            properties: {
                limit: { type: "string" },
                filter: { type: "string", description: "e.g. 'status:active'" },
                include: { type: "string", description: "count.members,count.posts" },
            },
        },
        handler: async (client, args) => client.get("/newsletters/", args),
    },
    {
        name: "admin_get_newsletter",
        api: "admin",
        description: "Get a newsletter by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                include: { type: "string" },
            },
        },
        handler: async (client, args) => {
            const { id, ...params } = args;
            return client.get(`/newsletters/${id}/`, params);
        },
    },
    {
        name: "admin_create_newsletter",
        api: "admin",
        description: "Create a new newsletter.",
        inputSchema: {
            type: "object",
            required: ["name"],
            properties: {
                name: { type: "string" },
                description: { type: "string" },
                sender_name: { type: "string" },
                sender_email: { type: "string" },
                sender_reply_to: { type: "string", enum: ["newsletter", "support"] },
                status: { type: "string", enum: ["active", "archived"] },
                visibility: { type: "string", enum: ["members", "paid"] },
                subscribe_on_signup: { type: "boolean" },
                sort_order: { type: "number" },
                header_image: { type: "string" },
                show_header_icon: { type: "boolean" },
                show_header_title: { type: "boolean" },
                show_header_name: { type: "boolean" },
                title_font_category: { type: "string", enum: ["serif", "sans_serif"] },
                title_alignment: { type: "string", enum: ["center", "left"] },
                show_feature_image: { type: "boolean" },
                body_font_category: { type: "string", enum: ["serif", "sans_serif"] },
                footer_content: { type: "string" },
                show_badge: { type: "boolean" },
                feedback_enabled: { type: "boolean" },
                opt_in_existing: { type: "boolean", description: "Subscribe existing members on creation" },
            },
        },
        handler: async (client, args) => client.post("/newsletters/", { newsletters: [args] }),
    },
    {
        name: "admin_update_newsletter",
        api: "admin",
        description: "Update a newsletter by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                name: { type: "string" },
                description: { type: "string" },
                status: { type: "string", enum: ["active", "archived"] },
                sender_name: { type: "string" },
                sender_email: { type: "string" },
                sender_reply_to: { type: "string" },
                subscribe_on_signup: { type: "boolean" },
                visibility: { type: "string" },
                header_image: { type: "string" },
                show_header_icon: { type: "boolean" },
                show_header_title: { type: "boolean" },
                title_font_category: { type: "string" },
                body_font_category: { type: "string" },
                show_badge: { type: "boolean" },
                feedback_enabled: { type: "boolean" },
                footer_content: { type: "string" },
            },
        },
        handler: async (client, args) => {
            const { id, ...body } = args;
            return client.put(`/newsletters/${id}/`, { newsletters: [body] });
        },
    },
];
//# sourceMappingURL=newsletters.js.map