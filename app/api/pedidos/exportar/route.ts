import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/getUserProfile";
import { connection } from "next/server";

export async function GET(request: Request) {
  await connection();

  try {
    const profile = await getUserProfile();
    if (!profile) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const inicio = searchParams.get("inicio");
    const fim = searchParams.get("fim");

    if (!inicio || !fim) {
      return NextResponse.json({ error: "Datas obrigatórias" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: produtosData } = await supabase
      .from("produtos")
      .select("nome")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    const produtos = (produtosData ?? []).map((p) => p.nome);

    const fimDia = new Date(fim);
    fimDia.setDate(fimDia.getDate() + 1);

    let query = supabase
      .from("pedidos")
      .select(`
        id,
        created_at,
        codcli,
        codigo_vendedor,
        tipo_pagamento,
        nf,
        nome_cliente,
        cidade_cliente,
        total,
        pedido_itens (
          nome_produto,
          nome_unidade,
          quantidade,
          quantidade_unidade,
          preco_unitario,
          subtotal
        )
      `)
      .gte("created_at", new Date(inicio).toISOString())
      .lt("created_at", fimDia.toISOString())
      .order("created_at", { ascending: true });

    if (profile.role !== "admin") {
      query = query.eq("codigo_vendedor", profile.codigo_vendedor);
    }

    const { data: pedidosData, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const pedidos = (pedidosData ?? []).map((p) => ({
      ...p,
      itens: p.pedido_itens ?? [],
    }));

    return NextResponse.json({ pedidos, produtos });
  } catch (error) {
    console.error("[GET /api/exportar]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}