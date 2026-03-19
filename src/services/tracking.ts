import {
  fetchTrackingResponse,
  type RawTrackingItem,
  type RawTrackingResponse,
} from "@/api/tracking";

export type TrackingSummaryCard = {
  label: string;
  value: string;
  detail: string;
  tone: "active" | "quality" | "maintenance" | "priority";
};

export type TrackingRow = {
  id: string;
  plant: string;
  line: string;
  workOrder: string;
  product: string;
  status: string;
  priority: string;
  country: string;
  machine: string;
  updatedAt: string;
  updatedAtLabel: string;
  oeePercent: number;
  oeeLabel: string;
  qualityStatus: "Passed" | "Review";
  maintenanceStatus: "Attention" | "Stable";
};

export type TrackingViewModel = {
  rows: TrackingRow[];
  summaryCards: TrackingSummaryCard[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rawResponse: RawTrackingResponse;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function mapTrackingRow(item: RawTrackingItem): TrackingRow {
  return {
    id: item.id,
    plant: item.plantName,
    line: item.productionLineName,
    workOrder: item.workOrderNumber,
    product: item.productName,
    status: item.status,
    priority: item.priority,
    country: item.country,
    machine: item.machineName,
    updatedAt: item.updatedAt,
    updatedAtLabel: formatUpdatedAt(item.updatedAt),
    oeePercent: item.oeePercent,
    oeeLabel: formatPercent(item.oeePercent),
    qualityStatus: item.qualityCheckPassed ? "Passed" : "Review",
    maintenanceStatus: item.maintenanceRequired ? "Attention" : "Stable",
  };
}

function buildSummaryCards(
  items: RawTrackingItem[],
  total: number,
): TrackingSummaryCard[] {
  const healthyQualityCount = items.filter(
    (item) => item.qualityCheckPassed,
  ).length;
  const maintenanceAlertCount = items.filter(
    (item) => item.maintenanceRequired,
  ).length;
  const highPriorityCount = items.filter(
    (item) => item.priority.toLowerCase() === "high",
  ).length;
  const averageOee =
    items.length > 0
      ? items.reduce((sum, item) => sum + item.oeePercent, 0) / items.length
      : 0;

  return [
    {
      label: "Tracked orders",
      value: formatCount(total),
      detail: `${formatCount(items.length)} visible on this page`,
      tone: "active",
    },
    {
      label: "Average OEE",
      value: formatPercent(averageOee),
      detail: `${formatCount(healthyQualityCount)} lines passed quality checks`,
      tone: "quality",
    },
    {
      label: "Maintenance alerts",
      value: formatCount(maintenanceAlertCount),
      detail:
        maintenanceAlertCount > 0
          ? "Attention needed on flagged lines"
          : "All visible lines are stable",
      tone: "maintenance",
    },
    {
      label: "High priority",
      value: formatCount(highPriorityCount),
      detail: "Orders that need operator focus now",
      tone: "priority",
    },
  ];
}

export function mapTrackingResponse(
  response: RawTrackingResponse,
): TrackingViewModel {
  return {
    rows: response.items.map(mapTrackingRow),
    summaryCards: buildSummaryCards(response.items, response.total),
    page: response.page,
    pageSize: response.pageSize,
    total: response.total,
    totalPages: response.totalPages,
    rawResponse: response,
  };
}

export async function getTrackingViewModel(page: number, pageSize: number) {
  const response = await fetchTrackingResponse({ page, pageSize });

  return mapTrackingResponse(response);
}
