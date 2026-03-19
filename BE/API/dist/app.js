import cors from "cors";
import express from "express";
import { env, hasUpstreamToken } from "./config/env.js";
import { dataRouter } from "./routes/data.routes.js";
export function createApp() {
    const app = express();
    app.use(cors({
        origin: env.allowedOrigin,
    }));
    app.use(express.json());
    app.get("/health", (_request, response) => {
        response.json({
            service: "@omne-showcase/api",
            status: "ok",
            upstreamConfigured: hasUpstreamToken(),
        });
    });
    app.use("/api", dataRouter);
    return app;
}
