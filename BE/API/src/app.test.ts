import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { Request, Response } from "express";
import { createHealthHandler } from "./app.js";
import { DataAccessError, SimulatedFailureError } from "./errors.js";
import {
  createGetDashboardDataHandler,
  createListDashboardDataHandler,
} from "./routes/data.routes.js";
import type {
  DashboardDetailResponse,
  DashboardListResponse,
  HealthStatus,
} from "./types/dashboard.types.js";

const sampleDetail: DashboardDetailResponse = {
  id: "d130bf30-8a4e-4c93-a26e-0a9b43474fa5",
  plantCode: "PLANT-001",
  plantName: "Cape Plant",
  siteRegion: "MEA",
  country: "South Africa",
  productionLineId: "a63ebc95-2e02-49a0-9d4a-0b5155a6f6c7",
  productionLineCode: "LINE-01",
  productionLineName: "Packaging Line 01",
  machineId: "1a3561fb-5dca-4b26-8d0d-fc8a9ede0505",
  machineCode: "MCH-001",
  machineName: "Fill Station 1",
  machineType: "Filler",
  workOrderId: "38d465a5-22e8-4278-a8bc-ede31bfec8e6",
  workOrderNumber: "WO-0001",
  batchNumber: "BATCH-0001",
  productId: "3d09b491-68e2-4c6a-a298-729a0202704e",
  productSku: "SKU-001",
  productName: "Demo Beverage",
  productCategory: "Beverages",
  unitOfMeasure: "cases",
  shiftCode: "SHIFT-A",
  shiftName: "Day Shift",
  operatorId: "3bc7f472-3154-4f0a-9a7e-bdd9e73e49d6",
  operatorName: "Operator One",
  supervisorId: "efecbcae-4ded-48aa-8617-0c6d45e09ada",
  supervisorName: "Supervisor One",
  status: "Running",
  priority: "High",
  plannedStartTime: "2026-01-01",
  plannedEndTime: "2026-01-02",
  actualStartTime: "2026-01-01",
  actualEndTime: "2026-01-02",
  plannedUnits: 1200,
  producedUnits: 1180,
  goodUnits: 1168,
  scrapUnits: 8,
  reworkUnits: 4,
  downtimeMinutes: 18,
  runtimeMinutes: 422,
  availabilityPercent: 95.8,
  performancePercent: 93.4,
  qualityPercent: 99.1,
  oeePercent: 88.7,
  cycleTimeSeconds: 4.2,
  targetCycleTimeSeconds: 4,
  temperatureCelsius: 21.5,
  humidityPercent: 46.2,
  energyConsumptionKwh: 184.7,
  lastMaintenanceDate: "2025-12-18",
  nextMaintenanceDate: "2026-01-15",
  maintenanceRequired: false,
  qualityCheckPassed: true,
  blockedReason: "",
  comments: "Healthy line",
  createdAt: "2025-12-20",
  updatedAt: "2026-01-03",
  inventoryAllocations: [
    {
      id: "52ee3d15-04cb-4a43-81ea-0b900a4ad416",
      materialId: "9891b0fc-82a7-45bb-9f77-71ccd06f0cbe",
      materialCode: "MAT-001",
      materialName: "Bottle Caps",
      lotNumber: "LOT-001",
      warehouseCode: "WH-A",
      binLocation: "A-01",
      quantityAllocated: 250.5,
      unitCost: 12.4,
      totalCost: 3106.2,
      expiryDate: "2026-06-01",
    },
  ],
  qualityChecks: [
    {
      id: "8e37e974-46ff-4654-820c-2a19fd8846ab",
      checkType: "Visual",
      inspectorId: "c45df290-da10-43c9-90e2-0c317c3d36b2",
      inspectorName: "Inspector One",
      result: "Passed",
      defectCode: "DEF-001",
      defectDescription: "Minor label offset",
      sampleSize: 32,
      defectCount: 1,
      checkedAt: "2026-01-01",
    },
  ],
  downtimeEvents: [
    {
      id: "00b35ef9-d0f8-4834-be9b-2f2ff20128ef",
      reasonCode: "DT-01",
      reasonDescription: "Label reel swap",
      startTime: "2026-01-01",
      endTime: "2026-01-01",
      durationMinutes: 18,
      severity: "Medium",
      resolvedBy: "Shift Lead",
    },
  ],
  productionSteps: [
    {
      id: "a358c272-885d-457c-b91a-ee225f0a2741",
      stepNumber: 1,
      stepName: "Mixing",
      workCenterCode: "WC-01",
      status: "Completed",
      plannedDurationMinutes: 60,
      actualDurationMinutes: 57,
      assignedOperator: "Operator One",
      startedAt: "2026-01-01",
      completedAt: "2026-01-01",
    },
  ],
  shipments: [
    {
      id: "cc2f7290-1cd6-44d4-88ec-c7cc34f7808c",
      shipmentNumber: "SHIP-001",
      customerId: "0bdd70cf-9f92-4840-a033-ab4f45df5067",
      customerName: "Retail Partner",
      dispatchDate: "2026-01-04",
      deliveryDate: "2026-01-06",
      carrierName: "CargoLine",
      trackingNumber: "TRK-001",
      quantityShipped: 480,
      shippingStatus: "In Transit",
    },
  ],
  newArrayValue: ["value1", "value2", "value3"],
};

