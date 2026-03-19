"use client";

import { navigationSections } from "@/components/nav/nav-data";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  CalendarIcon,
  ChartBarSquareIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Cog6ToothIcon,
  CursorArrowRaysIcon,
  LifebuoyIcon,
  Squares2X2Icon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const iconMap = {
  analytics: ChartBarSquareIcon,
  audience: UserGroupIcon,
  calendar: CalendarIcon,
  dashboard: Squares2X2Icon,
  help: LifebuoyIcon,
  logout: ArrowLeftOnRectangleIcon,
  settings: Cog6ToothIcon,
  tracking: CursorArrowRaysIcon,
};

type NavigationContentProps = {
  isCollapsed: boolean;
  onNavigate?: () => void;
};

function Brand({
  isCollapsed = false,
  tone = "light",
}: {
  isCollapsed?: boolean;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={clsx(
        "flex min-w-0 items-center gap-3",
        isCollapsed && "justify-center",
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-linear-to-br from-[#0973f7] to-[#3589cd] text-sm font-black tracking-[0.3em] text-[#171414] shadow-lg shadow-emerald-950/25">
        OM
      </div>
      {!isCollapsed ? (
        <div className="min-w-0">
          <p
            className={clsx(
              "truncate text-3xl font-semibold tracking-tight",
              tone === "dark" ? "text-slate-950" : "text-white",
            )}
          >
            Om<span className="text-[#0973f7]">ne</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}

function NavigationContent({
  isCollapsed,
  onNavigate,
}: NavigationContentProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col" aria-label="Primary navigation">
      <ul role="list" className="flex flex-1 flex-col gap-8 pt-6">
        {navigationSections.map((section) => (
          <li key={section.title}>
            {!isCollapsed ? (
              <div className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                {section.title}
              </div>
            ) : null}

            <ul
              role="list"
              className={clsx("space-y-2", !isCollapsed && "mt-4")}
            >
              {section.items.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isCurrent =
                  item.href !== "#" &&
                  item.kind !== "action" &&
                  pathname === item.href;
                const itemClassName = clsx(
                  "group flex items-center rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60",
                  isCollapsed
                    ? "justify-center px-0 py-3"
                    : "gap-3 px-4 py-3.5",
                  isCurrent
                    ? "bg-white/6 text-[#58c37f]"
                    : "text-white hover:bg-white/4 hover:text-white/90",
                );

                return item.kind === "action" ? (
                  <li key={item.name}>
                    <form action={item.href} method="post">
                      <button
                        type="submit"
                        aria-label={item.name}
                        onClick={onNavigate}
                        className={itemClassName}
                      >
                        <Icon className="size-5 shrink-0" aria-hidden="true" />
                        {!isCollapsed ? (
                          <span className="truncate">{item.name}</span>
                        ) : null}
                      </button>
                    </form>
                  </li>
                ) : (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      aria-label={item.name}
                      onClick={onNavigate}
                      className={itemClassName}
                    >
                      <Icon className="size-5 shrink-0" aria-hidden="true" />
                      {!isCollapsed ? (
                        <span className="truncate">{item.name}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur lg:hidden"
      >
        <Brand tone="dark" />
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#0973f7]/50"
        >
          <Bars3Icon className="size-6" aria-hidden="true" />
        </button>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Dismiss mobile menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            className="relative flex h-full w-74 max-w-[88vw] flex-col overflow-y-auto border-r border-white/10 bg-linear-to-b from-[#171414] via-[#151315] to-[#201d21] px-3 py-4 text-white shadow-2xl shadow-slate-950/50"
          >
            <div className="flex items-center justify-between gap-3 px-2 pb-6">
              <Brand />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              >
                <XMarkIcon className="size-5" aria-hidden="true" />
              </button>
            </div>

            <NavigationContent
              isCollapsed={false}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <aside
        aria-label="Primary sidebar navigation"
        className={clsx(
          "hidden h-screen shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-linear-to-b from-[#171414] via-[#151315] to-[#201d21] px-3 py-4 text-white transition-[width] duration-800 ease-out lg:flex",
          isCollapsed ? "w-20" : "w-72",
        )}
      >
        <div
          className={clsx(
            "px-2 pb-6",
            isCollapsed
              ? "flex flex-col items-center gap-3"
              : "flex items-center justify-between gap-3",
          )}
        >
          <Brand isCollapsed={isCollapsed} />

          <button
            type="button"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsCollapsed((current) => !current)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          >
            {isCollapsed ? (
              <ChevronDoubleRightIcon className="size-5" aria-hidden="true" />
            ) : (
              <ChevronDoubleLeftIcon className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <NavigationContent isCollapsed={isCollapsed} />
      </aside>
    </>
  );
}
