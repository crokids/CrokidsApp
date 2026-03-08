// @/actions/client/update-client.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { clientSchema } from "@/lib/schemas/clientSchema";
import { revalidatePath } from "next/cache";

export async function updateClient(id: string, data: unknown) {
  const supabase = await createClient();

  const parsed = clientSchema.parse(data);

  const { error } = await supabase
    .from("clientes")
    .update({
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
    })
    .eq("id", id);

  if (error) {
    throw new Error("Erro ao atualizar cliente");
  }

  revalidatePath("/dashboard/clientes");
  revalidatePath(`/dashboard/clientes/${id}`);

  return { success: true };
}