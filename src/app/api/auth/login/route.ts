import {
  AUTH_SESSION_COOKIE,
  DEMO_USERNAME,
  isValidDemoCredentials,
} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
    rememberMe?: boolean;
  };

  if (!isValidDemoCredentials(body.username ?? "", body.password ?? "")) {
    return NextResponse.json(
      { message: "Invalid credentials. Use the demo account provided." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    username: DEMO_USERNAME,
  });
  response.cookies.set({
    name: AUTH_SESSION_COOKIE,
    value: DEMO_USERNAME,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: body.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 8,
  });

  return response;
}
