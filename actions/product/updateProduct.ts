"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductFormValues } from "@/lib/schemas/productSchema";

export async function updateProduct(id: string, data: ProductFormValues) {
  const supabase = await createClient();

  try {
    const { error: productError } = await supabase
      .from("produtos")
      .update({
        nome: data.nome,
        descricao: data.descricao,
        img_url: data.img_url,
        ativo: data.ativo,
        gramatura: data.gramatura,
      })
      .eq("id", id);

    if (productError) throw productError;

    const { error: deleteError } = await supabase
      .from("unidades_produto")
      .delete()
      .eq("produto_id", id);

    if (deleteError) throw deleteError;

    const unidades = data.unidades.map((u) => ({
      produto_id: id,
      nome_unidade: u.nome_unidade,
      quantidade_salgadinho: u.quantidade_salgadinho,
      preco: u.preco,
      ativo: true,
    }));

    const { error: unitError } = await supabase
      .from("unidades_produto")
      .insert(unidades);

    if (unitError) throw unitError;

    return { success: true };
  } catch (error) {
    console.error("Erro updateProduct:", error);
    return { success: false };
  }
}