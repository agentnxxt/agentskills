import { generateAdminToken } from "./auth.js";

export class GhostAdminClient {
  readonly baseUrl: string;
  private adminApiKey: string;
  private version: string;

  constructor(url: string, adminApiKey: string, version = "v5.0") {
    this.baseUrl = url.replace(/\/$/, "");
    this.adminApiKey = adminApiKey;
    this.version = version;
  }

  async authHeaders(): Promise<Record<string, string>> {
    const token = await generateAdminToken(this.adminApiKey);
    return {
      Authorization: `Ghost ${token}`,
      "Content-Type": "application/json",
      "Accept-Version": this.version,
    };
  }

  endpoint(path: string) {
    return `${this.baseUrl}/ghost/api/admin${path}`;
  }

  async get(path: string, params?: Record<string, string>) {
    const url = new URL(this.endpoint(path));
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") url.searchParams.set(k, v);
      });
    }
    const res = await fetch(url.toString(), { headers: await this.authHeaders() });
    if (!res.ok) throw new Error(`Ghost Admin API ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async post(path: string, body: unknown) {
    const res = await fetch(this.endpoint(path), {
      method: "POST",
      headers: await this.authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Ghost Admin API ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async put(path: string, body: unknown) {
    const res = await fetch(this.endpoint(path), {
      method: "PUT",
      headers: await this.authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Ghost Admin API ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async delete(path: string) {
    const res = await fetch(this.endpoint(path), {
      method: "DELETE",
      headers: await this.authHeaders(),
    });
    if (res.status === 204) return { success: true };
    if (!res.ok) throw new Error(`Ghost Admin API ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async postFormData(path: string, form: FormData) {
    const headers = await this.authHeaders();
    // Remove Content-Type so fetch sets multipart boundary automatically
    delete headers["Content-Type"];
    const res = await fetch(this.endpoint(path), {
      method: "POST",
      headers,
      body: form,
    });
    if (!res.ok) throw new Error(`Ghost Admin API ${res.status}: ${await res.text()}`);
    return res.json();
  }
}
