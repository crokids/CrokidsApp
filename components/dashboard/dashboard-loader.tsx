import { getUserProfile } from "@/lib/getUserProfile";
import { redirect } from "next/navigation";
import DashboardShell from "@/app/dashboard/dashboard-wrapper";

export default async function DashboardLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell role={profile.role}>
      {children}
    </DashboardShell>
  );
}