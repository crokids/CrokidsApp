"use server";

import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/schemas/productSchema";
import { revalidatePath } from "next/cache";

export async function createProduct(data: unknown) {
  const supabase = await createClient();

  const parsed = productSchema.parse(data);

  const { unidades, ...produto } = parsed;

  const { data: createdProduct, error: productError } = await supabase
    .from("produtos")
    .insert({
      nome: produto.nome,
      descricao: produto.descricao,
      img_url: produto.img_url,
      ativo: produto.ativo,
    })
    .select()
    .single();

  if (productError) {
    throw new Error("Erro ao criar produto");
  }

  const unidadesInsert = unidades.map((u) => ({
    produto_id: createdProduct.id,
    nome_unidade: u.nome_unidade,
    quantidade_salgadinho: u.quantidade_salgadinho,
    preco: u.preco,
    ativo: true,
  }));

  const { error: unitError } = await supabase
    .from("unidades_produto")
    .insert(unidadesInsert);

  if (unitError) {
    throw new Error("Erro ao criar unidades");
  }

  revalidatePath("/dashboard/produtos");

  return { success: true };
}
