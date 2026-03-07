"use server";

import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/schemas/productSchema";

export async function createProduct(data: unknown) {
  const supabase = await createClient();

  const parsed = productSchema.parse(data);

  const { error } = await supabase.from("produtos").insert({
    nome: parsed.nome,
    descricao: parsed.descricao,
    img_url: parsed.img_url,
    ativo: true,
  });

  if (error) {
    throw new Error("Erro ao criar produto");
  }
}
