import { getUserProfile } from "@/lib/getUserProfile";
import { redirect } from "next/navigation";
import UsuariosClient from "@/components/usuarios/usuarios-client";

export default async function UsuariosPage() {
  const profile = await getUserProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return <UsuariosClient />;
}