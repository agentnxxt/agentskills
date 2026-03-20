export const tools = [
    {
        name: "admin_list_users",
        api: "admin",
        description: "List staff users (authors, editors, admins).",
        inputSchema: {
            type: "object",
            properties: {
                limit: { type: "string" },
                page: { type: "string" },
                filter: { type: "string", description: "e.g. 'status:active'" },
                include: { type: "string", description: "roles,count.posts" },
                fields: { type: "string" },
                order: { type: "string" },
            },
        },
        handler: async (client, args) => client.get("/users/", args),
    },
    {
        name: "admin_get_user",
        api: "admin",
        description: "Get a staff user by ID, slug, or use 'me' for the authenticated user.",
        inputSchema: {
            type: "object",
            properties: {
                id: { type: "string", description: "User ID or 'me'" },
                slug: { type: "string" },
                include: { type: "string", description: "roles,count.posts" },
            },
        },
        handler: async (client, args) => {
            const { id, slug, ...params } = args;
            const c = client;
            if (slug)
                return c.get(`/users/slug/${slug}/`, params);
            return c.get(`/users/${id || "me"}/`, params);
        },
    },
    {
        name: "admin_update_user",
        api: "admin",
        description: "Update a staff user's profile.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                name: { type: "string" },
                slug: { type: "string" },
                email: { type: "string" },
                profile_image: { type: "string" },
                cover_image: { type: "string" },
                bio: { type: "string" },
                website: { type: "string" },
                location: { type: "string" },
                facebook: { type: "string" },
                twitter: { type: "string" },
                accessibility: { type: "string" },
                status: { type: "string", enum: ["active", "inactive"] },
                locale: { type: "string" },
                visibility: { type: "string", enum: ["public", "private"] },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
                roles: { type: "array", items: { type: "object" }, description: "[{name: 'Editor'}]" },
            },
        },
        handler: async (client, args) => {
            const { id, ...body } = args;
            return client.put(`/users/${id}/`, { users: [body] });
        },
    },
    {
        name: "admin_delete_user",
        api: "admin",
        description: "Delete a staff user by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
        },
        handler: async (client, args) => client.delete(`/users/${args.id}/`),
    },
];
//# sourceMappingURL=users.js.map