"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Erro ao deletar produto");
  }

  revalidatePath("/dashboard/produtos");
}