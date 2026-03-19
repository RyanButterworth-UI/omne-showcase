import { env, hasUpstreamToken } from "../config/env.js";

export type UpstreamProxyResult = {
  data: unknown;
  status: number;
};

export class MissingUpstreamTokenError extends Error {
  constructor() {
    super("UPSTREAM_BEARER_TOKEN is not configured");
    this.name = "MissingUpstreamTokenError";
  }
}

export async function fetchDashboardData(): Promise<UpstreamProxyResult> {
  if (!hasUpstreamToken()) {
    throw new MissingUpstreamTokenError();
  }

  const response = await fetch(env.upstreamApiUrl, {
    headers: {
      Authorization: `Bearer ${env.upstreamBearerToken}`,
      Accept: "application/json",
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error("Upstream request failed");
    Object.assign(error, {
      status: response.status,
      upstreamBody: data,
    });
    throw error;
  }

  return {
    data,
    status: response.status,
  };
}
