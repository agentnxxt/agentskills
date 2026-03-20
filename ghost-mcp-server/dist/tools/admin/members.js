export const tools = [
    {
        name: "admin_list_members",
        api: "admin",
        description: "List members/subscribers. Filter by status, newsletter subscription, labels, etc.",
        inputSchema: {
            type: "object",
            properties: {
                limit: { type: "string" },
                page: { type: "string" },
                filter: { type: "string", description: "e.g. 'status:paid', 'subscribed:true', 'label:vip'" },
                order: { type: "string" },
                include: { type: "string", description: "tiers,newsletters,labels,email_suppressions" },
                fields: { type: "string" },
            },
        },
        handler: async (client, args) => client.get("/members/", args),
    },
    {
        name: "admin_get_member",
        api: "admin",
        description: "Get a member by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                include: { type: "string", description: "tiers,newsletters,labels,email_suppressions" },
            },
        },
        handler: async (client, args) => {
            const { id, ...params } = args;
            return client.get(`/members/${id}/`, params);
        },
    },
    {
        name: "admin_create_member",
        api: "admin",
        description: "Create a new member/subscriber.",
        inputSchema: {
            type: "object",
            required: ["email"],
            properties: {
                email: { type: "string" },
                name: { type: "string" },
                note: { type: "string" },
                labels: { type: "array", items: { type: "object" }, description: "[{name: 'label'}]" },
                newsletters: { type: "array", items: { type: "object" }, description: "[{id: 'nlId'}]" },
                tiers: { type: "array", items: { type: "object" }, description: "[{id: 'tierId'}]" },
                geolocation: { type: "string" },
                email_disabled: { type: "boolean" },
            },
        },
        handler: async (client, args) => client.post("/members/", { members: [args] }),
    },
    {
        name: "admin_update_member",
        api: "admin",
        description: "Update a member by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                email: { type: "string" },
                name: { type: "string" },
                note: { type: "string" },
                labels: { type: "array", items: { type: "object" } },
                newsletters: { type: "array", items: { type: "object" } },
                tiers: { type: "array", items: { type: "object" } },
                email_disabled: { type: "boolean" },
            },
        },
        handler: async (client, args) => {
            const { id, ...body } = args;
            return client.put(`/members/${id}/`, { members: [body] });
        },
    },
    {
        name: "admin_delete_member",
        api: "admin",
        description: "Delete a member by ID. Optionally cancel their active Stripe subscriptions.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                cancel_subscriptions: { type: "boolean", description: "Cancel Stripe subscriptions" },
            },
        },
        handler: async (client, args) => {
            const { id, cancel_subscriptions } = args;
            const path = cancel_subscriptions
                ? `/members/${id}/?cancel_subscriptions=true`
                : `/members/${id}/`;
            return client.delete(path);
        },
    },
    {
        name: "admin_list_member_subscriptions",
        api: "admin",
        description: "Get all Stripe subscriptions for a member.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
        },
        handler: async (client, args) => client.get(`/members/${args.id}/subscriptions/`),
    },
    {
        name: "admin_create_member_complimentary_subscription",
        api: "admin",
        description: "Grant a member a complimentary paid subscription.",
        inputSchema: {
            type: "object",
            required: ["id", "tier_id"],
            properties: {
                id: { type: "string", description: "Member ID" },
                tier_id: { type: "string", description: "Tier ID to grant access to" },
                expiry_at: { type: "string", description: "Optional ISO 8601 expiry date" },
            },
        },
        handler: async (client, args) => {
            const { id, ...body } = args;
            return client.post(`/members/${id}/subscriptions/`, body);
        },
    },
];
//# sourceMappingURL=members.js.map