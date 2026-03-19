import {
  AUTH_SESSION_COOKIE,
  getDemoProfileByUsername,
  isValidDemoCredentials,
} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
    rememberMe?: boolean;
  };
  const username = body.username ?? "";
  const profile = getDemoProfileByUsername(username);

  if (!isValidDemoCredentials(username, body.password ?? "") || !profile) {
    return NextResponse.json(
      {
        message:
          "Invalid credentials. Use one of the demo usernames with the shared password.",
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    username: profile.username,
    profile,
  });
  response.cookies.set({
    name: AUTH_SESSION_COOKIE,
    value: profile.username,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: body.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 8,
  });

  return response;
}
