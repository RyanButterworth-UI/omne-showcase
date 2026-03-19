import {
  fetchDashboardResponse,
  type RawDashboardResponse,
} from "@/api/dashboard";

type SummaryCard = {
  label: string;
  value: string;
  detail: string;
  tone:
    | "inventory"
    | "quality"
    | "downtime"
    | "maintenanceStable"
    | "maintenanceAlert";
};

type TimelineItem = {
  label: string;
  meta: string;
  tone: "positive" | "neutral" | "warning";
};

export type DashboardViewModel = {
  summaryCards: SummaryCard[];
  location: string;
  production: string;
  team: string;
  statusLine: string;
  qualityLine: string;
  activity: TimelineItem[];
  rawResponse: RawDashboardResponse;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatBoolean(
  value: boolean | undefined,
  truthy: string,
  falsy: string,
) {
  return value ? truthy : falsy;
}

function buildSummaryCards(data: RawDashboardResponse): SummaryCard[] {
  return [
    {
      label: "Inventory lots",
      value: formatCount(data.inventoryAllocations?.length ?? 0),
      detail: `${formatCount(
        data.shipments?.length ?? 0,
      )} shipments queued for dispatch`,
      tone: "inventory",
    },
    {
      label: "Quality checks",
      value: formatCount(data.qualityChecks?.length ?? 0),
      detail: formatBoolean(
        data.qualityCheckPassed,
        "Latest check passed",
        "Quality review still needed",
      ),
      tone: "quality",
    },
    {
      label: "Downtime events",
      value: formatCount(data.downtimeEvents?.length ?? 0),
      detail: `${formatCount(
        data.productionSteps?.length ?? 0,
      )} production steps tracked`,
      tone: "downtime",
    },
    {
      label: "Maintenance",
      value: data.maintenanceRequired ? "Attention" : "Stable",
      detail: data.nextMaintenanceDate
        ? `Next service window ${data.nextMaintenanceDate}`
        : "No maintenance window scheduled",
      tone: data.maintenanceRequired ? "maintenanceAlert" : "maintenanceStable",
    },
  ];
}

function buildActivity(data: RawDashboardResponse): TimelineItem[] {
  const timeline: TimelineItem[] = [];

  if (data.qualityChecks?.[0]) {
    timeline.push({
      label: "Latest quality check",
      meta: `${data.qualityChecks[0].inspectorName ?? "Inspector"} reviewed on ${
        data.qualityChecks[0].checkedAt ?? "scheduled date"
      }`,
      tone: data.qualityCheckPassed ? "positive" : "warning",
    });
  }

  if (data.downtimeEvents?.[0]) {
    timeline.push({
      label: "Primary downtime reason",
      meta:
        data.downtimeEvents[0].reasonDescription ??
        "No downtime reason captured",
      tone: "warning",
    });
  }

  if (data.shipments?.[0]) {
    timeline.push({
      label: "Shipment in motion",
      meta: `${data.shipments[0].customerName ?? "Customer"} • ${
        data.shipments[0].shippingStatus ?? "Status pending"
      }`,
      tone: "neutral",
    });
  }

  if (data.productionSteps?.[0]) {
    timeline.push({
      label: "Current production step",
      meta: `${data.productionSteps[0].stepName ?? "Step"} • ${
        data.productionSteps[0].status ?? "Status pending"
      }`,
      tone: "neutral",
    });
  }

  return timeline;
}

export function mapDashboardResponse(
  data: RawDashboardResponse,
): DashboardViewModel {
  return {
    summaryCards: buildSummaryCards(data),
    location: [data.plantName, data.siteRegion, data.country]
      .filter(Boolean)
      .join(" • "),
    production: [data.productionLineName, data.machineName, data.productName]
      .filter(Boolean)
      .join(" • "),
    team: [data.operatorName, data.supervisorName].filter(Boolean).join(" • "),
    statusLine: [data.status, data.priority, data.workOrderNumber]
      .filter(Boolean)
      .join(" • "),
    qualityLine: [
      formatBoolean(
        data.qualityCheckPassed,
        "Quality passed",
        "Quality pending",
      ),
      formatBoolean(
        data.maintenanceRequired,
        "Maintenance required",
        "Maintenance stable",
      ),
      data.blockedReason,
    ]
      .filter(Boolean)
      .join(" • "),
    activity: buildActivity(data),
    rawResponse: data,
  };
}

export async function getDashboardViewModel() {
  const response = await fetchDashboardResponse();

  return mapDashboardResponse(response);
}
