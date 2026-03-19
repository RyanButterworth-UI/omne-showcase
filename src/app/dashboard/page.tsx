import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { AUTH_SESSION_COOKIE, getDemoProfileByUsername } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const username = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  const profile = username ? getDemoProfileByUsername(username) : undefined;

  return <DashboardScreen profile={profile} />;
}
