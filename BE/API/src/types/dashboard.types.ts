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

export type DashboardScalarFields = {
  id: string;
  plantCode: string;
  plantName: string;
  siteRegion: string;
  country: string;
  productionLineId: string;
  productionLineCode: string;
  productionLineName: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  machineType: string;
  workOrderId: string;
  workOrderNumber: string;
  batchNumber: string;
  productId: string;
  productSku: string;
  productName: string;
  productCategory: string;
  unitOfMeasure: string;
  shiftCode: string;
  shiftName: string;
  operatorId: string;
  operatorName: string;
  supervisorId: string;
  supervisorName: string;
  status: string;
  priority: string;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
  plannedUnits: number;
  producedUnits: number;
  goodUnits: number;
  scrapUnits: number;
  reworkUnits: number;
  downtimeMinutes: number;
  runtimeMinutes: number;
  availabilityPercent: number;
  performancePercent: number;
  qualityPercent: number;
  oeePercent: number;
  cycleTimeSeconds: number;
  targetCycleTimeSeconds: number;
  temperatureCelsius: number;
  humidityPercent: number;
  energyConsumptionKwh: number;
  lastMaintenanceDate: string | null;
  nextMaintenanceDate: string | null;
  maintenanceRequired: boolean;
  qualityCheckPassed: boolean;
  blockedReason: string | null;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
  newArrayValue: string[];
};

export type ProductionOrderRow = DashboardScalarFields;

export type DashboardChildCollections = {
  inventoryAllocations: InventoryAllocation[];
  qualityChecks: QualityCheck[];
  downtimeEvents: DowntimeEvent[];
  productionSteps: ProductionStep[];
  shipments: Shipment[];
};

export type DashboardDetailResponse = DashboardScalarFields &
  DashboardChildCollections;

export type DashboardListItem = {
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

export type DashboardListResponse = {
  items: DashboardListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type HealthStatus = {
  service: string;
  status: "ok" | "degraded";
  database: {
    status: "ok" | "unavailable";
    connected: boolean;
    message?: string;
  };
  failureRate: number;
  seededRecordCount: number;
};

export type ListProductionOrdersResult = {
  items: DashboardListItem[];
  total: number;
};
