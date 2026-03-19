import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { getPool } from "./data/pool.js";
import { createOpenApiHandler } from "./openapi.js";
import { createDashboardRepository } from "./repositories/dashboard.repository.js";
import { createDataRouter } from "./routes/data.routes.js";
import { createDashboardService, } from "./services/dashboard.service.js";
import { createHealthService, } from "./services/health.service.js";
export function createApp(options = {}) {
    const app = express();
    let repository;
    function getRepository() {
        repository ??= createDashboardRepository(getPool());
        return repository;
    }
    const dashboardService = options.dashboardService ??
        createDashboardService(getRepository(), {
            failureRate: env.failureRate,
        });
    const healthService = options.healthService ??
        createHealthService(getRepository(), {
            failureRate: env.failureRate,
        });
    app.use(cors({
        origin: env.allowedOrigin,
    }));
    app.use(express.json());
    app.get("/openapi.json", createOpenApiHandler());
    app.get("/health", createHealthHandler(healthService));
    app.use("/api", createDataRouter({
        dashboardService,
    }));
    return app;
}
export function createHealthHandler(healthService) {
    return async (_request, response) => {
        const status = await healthService.getStatus();
        response.status(status.database.connected ? 200 : 503).json(status);
    };
}
