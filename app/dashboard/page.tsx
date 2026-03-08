import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/getUserProfile";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getUserProfile();

   // Vendedor não tem acesso ao dashboard — redireciona para pedidos
    if (profile?.role !== "admin") {
      redirect("/dashboard/pedidos");
    }

  // ── Últimos 5 pedidos ─────────────────────────────────────────────────────
  const { data: ultimosPedidos } = await supabase
    .from("pedidos")
    .select("id, nome_cliente, cidade_cliente, tipo_pagamento, nf, total, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // ── Pedidos por mês (últimos 6 meses) via SQL function ────────────────────
  const { data: pedidosPorMes } = await supabase.rpc("pedidos_por_mes");

  // ── Cards: clientes ───────────────────────────────────────────────────────
  const { count: clientesAtivos } = await supabase
    .from("clientes")
    .select("*", { count: "exact", head: true })
    .or("bloqueio.is.null,bloqueio.eq.N");

  const { count: clientesBloqueados } = await supabase
    .from("clientes")
    .select("*", { count: "exact", head: true })
    .eq("bloqueio", "S");

  // ── Cards: produtos ativos ─────────────────────────────────────────────────
  const { count: totalProdutos } = await supabase
    .from("produtos")
    .select("*", { count: "exact", head: true })
    .eq("ativo", true);

  // ── Cards: pedidos do mês atual ───────────────────────────────────────────
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const { count: pedidosMes } = await supabase
    .from("pedidos")
    .select("*", { count: "exact", head: true })
    .gte("created_at", inicioMes.toISOString());

  return (
    <DashboardClient
      nomeVendedor={profile?.nome ?? "Vendedor"}
      ultimosPedidos={ultimosPedidos ?? []}
      pedidosPorMes={pedidosPorMes ?? []}
      clientesAtivos={clientesAtivos ?? 0}
      clientesBloqueados={clientesBloqueados ?? 0}
      totalProdutos={totalProdutos ?? 0}
      pedidosMes={pedidosMes ?? 0}
    />
  );
}