import {
  NotFoundError,
  SimulatedFailureError,
  ValidationError,
} from "../errors.js";
import type { DashboardRepository } from "../repositories/dashboard.repository.js";
import type {
  DashboardDetailResponse,
  DashboardListResponse,
} from "../types/dashboard.types.js";

type DashboardDataInput = {
  id?: string;
};

type DashboardListInput = {
  page: number;
  pageSize: number;
};

export type DashboardService = {
  getDashboardData(input: DashboardDataInput): Promise<DashboardDetailResponse>;
  listDashboardData(input: DashboardListInput): Promise<DashboardListResponse>;
};

type DashboardServiceOptions = {
  failureRate: number;
  random?: () => number;
};

function normalizeFailureRate(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function createDashboardService(
  repository: DashboardRepository,
  options: DashboardServiceOptions,
): DashboardService {
  const failureRate = normalizeFailureRate(options.failureRate);
  const random = options.random ?? Math.random;

  return {
    async getDashboardData({ id }) {
      if (failureRate > 0 && random() < failureRate) {
        throw new SimulatedFailureError();
      }

      const order = id
        ? await repository.getProductionOrderById(id)
        : await repository.getLatestProductionOrder();

      if (!order) {
        throw new NotFoundError("Dashboard record not found.");
      }

      const childCollections = await repository.getChildCollections(order.id);

      return {
        ...order,
        ...childCollections,
      };
    },

    async listDashboardData({ page, pageSize }) {
      if (!Number.isInteger(page) || page < 1) {
        throw new ValidationError("Page must be a positive integer.");
      }

      if (!Number.isInteger(pageSize) || pageSize < 1) {
        throw new ValidationError("Page size must be a positive integer.");
      }

      const result = await repository.listProductionOrders({
        page,
        pageSize,
      });

      return {
        items: result.items,
        page,
        pageSize,
        total: result.total,
        totalPages: result.total === 0 ? 0 : Math.ceil(result.total / pageSize),
      };
    },
  };
}
