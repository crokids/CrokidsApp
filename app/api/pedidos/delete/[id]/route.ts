import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/getUserProfile";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getUserProfile();
    if (!profile) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createClient();
    const pedidoId = Number(id);

    // Vendedor só pode deletar os próprios pedidos
    if (profile.role !== "admin") {
      const { data: pedido } = await supabase
        .from("pedidos")
        .select("codigo_vendedor")
        .eq("id", pedidoId)
        .single();

      if (!pedido || pedido.codigo_vendedor !== profile.codigo_vendedor) {
        return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
      }
    }

    const { error } = await supabase
      .from("pedidos")
      .delete()
      .eq("id", pedidoId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/pedidos/[id]]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}