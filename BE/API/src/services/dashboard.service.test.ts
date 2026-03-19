import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { SimulatedFailureError } from "../errors.js";
import { createDashboardService } from "./dashboard.service.js";
import type { DashboardRepository } from "../repositories/dashboard.repository.js";
import type {
  DashboardChildCollections,
  ProductionOrderRow,
} from "../types/dashboard.types.js";

const sampleOrder: ProductionOrderRow = {
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
  newArrayValue: ["value1", "value2", "value3"],
};

const sampleChildren: DashboardChildCollections = {
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
};

function createRepositoryStub(): DashboardRepository {
  return {
    async getLatestProductionOrder() {
      return sampleOrder;
    },
    async getProductionOrderById() {
      return sampleOrder;
    },
    async getChildCollections() {
      return sampleChildren;
    },
    async listProductionOrders() {
      return {
        items: [
          {
            id: sampleOrder.id,
            plantName: sampleOrder.plantName,
            country: sampleOrder.country,
            productionLineName: sampleOrder.productionLineName,
            machineName: sampleOrder.machineName,
            workOrderNumber: sampleOrder.workOrderNumber,
            productName: sampleOrder.productName,
            status: sampleOrder.status,
            priority: sampleOrder.priority,
            updatedAt: sampleOrder.updatedAt,
            oeePercent: sampleOrder.oeePercent,
            qualityCheckPassed: sampleOrder.qualityCheckPassed,
            maintenanceRequired: sampleOrder.maintenanceRequired,
          },
        ],
        total: 500,
      };
    },
    async ping() {
      return;
    },
    async countProductionOrders() {
      return 500;
    },
  };
}

describe("createDashboardService", () => {
  test("assembles a full nested detail payload from repository rows", async () => {
    const service = createDashboardService(createRepositoryStub(), {
      failureRate: 0,
      random: () => 0.95,
    });

    const result = await service.getDashboardData({});

    assert.equal(result.id, sampleOrder.id);
    assert.equal(result.productionLineName, sampleOrder.productionLineName);
    assert.equal(result.plannedUnits, sampleOrder.plannedUnits);
    assert.deepEqual(result.inventoryAllocations, sampleChildren.inventoryAllocations);
    assert.deepEqual(result.qualityChecks, sampleChildren.qualityChecks);
    assert.deepEqual(result.downtimeEvents, sampleChildren.downtimeEvents);
    assert.deepEqual(result.productionSteps, sampleChildren.productionSteps);
    assert.deepEqual(result.shipments, sampleChildren.shipments);
    assert.deepEqual(result.newArrayValue, sampleOrder.newArrayValue);
  });

  test("returns pagination metadata for the summary list", async () => {
    const service = createDashboardService(createRepositoryStub(), {
      failureRate: 0,
      random: () => 0.95,
    });

    const result = await service.listDashboardData({ page: 2, pageSize: 25 });

    assert.equal(result.page, 2);
    assert.equal(result.pageSize, 25);
    assert.equal(result.total, 500);
    assert.equal(result.totalPages, 20);
    assert.equal(result.items[0]?.workOrderNumber, sampleOrder.workOrderNumber);
  });

  test("injects a synthetic failure when the random threshold is met", async () => {
    const service = createDashboardService(createRepositoryStub(), {
      failureRate: 0.3,
      random: () => 0.1,
    });

    await assert.rejects(
      () => service.getDashboardData({}),
      (error: unknown) => error instanceof SimulatedFailureError,
    );
  });
});
