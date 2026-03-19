"use client";

import { useLogin } from "@/hooks/useLogin";
import { DEMO_USERNAME } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [username, setUsername] = useState(DEMO_USERNAME);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      await loginMutation.mutateAsync({
        username,
        password,
        rememberMe,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(20,83,45,0.35),transparent_32%),radial-gradient(circle_at_top_right,rgba(2,132,199,0.22),transparent_28%),linear-gradient(180deg,#131416_0%,#111214_45%,#1f130f_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="hidden lg:block">
            <div className="max-w-xl rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-sm bg-linear-to-br from-[#0973f7] to-[#3589cd] text-base font-black tracking-[0.3em] text-[#171414] shadow-lg shadow-sky-950/25">
                  ON
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
                    Omne showcase
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
                    Dashboard access for live demo review.
                  </h1>
                </div>
              </div>

              <p className="mt-8 text-base leading-8 text-white/70">
                Use the same visual system as the dashboard: dark gradients,
                restrained glass panels, and clear blue plus emerald accents for
                focus and status.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/55">Username</p>
                  <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
                    {DEMO_USERNAME}
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/55">Environment</p>
                  <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
                    Demo access
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/6 px-5 py-8 shadow-2xl shadow-black/30 backdrop-blur sm:px-8 sm:py-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="mx-auto flex size-12 items-center justify-center rounded-sm bg-linear-to-br from-[#0973f7] to-[#3589cd] text-sm font-black tracking-[0.3em] text-[#171414] shadow-lg shadow-sky-950/25 lg:hidden">
                ON
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                Sign in to your account
              </h2>
              <p className="mt-3 text-center text-sm leading-6 text-white/60">
                Use your demo credentials to access the Omne dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-white"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-[#0973f7] focus:ring-2 focus:ring-[#0973f7]/40"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-[#0973f7] focus:ring-2 focus:ring-[#0973f7]/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-3 text-sm text-white/75">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="size-4 rounded border border-white/20 bg-black/20 text-[#0973f7] focus:ring-[#0973f7]/40"
                  />
                  Remember me
                </label>

                <a
                  href="#"
                  className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Forgot password?
                </a>
              </div>

              {errorMessage ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
                >
                  {errorMessage}
                </div>
              ) : null}

              <div>
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="flex w-full justify-center rounded-2xl bg-[#0973f7] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-950/25 transition hover:bg-[#2a84e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0973f7] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>

            <div>
              <div className="mt-10 flex items-center gap-x-6">
                <div className="w-full flex-1 border-t border-white/10" />
                <p className="text-sm font-medium whitespace-nowrap text-white/75">
                  Or continue with
                </p>
                <div className="w-full flex-1 border-t border-white/10" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  <span className="text-[#34A853]">G</span>
                  <span>Google</span>
                </a>

                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  <span>◎</span>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
