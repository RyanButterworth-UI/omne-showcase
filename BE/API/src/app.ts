import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { getPool } from "./data/pool.js";
import { createDashboardRepository } from "./repositories/dashboard.repository.js";
import { createDataRouter } from "./routes/data.routes.js";
import {
  createDashboardService,
  type DashboardService,
} from "./services/dashboard.service.js";
import {
  createHealthService,
  type HealthService,
} from "./services/health.service.js";

export type CreateAppOptions = {
  dashboardService?: DashboardService;
  healthService?: HealthService;
};

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  let repository:
    | ReturnType<typeof createDashboardRepository>
    | undefined;

  function getRepository() {
    repository ??= createDashboardRepository(getPool());

    return repository;
  }

  const dashboardService =
    options.dashboardService ??
    createDashboardService(getRepository(), {
      failureRate: env.failureRate,
    });
  const healthService =
    options.healthService ??
    createHealthService(getRepository(), {
      failureRate: env.failureRate,
    });

  app.use(
    cors({
      origin: env.allowedOrigin,
    }),
  );
  app.use(express.json());

  app.get("/health", createHealthHandler(healthService));

  app.use(
    "/api",
    createDataRouter({
      dashboardService,
    }),
  );

  return app;
}

export function createHealthHandler(healthService: HealthService) {
  return async (_request: express.Request, response: express.Response) => {
    const status = await healthService.getStatus();

    response.status(status.database.connected ? 200 : 503).json(status);
  };
}
