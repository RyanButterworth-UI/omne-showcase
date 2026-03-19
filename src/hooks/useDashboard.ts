"use client";

import { getDashboardViewModel } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardViewModel,
    retry: false,
  });
}
