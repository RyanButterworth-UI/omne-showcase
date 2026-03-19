export type LoginPayload = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export async function loginRequest(payload: LoginPayload) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as {
    message?: string;
    success?: boolean;
  };

  if (!response.ok) {
    throw new Error(result.message ?? "Login failed");
  }

  return result;
}
