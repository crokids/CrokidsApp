"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteClient(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Erro ao deletar cliente");
  }

  revalidatePath("/dashboard/clientes");
}