const sampleList: DashboardListResponse = {
  items: [
    {
      id: sampleDetail.id,
      plantName: sampleDetail.plantName,
      country: sampleDetail.country,
      productionLineName: sampleDetail.productionLineName,
      machineName: sampleDetail.machineName,
      workOrderNumber: sampleDetail.workOrderNumber,
      productName: sampleDetail.productName,
      status: sampleDetail.status,
      priority: sampleDetail.priority,
      updatedAt: sampleDetail.updatedAt,
      oeePercent: sampleDetail.oeePercent,
      qualityCheckPassed: sampleDetail.qualityCheckPassed,
      maintenanceRequired: sampleDetail.maintenanceRequired,
    },
  ],
  page: 2,
  pageSize: 25,
  total: 500,
  totalPages: 20,
};

const sampleHealth: HealthStatus = {
  service: "@omne-showcase/api",
  status: "ok",
  database: {
    status: "ok",
    connected: true,
  },
  failureRate: 0.3,
  seededRecordCount: 500,
};

function createMockResponse() {
  const state: {
    statusCode: number;
    body: unknown;
  } = {
    statusCode: 200,
    body: undefined,
  };

  const response = {
    status(code: number) {
      state.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      state.body = payload;
      return response;
    },
  };

  return {
    response: response as unknown as Response,
    state,
  };
}

function createMockRequest(query: Record<string, unknown> = {}) {
  return {
    query,
  } as unknown as Request;
}

describe("route handlers", () => {
  test("returns the latest dashboard detail record", async () => {
    let receivedId: string | undefined;

    const handler = createGetDashboardDataHandler({
      async getDashboardData({ id }) {
        receivedId = id;
        return sampleDetail;
      },
      async listDashboardData() {
        return sampleList;
      },
    });
    const { response, state } = createMockResponse();

    await handler(createMockRequest(), response);

    assert.equal(state.statusCode, 200);
    assert.equal(receivedId, undefined);
    assert.deepEqual(state.body, sampleDetail);
  });

  test("passes the requested dashboard id through to the service", async () => {
    let receivedId: string | undefined;

    const requestedId = "d130bf30-8a4e-4c93-a26e-0a9b43474fa5";
    const handler = createGetDashboardDataHandler({
      async getDashboardData({ id }) {
        receivedId = id;
        return sampleDetail;
      },
      async listDashboardData() {
        return sampleList;
      },
    });
    const { response, state } = createMockResponse();

    await handler(
      createMockRequest({
        id: requestedId,
      }),
      response,
    );

    assert.equal(state.statusCode, 200);
    assert.equal(receivedId, requestedId);
  });

  test("returns a paginated summary list", async () => {
    let receivedPage: number | undefined;
    let receivedPageSize: number | undefined;

    const handler = createListDashboardDataHandler({
      async getDashboardData() {
        return sampleDetail;
      },
      async listDashboardData({ page, pageSize }) {
        receivedPage = page;
        receivedPageSize = pageSize;
        return sampleList;
      },
    });
    const { response, state } = createMockResponse();

    await handler(
      createMockRequest({
        page: "2",
        pageSize: "25",
      }),
      response,
    );

    assert.equal(state.statusCode, 200);
    assert.equal(receivedPage, 2);
    assert.equal(receivedPageSize, 25);
    assert.deepEqual(state.body, sampleList);
  });

  test("maps simulated failures to 503 responses", async () => {
    const handler = createGetDashboardDataHandler({
      async getDashboardData() {
        throw new SimulatedFailureError();
      },
      async listDashboardData() {
        return sampleList;
      },
    });
    const { response, state } = createMockResponse();

    await handler(createMockRequest(), response);

    assert.equal(state.statusCode, 503);
    assert.deepEqual(state.body, {
      error: "simulated_failure",
      message: "Synthetic failure injected for dashboard error-handling validation.",
    });
  });

  test("maps repository failures to 500 responses", async () => {
    const handler = createGetDashboardDataHandler({
      async getDashboardData() {
        throw new DataAccessError("database unavailable");
      },
      async listDashboardData() {
        return sampleList;
      },
    });
    const { response, state } = createMockResponse();

    await handler(createMockRequest(), response);

    assert.equal(state.statusCode, 500);
    assert.deepEqual(state.body, {
      error: "database_request_failed",
      message: "database unavailable",
    });
  });

  test("returns health with database status and seeded record count", async () => {
    const handler = createHealthHandler({
      async getStatus() {
        return sampleHealth;
      },
    });
    const { response, state } = createMockResponse();

    await handler(createMockRequest(), response);

    assert.equal(state.statusCode, 200);
    assert.deepEqual(state.body, sampleHealth);
  });
});
