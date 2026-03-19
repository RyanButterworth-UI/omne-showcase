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
    <div className="flex min-h-screen w-full flex-col bg-[#111214] lg:h-screen lg:flex-row lg:overflow-hidden">
      <SideNav />
      <main className="flex min-w-0 flex-1 flex-col bg-[#111214] lg:min-h-0 lg:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
