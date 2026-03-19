export default function Home() {
  const metrics = [
    {
      label: "Active clients",
      value: "128",
      detail: "+12% month over month",
    },
    {
      label: "Projects in flight",
      value: "24",
      detail: "4 launch this week",
    },
    {
      label: "Utilization",
      value: "91%",
      detail: "Healthy delivery pace",
    },
  ];

  const activity = [
    {
      title: "Benchmark grid shell",
      meta: "Design system alignment",
      status: "In review",
    },
    {
      title: "Customer migration",
      meta: "API schema handoff",
      status: "Blocked",
    },
    {
      title: "Q2 reporting workspace",
      meta: "Stakeholder sign-off",
      status: "On track",
    },
  ];

  return (
    <section className="flex min-h-screen flex-col gap-8 bg-linear-to-b from-slate-100 via-white to-slate-100 p-6 sm:p-8">
      <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-slate-200/70 backdrop-blur sm:p-8">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
          Workspace overview
        </span>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              A collapsible shell for product operations.
            </h1>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              The first unit establishes the app frame: a persistent side nav,
              concise team context, and a dashboard canvas that can host the
              next feature slices.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
            Layout baseline ready for feature work
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/60"
          >
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              {metric.value}
            </p>
            <p className="mt-3 text-sm text-slate-600">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
        <article className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Current delivery flow
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Placeholder dashboard content for the new shell.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              Stable
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <p className="text-sm font-medium text-slate-300">
                Release velocity
              </p>
              <p className="mt-4 text-3xl font-semibold">8.4 / 10</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Sustained pace across design, API contracts, and dashboard
                delivery.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-100 p-5">
              <p className="text-sm font-medium text-slate-500">Open risks</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">03</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Two dependency decisions and one migration handoff need
                follow-up.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Team activity
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Representative items to anchor the app shell.
            </p>
          </div>

          <ul role="list" className="mt-6 space-y-3">
            {activity.map((item) => (
              <li
                key={item.title}
                className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.meta}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm shadow-slate-200/60">
                    {item.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </section>
  );
}
