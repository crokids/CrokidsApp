import { getUserProfile } from "@/lib/getUserProfile";
import { redirect } from "next/navigation";
import ExportarClient from "@/components/export/exportar-client";

export default async function ExportarPage() {
  const profile = await getUserProfile();

  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";

  return <ExportarClient isAdmin={isAdmin} />;
}