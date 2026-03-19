import dotenv from "dotenv";

dotenv.config();

const defaultPort = 4001;
const defaultOrigin = "http://localhost:3000";

export const env = {
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? defaultOrigin,
  port: Number(process.env.PORT ?? defaultPort),
  upstreamApiUrl:
    process.env.UPSTREAM_API_URL ??
    "https://mockfast.io/backend/apitemplate/get/6RPXGV442C",
  upstreamBearerToken: process.env.UPSTREAM_BEARER_TOKEN ?? "",
};

export function hasUpstreamToken() {
  return env.upstreamBearerToken.trim().length > 0;
}
