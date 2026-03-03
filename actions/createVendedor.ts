"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createVendedor(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nome = formData.get("nome") as string;
  const codigo = formData.get("codigo") as string;

  // 1️⃣ Criar usuário no Auth
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (userError) {
    throw new Error(userError.message);
  }

  const userId = userData.user.id;

  // 2️⃣ Criar profile
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: userId,
      nome,
      role: "vendedor",
      codigo_vendedor: codigo,
    });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return { success: true };
}