export const AUTH_SESSION_COOKIE = "auth_session";
export const DEMO_USERNAME = "ryanb";
export const DEMO_PASSWORD = "1omneDemo#2026";

export function isDemoSession(value: string | undefined) {
  return value === DEMO_USERNAME;
}

export function isValidDemoCredentials(username: string, password: string) {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD;
}
