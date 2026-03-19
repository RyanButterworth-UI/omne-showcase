import { TrackingScreen } from "@/components/tracking/TrackingScreen";
import type { TrackingViewModel } from "@/services/tracking";
import { render, screen } from "@testing-library/react";

const mockUseTracking = jest.fn();

jest.mock("@/hooks/useTracking", () => ({
  useTracking: (input: { page: number; pageSize: number }) =>
    mockUseTracking(input),
}));

jest.mock("ag-grid-react", () => ({
  AgGridReact: ({ rowData }: { rowData: Array<{ workOrder: string }> }) => (
    <div data-testid="ag-grid-react">
      {rowData.map((row) => row.workOrder).join(", ")}
    </div>
  ),
}));

const trackingViewModel: TrackingViewModel = {
  rows: [
    {
      id: "1",
      plant: "Cape Town Blend Works",
      line: "Filling Line 01",
      workOrder: "WO-0001",
      product: "Citrus Blend 001",
      status: "Running",
      priority: "High",
      country: "South Africa",
      machine: "Filler Station 01",
      updatedAt: "2026-01-03T08:15:00.000Z",
      updatedAtLabel: "Jan 3, 8:15 AM",
      oeePercent: 88.7,
      oeeLabel: "88.7%",
      qualityStatus: "Passed",
      maintenanceStatus: "Stable",
    },
  ],
  summaryCards: [
    {
      label: "Tracked orders",
      value: "125",
      detail: "25 visible on this page",
      tone: "active",
    },
    {
      label: "Average OEE",
      value: "88.7%",
      detail: "1 lines passed quality checks",
      tone: "quality",
    },
    {
      label: "Maintenance alerts",
      value: "0",
      detail: "All visible lines are stable",
      tone: "maintenance",
    },
    {
      label: "High priority",
      value: "1",
      detail: "Orders that need operator focus now",
      tone: "priority",
    },
  ],
  page: 1,
  pageSize: 25,
  total: 125,
  totalPages: 5,
  rawResponse: {
    items: [
      {
        id: "1",
        plantName: "Cape Town Blend Works",
        country: "South Africa",
        productionLineName: "Filling Line 01",
        machineName: "Filler Station 01",
        workOrderNumber: "WO-0001",
        productName: "Citrus Blend 001",
        status: "Running",
        priority: "High",
        updatedAt: "2026-01-03T08:15:00.000Z",
        oeePercent: 88.7,
        qualityCheckPassed: true,
        maintenanceRequired: false,
      },
    ],
    page: 1,
    pageSize: 25,
    total: 125,
    totalPages: 5,
  },
};

describe("TrackingScreen", () => {
  beforeEach(() => {
    mockUseTracking.mockReset();
  });

  it("renders the AG Grid tracking workspace from the hook view model", () => {
    mockUseTracking.mockReturnValue({
      data: trackingViewModel,
      error: null,
      isLoading: false,
      isFetching: false,
    });

    render(<TrackingScreen />);

    expect(
      screen.getByRole("heading", { name: /ag grid production tracker/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/tracked orders/i).closest("article")).toHaveClass(
      "border-sky-400/25",
    );
    expect(screen.getByTestId("ag-grid-react")).toHaveTextContent(/wo-0001/i);
    expect(
      screen.getByText(/showing 1 orders from 125 tracked records/i),
    ).toBeInTheDocument();
  });

  it("renders the tracking error state", () => {
    mockUseTracking.mockReturnValue({
      data: undefined,
      error: new Error("Tracking API request failed"),
      isLoading: false,
      isFetching: false,
    });

    render(<TrackingScreen />);

    expect(
      screen.getByText(/tracking api request failed/i),
    ).toBeInTheDocument();
  });
});
