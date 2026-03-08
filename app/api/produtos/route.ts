import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // ajuste o caminho do seu supabase server client

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("produtos")
      .select(`
        id,
        nome,
        img_url,
        descricao,
        ativo,
        created_at,
        unidades_produto (
          id,
          produto_id,
          nome_unidade,
          quantidade_salgadinho,
          preco,
          ativo,
          created_at
        )
      `)
      .eq("ativo", true)
      .order("nome", { ascending: true });

    if (error) {
      console.error("[GET /api/produtos] Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const normalized = (data ?? []).map((p) => ({ ...p, unidades_produto: p.unidades_produto ?? [] }));
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("[GET /api/produtos] Unexpected error:", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}