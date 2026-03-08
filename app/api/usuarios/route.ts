import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getUserProfile } from "@/lib/getUserProfile";
import { connection } from "next/server";

// Cliente admin com service_role — bypassa confirmação de email e RLS
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ── GET — lista todos os usuários ─────────────────────────────────────────────
export async function GET() {
  await connection();

  const profile = await getUserProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const admin = getAdminClient();

  // Busca todos os usuários do Auth
  const { data: authUsers, error: authError } = await admin.auth.admin.listUsers();
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // Busca todos os profiles
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, nome, role, codigo_vendedor, created_at");

  // Junta auth + profiles pelo id
  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

  const users = authUsers.users.map((u) => ({
    id: u.id,
    email: u.email,
    last_sign_in_at: u.last_sign_in_at,
    created_at: u.created_at,
    ...profileMap[u.id],
  }));

  return NextResponse.json(users);
}

// ── POST — cria usuário sem confirmação de email ───────────────────────────────
export async function POST(request: NextRequest) {
  await connection();

  const profile = await getUserProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await request.json();
  const { email, password, nome, role, codigo_vendedor } = body;

  if (!email || !password || !nome || !role) {
    return NextResponse.json({ error: "Campos obrigatórios: email, senha, nome, role" }, { status: 400 });
  }

  const admin = getAdminClient();

  // Cria no Auth sem precisar confirmar email
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // confirma automaticamente
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // Cria/atualiza o profile
  const { error: profileError } = await admin
    .from("profiles")
    .upsert({
      id: authData.user.id,
      nome,
      role,
      codigo_vendedor: codigo_vendedor ?? null,
    });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ id: authData.user.id }, { status: 201 });
}