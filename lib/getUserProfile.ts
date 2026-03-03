import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getUserProfile() {
  noStore();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User data:", user); // Adicione este log para verificar os dados do usuário

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
console.log("Profile data:", profile); // Adicione este log para verificar os dados do perfil
  return profile;
}