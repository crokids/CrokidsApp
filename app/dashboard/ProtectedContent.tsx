import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile";
import { createVendedor } from "@/actions/createVendedor";

export default async function ProtectedContent() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  if (profile.role !== "admin") {
    redirect("/pedidos");
  }

  return (
    <div>
      <form action={createVendedor} className="flex flex-col gap-2 mt-8">
        <input name="nome" placeholder="Nome" required />
        <input name="email" placeholder="Email" required />
        <input name="password" placeholder="Senha" required />
        <input name="codigo" placeholder="Código Vendedor" required />
        <button type="submit">Criar Vendedor</button>
      </form>
    </div>
  );
}
