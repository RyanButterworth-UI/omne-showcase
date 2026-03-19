"use client";

import { useTracking } from "@/hooks/useTracking";
import type { TrackingRow } from "@/services/tracking";
import {
  type ColDef,
  type ICellRendererParams,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import clsx from "clsx";
import { startTransition, useDeferredValue, useState } from "react";

const trackingTheme = themeQuartz.withParams({
  backgroundColor: "#0a0e12",
  browserColorScheme: "dark",
  chromeBackgroundColor: "#111827",
  foregroundColor: "#dbeafe",
  headerBackgroundColor: "#101827",
  headerTextColor: "#bfdbfe",
  accentColor: "#0973f7",
  borderColor: "rgba(148,163,184,0.18)",
  cellHorizontalPaddingScale: 0.9,
  fontFamily: "var(--font-geist-sans)",
  wrapperBorderRadius: 20,
});

const summaryCardStyles = {
  active:
    "border-sky-400/25 bg-[linear-gradient(180deg,rgba(14,165,233,0.2),rgba(15,23,42,0.42))] shadow-sky-950/20",
  quality:
    "border-emerald-400/25 bg-[linear-gradient(180deg,rgba(52,211,153,0.18),rgba(12,18,18,0.42))] shadow-emerald-950/20",
  maintenance:
    "border-orange-400/25 bg-[linear-gradient(180deg,rgba(251,146,60,0.18),rgba(26,14,10,0.42))] shadow-orange-950/20",
  priority:
    "border-fuchsia-400/25 bg-[linear-gradient(180deg,rgba(217,70,239,0.18),rgba(24,12,26,0.42))] shadow-fuchsia-950/20",
};

function StatusBadge({ value }: { value: string }) {
  const lowerValue = value.toLowerCase();
  const style =
    lowerValue === "running" ||
    lowerValue === "passed" ||
    lowerValue === "stable"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
      : lowerValue === "review" || lowerValue === "attention"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-100"
        : lowerValue === "high"
          ? "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-100"
          : "border-slate-400/30 bg-slate-400/10 text-slate-100";

  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        style,
      )}
    >
      {value}
    </span>
  );
}

function OeeCell({ value }: ICellRendererParams<TrackingRow, string>) {
  return <span className="font-semibold text-sky-200">{value}</span>;
}

const columnDefs: ColDef<TrackingRow>[] = [
  { field: "workOrder", headerName: "Work order", minWidth: 150 },
  { field: "product", headerName: "Product", minWidth: 180, flex: 1.1 },
  { field: "plant", headerName: "Plant", minWidth: 180 },
  { field: "line", headerName: "Line", minWidth: 170 },
  { field: "machine", headerName: "Machine", minWidth: 170 },
  {
    field: "status",
    headerName: "Status",
    minWidth: 140,
    cellRenderer: ({ value }: ICellRendererParams<TrackingRow, string>) =>
      value ? <StatusBadge value={value} /> : null,
  },
  {
    field: "priority",
    headerName: "Priority",
    minWidth: 130,
    cellRenderer: ({ value }: ICellRendererParams<TrackingRow, string>) =>
      value ? <StatusBadge value={value} /> : null,
  },
  {
    field: "qualityStatus",
    headerName: "Quality",
    minWidth: 130,
    cellRenderer: ({ value }: ICellRendererParams<TrackingRow, string>) =>
      value ? <StatusBadge value={value} /> : null,
  },
  {
    field: "maintenanceStatus",
    headerName: "Maintenance",
    minWidth: 150,
    cellRenderer: ({ value }: ICellRendererParams<TrackingRow, string>) =>
      value ? <StatusBadge value={value} /> : null,
  },
  {
    field: "oeeLabel",
    headerName: "OEE",
    minWidth: 120,
    cellRenderer: OeeCell,
  },
  { field: "country", headerName: "Country", minWidth: 140 },
  { field: "updatedAtLabel", headerName: "Updated", minWidth: 160 },
];

export function TrackingScreen() {
  const [page, setPage] = useState(1);
  const [quickFilter, setQuickFilter] = useState("");
  const deferredQuickFilter = useDeferredValue(quickFilter);
  const pageSize = 25;
  const { data, error, isLoading, isFetching } = useTracking({
    page,
    pageSize,
  });

  const canGoBack = page > 1;
  const canGoForward = data ? page < data.totalPages : false;

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(8,145,178,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.24),transparent_28%),linear-gradient(180deg,#09111b_0%,#0b1320_44%,#160f1f_100%)] px-3 py-4 text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
        <header className="rounded-4xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur sm:px-7 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300/80">
                Tracking workspace
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                AG Grid production tracker
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
                A production-order workspace backed by the Postgres list
                endpoint, with grid sorting, quick filtering, semantic status
                badges, and paged query orchestration through the frontend
                layers.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:min-w-78">
              <label
                className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50"
                htmlFor="tracking-filter"
              >
                Quick filter
              </label>
              <input
                id="tracking-filter"
                type="text"
                value={quickFilter}
                onChange={(event) => setQuickFilter(event.target.value)}
                placeholder="Search work order, product, plant, or status"
                className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20"
              />
            </div>
          </div>
        </header>

        {data ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.summaryCards.map((card) => (
              <article
                key={card.label}
                className={clsx(
                  "rounded-[1.6rem] border p-4 shadow-lg backdrop-blur sm:p-5",
                  summaryCardStyles[card.tone],
                )}
              >
                <p className="text-sm text-white/72">{card.label}</p>
                <p className="mt-4 text-4xl font-semibold tracking-tight sm:mt-5">
                  {card.value}
                </p>
                <p className="mt-3 text-sm text-white/68">{card.detail}</p>
              </article>
            ))}
          </section>
        ) : null}

        <article className="rounded-4xl border border-white/10 bg-black/25 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Tracking board
              </h2>
              <p className="mt-1 text-sm text-white/60">
                AG Grid showing production-order status from the backend list
                route.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                {isFetching ? "Refreshing grid" : "Grid live"}
              </span>
              {data ? (
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                  Page {data.page} of {Math.max(data.totalPages, 1)}
                </span>
              ) : null}
            </div>
          </div>

          {isLoading ? (
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              Loading tracked production orders...
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-6 text-sm text-rose-100">
              {(error as Error).message}
            </div>
          ) : null}

          {data ? (
            <>
              <div className="mt-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0a0e12]">
                <div className="h-160 w-full" data-testid="tracking-grid">
                  <AgGridReact<TrackingRow>
                    rowData={data.rows}
                    columnDefs={columnDefs}
                    theme={trackingTheme}
                    quickFilterText={deferredQuickFilter}
                    animateRows
                    defaultColDef={{
                      sortable: true,
                      filter: true,
                      resizable: true,
                    }}
                    rowSelection={{
                      mode: "multiRow",
                      checkboxes: false,
                      headerCheckbox: false,
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-white/60">
                  Showing {data.rows.length} orders from {data.total} tracked
                  records.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(() =>
                        setPage((current) => Math.max(1, current - 1)),
                      )
                    }
                    disabled={!canGoBack}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Previous page
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(() => setPage((current) => current + 1))
                    }
                    disabled={!canGoForward}
                    className="inline-flex items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-2.5 text-sm font-medium text-sky-100 transition hover:border-sky-400/45 hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Next page
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </article>
      </div>
    </section>
  );
}
