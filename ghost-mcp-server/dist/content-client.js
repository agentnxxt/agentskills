export class GhostContentClient {
    baseUrl;
    contentApiKey;
    version;
    constructor(url, contentApiKey, version = "v5.0") {
        this.baseUrl = url.replace(/\/$/, "");
        this.contentApiKey = contentApiKey;
        this.version = version;
    }
    endpoint(path) {
        return `${this.baseUrl}/ghost/api/content${path}`;
    }
    async get(path, params) {
        const url = new URL(this.endpoint(path));
        url.searchParams.set("key", this.contentApiKey);
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v !== undefined && v !== "")
                    url.searchParams.set(k, v);
            });
        }
        const res = await fetch(url.toString(), {
            headers: { "Accept-Version": this.version },
        });
        if (!res.ok)
            throw new Error(`Ghost Content API ${res.status}: ${await res.text()}`);
        return res.json();
    }
}
//# sourceMappingURL=content-client.js.map