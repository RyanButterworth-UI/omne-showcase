"use client";

import { SideNav } from "@/components/nav/SideNav";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/login";

  if (isLoginRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <SideNav />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
