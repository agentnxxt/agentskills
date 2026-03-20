export const tools = [
    {
        name: "admin_list_offers",
        api: "admin",
        description: "List all discount offers.",
        inputSchema: {
            type: "object",
            properties: {
                limit: { type: "string" },
                filter: { type: "string", description: "e.g. 'status:active'" },
            },
        },
        handler: async (client, args) => client.get("/offers/", args),
    },
    {
        name: "admin_get_offer",
        api: "admin",
        description: "Get an offer by ID.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
        },
        handler: async (client, args) => client.get(`/offers/${args.id}/`),
    },
    {
        name: "admin_create_offer",
        api: "admin",
        description: "Create a discount offer (promo code) for a membership tier.",
        inputSchema: {
            type: "object",
            required: ["name", "code", "tier", "cadence", "amount", "type"],
            properties: {
                name: { type: "string", description: "Internal name for the offer" },
                code: { type: "string", description: "Promo code string e.g. WELCOME20" },
                display_title: { type: "string", description: "Public-facing title" },
                display_description: { type: "string" },
                type: { type: "string", enum: ["percent", "fixed", "trial"], description: "Discount type" },
                amount: { type: "number", description: "Percent (0-100), fixed amount in cents, or trial days" },
                cadence: { type: "string", enum: ["month", "year"] },
                currency: { type: "string", description: "ISO currency code, required for fixed type" },
                duration: { type: "string", enum: ["once", "forever", "repeating", "trial"] },
                duration_in_months: { type: "number", description: "Required when duration is repeating" },
                tier: { type: "object", description: "{id: 'tierId'}" },
            },
        },
        handler: async (client, args) => client.post("/offers/", { offers: [args] }),
    },
    {
        name: "admin_update_offer",
        api: "admin",
        description: "Update an offer. Note: only name, code, display_title, display_description and status can be changed after creation.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string" },
                name: { type: "string" },
                code: { type: "string" },
                display_title: { type: "string" },
                display_description: { type: "string" },
                status: { type: "string", enum: ["active", "archived"] },
            },
        },
        handler: async (client, args) => {
            const { id, ...body } = args;
            return client.put(`/offers/${id}/`, { offers: [body] });
        },
    },
];
//# sourceMappingURL=offers.js.map