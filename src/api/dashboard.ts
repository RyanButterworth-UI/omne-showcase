export type InventoryAllocation = {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  lotNumber: string;
  warehouseCode: string;
  binLocation: string;
  quantityAllocated: number;
  unitCost: number;
  totalCost: number;
  expiryDate: string;
};

export type QualityCheck = {
  id: string;
  checkType: string;
  inspectorId: string;
  inspectorName: string;
  result: string;
  defectCode: string;
  defectDescription: string;
  sampleSize: number;
  defectCount: number;
  checkedAt: string;
};

export type DowntimeEvent = {
  id: string;
  reasonCode: string;
  reasonDescription: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  severity: string;
  resolvedBy: string;
};

export type ProductionStep = {
  id: string;
  stepNumber: number;
  stepName: string;
  workCenterCode: string;
  status: string;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  assignedOperator: string;
  startedAt: string;
  completedAt: string;
};

export type Shipment = {
  id: string;
  shipmentNumber: string;
  customerId: string;
  customerName: string;
  dispatchDate: string;
  deliveryDate: string;
  carrierName: string;
  trackingNumber: string;
  quantityShipped: number;
  shippingStatus: string;
};

export type RawDashboardResponse = {
  id: string;
  plantCode?: string;
  plantName?: string;
  siteRegion?: string;
  country?: string;
  productionLineId?: string;
  productionLineCode?: string;
  productionLineName?: string;
  machineId?: string;
  machineCode?: string;
  machineName?: string;
  machineType?: string;
  workOrderId?: string;
  workOrderNumber?: string;
  batchNumber?: string;
  productId?: string;
  productSku?: string;
  productName?: string;
  productCategory?: string;
  unitOfMeasure?: string;
  shiftCode?: string;
  shiftName?: string;
  operatorId?: string;
  operatorName?: string;
  supervisorId?: string;
  supervisorName?: string;
  status?: string;
  priority?: string;
  plannedStartTime?: string;
  plannedEndTime?: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  plannedUnits?: number;
  producedUnits?: number;
  goodUnits?: number;
  scrapUnits?: number;
  reworkUnits?: number;
  downtimeMinutes?: number;
  runtimeMinutes?: number;
  availabilityPercent?: number;
  performancePercent?: number;
  qualityPercent?: number;
  oeePercent?: number;
  cycleTimeSeconds?: number;
  targetCycleTimeSeconds?: number;
  temperatureCelsius?: number;
  humidityPercent?: number;
  energyConsumptionKwh?: number;
  lastMaintenanceDate?: string | null;
  nextMaintenanceDate?: string | null;
  maintenanceRequired?: boolean;
  qualityCheckPassed?: boolean;
  blockedReason?: string | null;
  comments?: string | null;
  createdAt?: string;
  updatedAt?: string;
  inventoryAllocations?: InventoryAllocation[];
  qualityChecks?: QualityCheck[];
  downtimeEvents?: DowntimeEvent[];
  productionSteps?: ProductionStep[];
  shipments?: Shipment[];
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
