"use client";

import { signInWithDemoCredentials } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: signInWithDemoCredentials,
  });
}
