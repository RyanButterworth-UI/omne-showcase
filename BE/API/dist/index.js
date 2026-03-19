import { createApp } from "./app.js";
import { env, hasUpstreamToken } from "./config/env.js";
const app = createApp();
app.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port} | upstream token configured: ${hasUpstreamToken()}`);
});
