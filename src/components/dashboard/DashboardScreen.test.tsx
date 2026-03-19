import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { DEMO_PROFILES } from "@/lib/auth";
import { Providers } from "@/providers";
import { render, screen, waitFor } from "@testing-library/react";

const dashboardPayload = {
  id: "d130bf30-8a4e-4c93-a26e-0a9b43474fa5",
  plantCode: "PLANT-001",
  plantName: "Cape Town Blend Works",
  siteRegion: "MEA",
  country: "South Africa",
  productionLineId: "a63ebc95-2e02-49a0-9d4a-0b5155a6f6c7",
  productionLineCode: "LINE-01",
  productionLineName: "Filling Line 01",
  machineId: "1a3561fb-5dca-4b26-8d0d-fc8a9ede0505",
  machineCode: "MCH-001",
  machineName: "Filler Station 01",
  machineType: "Filler",
  workOrderId: "38d465a5-22e8-4278-a8bc-ede31bfec8e6",
  workOrderNumber: "WO-0001",
  batchNumber: "BATCH-00001",
  productId: "3d09b491-68e2-4c6a-a298-729a0202704e",
  productSku: "SKU-0001",
  productName: "Citrus Blend 001",
  productCategory: "Beverages",
  unitOfMeasure: "cases",
  shiftCode: "SHIFT-A",
  shiftName: "Day Shift",
  operatorId: "3bc7f472-3154-4f0a-9a7e-bdd9e73e49d6",
  operatorName: "Operator 001",
  supervisorId: "efecbcae-4ded-48aa-8617-0c6d45e09ada",
  supervisorName: "Supervisor 001",
  status: "Running",
  priority: "High",
  plannedStartTime: "2026-01-01",
  plannedEndTime: "2026-01-02",
  actualStartTime: "2026-01-01",
  actualEndTime: null,
  plannedUnits: 1200,
  producedUnits: 1188,
  goodUnits: 1182,
  scrapUnits: 4,
  reworkUnits: 2,
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
  blockedReason: null,
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
      inspectorName: "Inspector 001",
      result: "Passed",
      defectCode: "DEF-001",
      defectDescription: "No notable defects",
      sampleSize: 32,
      defectCount: 0,
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
      resolvedBy: "Shift Lead 01",
    },
  ],
  productionSteps: [
    {
      id: "a358c272-885d-457c-b91a-ee225f0a2741",
      stepNumber: 1,
      stepName: "Material Prep",
      workCenterCode: "WC-01",
      status: "Completed",
      plannedDurationMinutes: 33,
      actualDurationMinutes: 31,
      assignedOperator: "Operator 001",
      startedAt: "2026-01-01",
      completedAt: "2026-01-01",
    },
  ],
  shipments: [
    {
      id: "cc2f7290-1cd6-44d4-88ec-c7cc34f7808c",
      shipmentNumber: "SHIP-0001-1",
      customerId: "0bdd70cf-9f92-4840-a033-ab4f45df5067",
      customerName: "Customer 001",
      dispatchDate: "2026-01-07",
      deliveryDate: "2026-01-09",
      carrierName: "CargoLine",
      trackingNumber: "TRK-0001-1",
      quantityShipped: 180,
      shippingStatus: "In Transit",
    },
  ],
  newArrayValue: ["client-demo", "record-0001", "chaos-candidate"],
};

describe("DashboardScreen", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("renders the dashboard from the Postgres-backed API payload", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => dashboardPayload,
    });

    render(
      <Providers>
        <DashboardScreen />
      </Providers>,
    );

    expect(
      screen.getByText(/loading dashboard data from the postgres-backed api/i),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/connected to postgres-backed api/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/cape town blend works • mea • south africa/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/service-layer mapping over the raw database response/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/pretty-printed payload from the local express \+ postgres api/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/inventory lots/i).closest("article")).toHaveClass(
      "border-sky-400/25",
    );
    expect(screen.getByText(/^stable$/i).closest("article")).toHaveClass(
      "border-lime-400/25",
    );
  });

  it("shows cleaner profile chips without the connections label", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => dashboardPayload,
    });

    render(
      <Providers>
        <DashboardScreen profile={DEMO_PROFILES[0]} />
      </Providers>,
    );

    expect(await screen.findByText(/greg p\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/vp of product/i)).toHaveLength(2);
    expect(screen.getAllByText(/omnesoft/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText(/connections/i)).not.toBeInTheDocument();
  });

  it("shows the error state without retrying the failed request", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        message:
          "Synthetic failure injected for dashboard error-handling validation.",
      }),
    });

    render(
      <Providers>
        <DashboardScreen />
      </Providers>,
    );

    expect(
      await screen.findByText(/postgres-backed api unavailable/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /synthetic failure injected for dashboard error-handling validation/i,
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

*** Add File: /Users/ryanbutterworth/omne-showcase/src/api/tracking.ts
export type RawTrackingItem = {
  id: string;
  plantName: string;
  country: string;
  productionLineName: string;
  machineName: string;
  workOrderNumber: string;
  productName: string;
  status: string;
  priority: string;
  updatedAt: string;
  oeePercent: number;
  qualityCheckPassed: boolean;
  maintenanceRequired: boolean;
};

export type RawTrackingResponse = {
  items: RawTrackingItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const trackingApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4001/api";

type FetchTrackingPageInput = {
  page: number;
  pageSize: number;
};

export async function fetchTrackingResponse({
  page,
  pageSize,
}: FetchTrackingPageInput): Promise<RawTrackingResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await fetch(
    `${trackingApiBaseUrl}/dashboard-data/list?${searchParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
