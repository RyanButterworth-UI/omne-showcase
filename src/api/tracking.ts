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

  const payload = (await response.json()) as
    | RawTrackingResponse
    | {
        message?: string;
      };

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(payload.message)
        : "Tracking API request failed";

    throw new Error(message);
  }

  return payload as RawTrackingResponse;
}
