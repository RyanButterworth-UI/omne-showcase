"use client";

import { useDashboard } from "@/hooks/useDashboard";
import clsx from "clsx";

const toneStyles = {
  neutral: "border-white/10 bg-white/5 text-white/85",
  positive: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

export function DashboardScreen() {
  const { data, error, isLoading, isFetching } = useDashboard();

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(20,83,45,0.35),transparent_32%),radial-gradient(circle_at_top_right,rgba(2,132,199,0.22),transparent_28%),linear-gradient(180deg,#131416_0%,#111214_45%,#1f130f_100%)] px-3 py-4 text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
        <header className="rounded-4xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300/80">
                Production dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Good morning, Yan!
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Here&apos;s an overview of today&apos;s manufacturing activity
                and the proxied payload coming through the local API layer.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/70 sm:px-4 sm:py-3">
              {isFetching ? "Refreshing live data" : "Connected to local API"}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="rounded-4xl border border-white/10 bg-black/20 p-5 text-sm text-white/70 backdrop-blur sm:p-8">
            Loading dashboard data from the local API...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-4xl border border-rose-400/30 bg-rose-400/10 p-5 text-sm text-rose-100 backdrop-blur sm:p-8">
            {(error as Error).message}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {data.summaryCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] p-4 shadow-lg shadow-black/20 backdrop-blur sm:p-5"
                >
                  <p className="text-sm text-white/65">{card.label}</p>
                  <p className="mt-4 text-4xl font-semibold tracking-tight sm:mt-5">
                    {card.value}
                  </p>
                  <p className="mt-3 text-sm text-white/60">{card.detail}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-4 sm:gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-4xl border border-white/10 bg-black/20 p-4 backdrop-blur sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      Operations snapshot
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                      Service-layer mapping over the raw proxy response.
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                    mapped
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-3 sm:p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      Location
                    </dt>
                    <dd className="mt-3 text-sm leading-6 text-white/80">
                      {data.location || "No location details returned"}
                    </dd>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-3 sm:p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      Production
                    </dt>
                    <dd className="mt-3 text-sm leading-6 text-white/80">
                      {data.production || "No production details returned"}
                    </dd>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-3 sm:p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      Team
                    </dt>
                    <dd className="mt-3 text-sm leading-6 text-white/80">
                      {data.team || "No operator details returned"}
                    </dd>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-3 sm:p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      Status
                    </dt>
                    <dd className="mt-3 text-sm leading-6 text-white/80">
                      {data.statusLine || "No status metadata returned"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 rounded-[1.4rem] border border-white/8 bg-white/4 p-3 sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                    Quality and maintenance
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/80">
                    {data.qualityLine ||
                      "No quality or maintenance insight returned"}
                  </p>
                </div>
              </article>

              <article className="rounded-4xl border border-white/10 bg-black/20 p-4 backdrop-blur sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      Live activity
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                      Derived highlights pulled from the current payload.
                    </p>
                  </div>
                </div>

                <ul role="list" className="mt-5 space-y-3 sm:mt-6">
                  {data.activity.map((item) => (
                    <li
                      key={`${item.label}-${item.meta}`}
                      className={clsx(
                        "rounded-[1.4rem] border p-3 sm:p-4",
                        toneStyles[item.tone],
                      )}
                    >
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-2 text-sm leading-6">{item.meta}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <article className="rounded-4xl border border-white/10 bg-black/25 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
              <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Raw API response
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Pretty-printed payload from the local Express API.
                  </p>
                </div>
                <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                  debug view
                </span>
              </div>

              <pre className="mt-4 max-h-152 overflow-auto rounded-3xl border border-white/8 bg-[#0a0e12] p-3 text-xs leading-6 text-emerald-100 sm:mt-5 sm:p-5 sm:text-sm">
                {JSON.stringify(data.rawResponse, null, 2)}
              </pre>
            </article>
          </>
        ) : null}
      </div>
    </section>
  );
}
