const GHOST_EVENTS = [
    "site.changed",
    "post.added", "post.deleted", "post.edited", "post.published",
    "post.published.edited", "post.unpublished", "post.scheduled",
    "post.unscheduled", "post.rescheduled",
    "page.added", "page.deleted", "page.edited", "page.published",
    "page.published.edited", "page.unpublished",
    "tag.added", "tag.edited", "tag.deleted",
    "member.added", "member.edited", "member.deleted",
    "subscriber.added", "subscriber.removed",
];
export const tools = [
    {
        name: "admin_create_webhook",
        api: "admin",
        description: "Register a webhook to receive Ghost events via HTTP POST.",
        inputSchema: {
            type: "object",
            required: ["event", "target_url", "integration_id"],
            properties: {
                event: { type: "string", enum: GHOST_EVENTS, description: "Ghost event to subscribe to" },
                target_url: { type: "string", description: "HTTPS URL to receive the webhook payload" },
                name: { type: "string", description: "Friendly name for this webhook" },
                secret: { type: "string", description: "Secret for HMAC-SHA256 payload signing" },
                api_version: { type: "string", description: "API version e.g. v5.0" },
                integration_id: { type: "string", description: "ID of the integration this webhook belongs to" },
            },
        },
        handler: async (client, args) => client.post("/webhooks/", { webhooks: [args] }),
    },
    {
        name: "admin_update_webhook",
        api: "admin",
        description: "Update a webhook by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                event: { type: "string", enum: GHOST_EVENTS },
                target_url: { type: "string" },
                name: { type: "string" },
                secret: { type: "string" },
            },
        },
        handler: async (client, args) => {
            const { id, ...body } = args;
            return client.put(`/webhooks/${id}/`, { webhooks: [body] });
        },
    },
    {
        name: "admin_delete_webhook",
        api: "admin",
        description: "Delete a webhook by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
        },
        handler: async (client, args) => client.delete(`/webhooks/${args.id}/`),
    },
];
//# sourceMappingURL=webhooks.js.map