import type { GhostAdminClient } from "./admin-client.js";
import type { GhostContentClient } from "./content-client.js";

export interface Tool {
  name: string;
  api: "admin" | "content";
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    client: GhostAdminClient | GhostContentClient,
    args: Record<string, unknown>
  ) => Promise<unknown>;
}
