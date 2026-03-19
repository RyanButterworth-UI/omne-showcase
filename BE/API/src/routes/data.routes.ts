import { Router, type Request, type Response } from "express";
import {
  DataAccessError,
  NotFoundError,
  SimulatedFailureError,
  ValidationError,
} from "../errors.js";
import type { DashboardService } from "../services/dashboard.service.js";

type CreateDataRouterOptions = {
  dashboardService: DashboardService;
};

function readQueryParam(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return undefined;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
  label: string,
) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ValidationError(`${label} must be a positive integer.`);
  }

  return parsed;
}

function respondWithError(response: Response, error: unknown) {
  if (error instanceof ValidationError) {
    response.status(400).json({
      error: "validation_failed",
      message: error.message,
    });
    return;
  }

  if (error instanceof NotFoundError) {
    response.status(404).json({
      error: "dashboard_record_not_found",
      message: error.message,
    });
    return;
  }

  if (error instanceof SimulatedFailureError) {
    response.status(503).json({
      error: "simulated_failure",
      message: error.message,
    });
    return;
  }

  if (error instanceof DataAccessError) {
    response.status(500).json({
      error: "database_request_failed",
      message: error.message,
    });
    return;
  }

  response.status(500).json({
    error: "unexpected_failure",
    message:
      error instanceof Error ? error.message : "Unexpected request failure.",
  });
}

export function createDataRouter({ dashboardService }: CreateDataRouterOptions) {
  const dataRouter = Router();

  dataRouter.get(
    "/dashboard-data/list",
    createListDashboardDataHandler(dashboardService),
  );

  dataRouter.get("/dashboard-data", createGetDashboardDataHandler(dashboardService));

  return dataRouter;
}

export function createListDashboardDataHandler(
  dashboardService: DashboardService,
) {
  return async (request: Request, response: Response) => {
    try {
      const page = parsePositiveInteger(
        readQueryParam(request.query.page),
        1,
        "page",
      );
      const requestedPageSize = parsePositiveInteger(
        readQueryParam(request.query.pageSize),
        25,
        "pageSize",
      );
      const pageSize = Math.min(requestedPageSize, 100);
      const result = await dashboardService.listDashboardData({
        page,
        pageSize,
      });

      response.json(result);
    } catch (error) {
      respondWithError(response, error);
    }
  };
}

export function createGetDashboardDataHandler(
  dashboardService: DashboardService,
) {
  return async (request: Request, response: Response) => {
    try {
      const id = readQueryParam(request.query.id)?.trim();

      if (id && !isUuid(id)) {
        throw new ValidationError("id must be a valid UUID.");
      }

      const result = await dashboardService.getDashboardData({ id });

      response.json(result);
    } catch (error) {
      respondWithError(response, error);
    }
  };
}
