/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/getUserProfile";

export async function POST(request: Request) {
  try {
    const profile = await getUserProfile();
    if (!profile) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { client, cartItems, tipoPagamento, nf } = body;

    if (!client || !cartItems?.length || !tipoPagamento) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const supabase = await createClient();

    const total = cartItems.reduce(
      (acc: number, item: any) => acc + Number(item.unidade.preco) * item.quantidade,
      0
    );

    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        codigo_vendedor: profile.codigo_vendedor,
        codcli: client.codcli,
        nome_cliente: client.razao,
        cidade_cliente: client.cidade,
        tipo_pagamento: tipoPagamento,
        nf: nf ?? false,
        total,
      })
      .select("id")
      .single();

    if (pedidoError) {
      console.error("[POST /api/pedidos] pedido insert:", pedidoError.message);
      return NextResponse.json({ error: pedidoError.message }, { status: 500 });
    }

    const itens = cartItems.map((item: any) => ({
      pedido_id: pedido.id,
      produto_id: item.produto.id,
      nome_produto: item.produto.nome,
      descricao: item.produto.descricao,
      unidade_id: item.unidade.id,
      nome_unidade: item.unidade.nome_unidade,
      quantidade_salgadinho: item.unidade.quantidade_salgadinho,
      quantidade: item.quantidade,
      quantidade_unidade: item.quantidade * item.unidade.quantidade_salgadinho,
      preco_unitario: Number(item.unidade.preco),
      subtotal: Number(item.unidade.preco) * item.quantidade,
    }));

    const { error: itensError } = await supabase.from("pedido_itens").insert(itens);

    if (itensError) {
      console.error("[POST /api/pedidos] itens insert:", itensError.message);
      return NextResponse.json({ error: itensError.message }, { status: 500 });
    }

    return NextResponse.json({ id: pedido.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/pedidos] Unexpected:", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}