// @/actions/client/create-client.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { clientSchema } from "@/lib/schemas/clientSchema";
import { revalidatePath } from "next/cache";

export async function createClientAction(data: unknown) {
  const supabase = await createClient();

  const parsed = clientSchema.parse(data);

  const { error } = await supabase.from("clientes").insert({
    codcli: parsed.codcli,
    razao: parsed.razao,
    fantasia: parsed.fantasia,
    tipo_log: parsed.tipo_log,
    nome_log: parsed.nome_log,
    bairro: parsed.bairro,
    cidade: parsed.cidade,
    estado: parsed.estado,
    uf: parsed.uf,
    telefone: parsed.telefone,
    celular: parsed.celular,
    cnpj_cpf: parsed.cnpj_cpf,
    tipo_estab: parsed.tipo_estab,
    bloqueio: parsed.bloqueio,
    dt_bloqueo: parsed.dt_bloqueo || null,
  });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Erro ao criar cliente");
  }

  revalidatePath("/dashboard/clientes");

  return { success: true };
}
