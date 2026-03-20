#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { GhostAdminClient } from "./admin-client.js";
import { GhostContentClient } from "./content-client.js";
import { allTools } from "./tools/index.js";
// ── Environment ──────────────────────────────────────────────────────────────
const GHOST_URL = process.env.GHOST_URL;
const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY;
const GHOST_API_VERSION = process.env.GHOST_API_VERSION ?? "v5.0";
if (!GHOST_URL) {
    console.error("Error: GHOST_URL environment variable is required");
    process.exit(1);
}
// ── Clients ───────────────────────────────────────────────────────────────────
const adminClient = GHOST_ADMIN_API_KEY
    ? new GhostAdminClient(GHOST_URL, GHOST_ADMIN_API_KEY, GHOST_API_VERSION)
    : null;
const contentClient = GHOST_CONTENT_API_KEY
    ? new GhostContentClient(GHOST_URL, GHOST_CONTENT_API_KEY, GHOST_API_VERSION)
    : null;
// Log which APIs are available
const adminCount = allTools.filter((t) => t.api === "admin").length;
const contentCount = allTools.filter((t) => t.api === "content").length;
console.error(`Ghost MCP Server starting...`);
console.error(`  URL: ${GHOST_URL}`);
console.error(`  Admin API: ${adminClient ? `✓ (${adminCount} tools)` : "✗ not configured"}`);
console.error(`  Content API: ${contentClient ? `✓ (${contentCount} tools)` : "✗ not configured"}`);
console.error(`  Total tools available: ${(adminClient ? adminCount : 0) + (contentClient ? contentCount : 0)}`);
// ── MCP Server ────────────────────────────────────────────────────────────────
const server = new Server({ name: "ghost-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => {
    // Only expose tools whose client is configured
    const availableTools = allTools.filter((t) => t.api === "admin" ? adminClient !== null : contentClient !== null);
    return {
        tools: availableTools.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
        })),
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;
    const tool = allTools.find((t) => t.name === name);
    if (!tool) {
        return {
            content: [{ type: "text", text: `Unknown tool: ${name}` }],
            isError: true,
        };
    }
    const client = tool.api === "admin" ? adminClient : contentClient;
    if (!client) {
        const envVar = tool.api === "admin" ? "GHOST_ADMIN_API_KEY" : "GHOST_CONTENT_API_KEY";
        return {
            content: [{ type: "text", text: `Tool '${name}' requires ${envVar} to be set` }],
            isError: true,
        };
    }
    try {
        const result = await tool.handler(client, args);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// ── Transport ─────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Ghost MCP Server ready ✓");
//# sourceMappingURL=index.js.map