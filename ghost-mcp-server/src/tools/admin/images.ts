import type { GhostAdminClient } from "../../admin-client.js";
import type { Tool } from "../../types.js";

export const tools: Tool[] = [
  {
    name: "admin_upload_image",
    api: "admin",
    description: "Upload an image to Ghost from a public URL. Returns the stored image URL for use in posts/pages.",
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", description: "Public URL of the image to fetch and upload" },
        ref: { type: "string", description: "Filename/reference for the image" },
        purpose: {
          type: "string",
          enum: ["image", "profile_image", "icon"],
          default: "image",
          description: "How the image will be used",
        },
      },
    },
    handler: async (client, args) => {
      const { url, ref, purpose } = args as Record<string, string>;
      const c = client as GhostAdminClient;

      const imageRes = await fetch(url);
      if (!imageRes.ok) throw new Error(`Failed to fetch image from ${url}: ${imageRes.status}`);

      const blob = await imageRes.blob();
      const filename = ref || url.split("/").pop() || "upload.jpg";

      const form = new FormData();
      form.append("file", blob, filename);
      form.append("purpose", purpose || "image");
      if (ref) form.append("ref", ref);

      return c.postFormData("/images/upload/", form);
    },
  },
];
