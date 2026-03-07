import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/getUserProfile";

export async function getClients(search: string) {
  const supabase = await createClient();

  const profile = await getUserProfile();

  if (!profile) return [];
  if (!search) return [];

  const isNumber = /^\d+$/.test(search);
  let query;

  if (isNumber) {
    query = supabase
      .from("clientes")
      .select("codcli, fantasia, razao, cidade, codven")
      .eq("codcli", Number(search))
      .limit(20);
  } else {
    query = supabase
      .from("clientes")
      .select("codcli, fantasia, razao, cidade, codven")
      .ilike("razao", `%${search}%`)
      .limit(20);
  }

  // Se for vendedor e não clicou em "ver todos"
  if (profile.role !== "admin") {
    query = query.eq("codven", profile.codigo_vendedor);
  }

  const { data } = await query;

  return data || [];
}
