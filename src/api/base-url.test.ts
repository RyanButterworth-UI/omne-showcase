import { createApiUrl, resolveApiBaseUrl } from "@/api/base-url";

describe("API base URL resolution", () => {
  const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  afterEach(() => {
    if (originalApiBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
      return;
    }

    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
  });

  it("uses NEXT_PUBLIC_API_BASE_URL when provided", () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://192.168.68.133:4001/api/";

    expect(resolveApiBaseUrl()).toBe("http://192.168.68.133:4001/api");
    expect(createApiUrl("dashboard-data")).toBe(
      "http://192.168.68.133:4001/api/dashboard-data",
    );
  });

  it("derives the API host from the current device URL when no env override exists", () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    expect(
      resolveApiBaseUrl({
        protocol: "http:",
        hostname: "192.168.68.133",
      }),
    ).toBe("http://192.168.68.133:4001/api");
  });

  it("falls back to localhost during non-browser execution", () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    expect(resolveApiBaseUrl(undefined)).toBe("http://localhost:4001/api");
  });
});
