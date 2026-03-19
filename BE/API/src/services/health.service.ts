import type { DashboardRepository } from "../repositories/dashboard.repository.js";
import type { HealthStatus } from "../types/dashboard.types.js";

export type HealthService = {
  getStatus(): Promise<HealthStatus>;
};

type HealthServiceOptions = {
  failureRate: number;
};

function normalizeFailureRate(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function createHealthService(
  repository: DashboardRepository,
  options: HealthServiceOptions,
): HealthService {
  const failureRate = normalizeFailureRate(options.failureRate);

  return {
    async getStatus() {
      try {
        await repository.ping();
        const seededRecordCount = await repository.countProductionOrders();

        return {
          service: "@omne-showcase/api",
          status: "ok",
          database: {
            status: "ok",
            connected: true,
          },
          failureRate,
          seededRecordCount,
        };
      } catch (error) {
        return {
          service: "@omne-showcase/api",
          status: "degraded",
          database: {
            status: "unavailable",
            connected: false,
            message:
              error instanceof Error
                ? error.message
                : "Unexpected database health-check failure.",
          },
          failureRate,
          seededRecordCount: 0,
        };
      }
    },
  };
}
