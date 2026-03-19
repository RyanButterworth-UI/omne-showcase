import dotenv from "dotenv";

dotenv.config();

const defaultPort = 4001;
const defaultOrigin = "http://localhost:3000";
const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/omne_dashboard";
const defaultFailureRate = 0.3;

function parsePort(value: string | undefined) {
  const parsed = Number(value ?? defaultPort);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return defaultPort;
  }

  return parsed;
}

function parseFailureRate(value: string | undefined) {
  const parsed = Number(value ?? defaultFailureRate);

  if (Number.isNaN(parsed)) {
    return defaultFailureRate;
  }

  return Math.min(1, Math.max(0, parsed));
}

export const env = {
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? defaultOrigin,
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  failureRate: parseFailureRate(process.env.FAILURE_RATE),
};
