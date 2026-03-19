export type RawDashboardResponse = {
  id: string;
  plantCode?: string;
  plantName?: string;
  siteRegion?: string;
  country?: string;
  productionLineName?: string;
  machineName?: string;
  machineType?: string;
  workOrderNumber?: string;
  productName?: string;
  productCategory?: string;
  operatorName?: string;
  supervisorName?: string;
  status?: string;
  priority?: string;
  plannedStartTime?: string;
  plannedEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  plannedUnits?: string;
  producedUnits?: string;
  goodUnits?: string;
  scrapUnits?: string;
  reworkUnits?: string;
  downtimeMinutes?: string;
  runtimeMinutes?: string;
  availabilityPercent?: string;
  performancePercent?: string;
  qualityPercent?: string;
  oeePercent?: string;
  maintenanceRequired?: boolean;
  qualityCheckPassed?: boolean;
  blockedReason?: string;
  comments?: string;
  inventoryAllocations?: Array<{
    id: string;
    materialName?: string;
    totalCost?: number;
    quantityAllocated?: string;
  }>;
  qualityChecks?: Array<{
    id: string;
    inspectorName?: string;
    result?: string;
    checkedAt?: string;
  }>;
  downtimeEvents?: Array<{
    id: string;
    reasonDescription?: string;
    severity?: string;
    durationMinutes?: string;
  }>;
  productionSteps?: Array<{
    id: string;
    stepName?: string;
    status?: string;
  }>;
  shipments?: Array<{
    id: string;
    customerName?: string;
    shippingStatus?: string;
  }>;
  newArrayValue?: string[];
  [key: string]: unknown;
};

const dashboardApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4001/api";

export async function fetchDashboardResponse(): Promise<RawDashboardResponse> {
  const response = await fetch(`${dashboardApiBaseUrl}/dashboard-data`, {
    headers: {
      Accept: "application/json",
    },
  });

  const payload = (await response.json()) as
    | RawDashboardResponse
    | {
        error?: string;
        message?: string;
      };

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(payload.message)
        : "Dashboard API request failed";

    throw new Error(message);
  }

  return payload as RawDashboardResponse;
}
