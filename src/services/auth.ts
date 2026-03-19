import { loginRequest, type LoginPayload } from "@/api/auth";

export async function signInWithDemoCredentials(payload: LoginPayload) {
  return loginRequest(payload);
}
