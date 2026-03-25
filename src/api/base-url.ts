const defaultApiBaseUrl = "http://localhost:4001/api";

type BrowserLocationLike = {
  protocol: string;
  hostname: string;
};

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function resolveApiBaseUrl(location?: BrowserLocationLike) {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (envBaseUrl) {
    return normalizeBaseUrl(envBaseUrl);
  }

  const browserLocation =
    location ?? (typeof window !== "undefined" ? window.location : undefined);

  if (!browserLocation) {
    return defaultApiBaseUrl;
  }

  return `${browserLocation.protocol}//${browserLocation.hostname}:4001/api`;
}

export function createApiUrl(path: string, location?: BrowserLocationLike) {
  return new URL(path, `${resolveApiBaseUrl(location)}/`).toString();
}
