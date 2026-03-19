"use client";

import { getTrackingViewModel } from "@/services/tracking";
import { useQuery } from "@tanstack/react-query";

type UseTrackingInput = {
  page: number;
  pageSize: number;
};

export function useTracking({ page, pageSize }: UseTrackingInput) {
  return useQuery({
    queryKey: ["tracking", page, pageSize],
    queryFn: () => getTrackingViewModel(page, pageSize),
    retry: false,
  });
}
