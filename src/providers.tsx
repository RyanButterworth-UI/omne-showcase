"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { ReactNode, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
