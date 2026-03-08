import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getUserProfile } from "@/lib/getUserProfile";
import { connection } from "next/server";

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ── PATCH — edita nome, role, codigo_vendedor e opcionalmente senha ────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection();

  const profile = await getUserProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { nome, role, codigo_vendedor, password } = body;

  const admin = getAdminClient();

  // Atualiza senha no Auth se fornecida
  if (password) {
    const { error } = await admin.auth.admin.updateUserById(id, { password });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Atualiza profile
  const { error: profileError } = await admin
    .from("profiles")
    .update({ nome, role, codigo_vendedor: codigo_vendedor ?? null })
    .eq("id", id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// ── DELETE — remove usuário do Auth (cascade apaga o profile) ─────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection();

  const profile = await getUserProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  const admin = getAdminClient();

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}