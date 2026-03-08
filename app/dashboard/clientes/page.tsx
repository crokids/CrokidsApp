import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import ClientsSearch from "@/components/clients/clients-search";
import ClientsTable from "@/components/clients/clients-table";
import ClientsPagination from "@/components/clients/clients-pagination";

const PAGE_SIZE = 10;

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}) {
  const { page = "1", search = "", status = "" } = await searchParams;

  const currentPage = Number(page);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  // Query da tabela de clientes
  let query = supabase
    .from("clientes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    const isNumeric = /^\d+$/.test(search);
    if (isNumeric) {
      query = query.or(
        `codcli.eq.${Number(search)},razao.ilike.%${search}%,fantasia.ilike.%${search}%`,
      );
    } else {
      query = query.or(`razao.ilike.%${search}%,fantasia.ilike.%${search}%`);
    }
  }

  if (status === "ativo") {
    query = query.eq("bloqueio", "N");
  } else if (status === "bloqueado") {
    query = query.eq("bloqueio", "S");
  }

  const { data: clientes, count } = await query.range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6 min-w-0 overflow-hidden">
      {/* Header + botão criar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>

        <Link href="/dashboard/clientes/novo">
          <Button>Novo cliente</Button>
        </Link>
      </div>

      {/* Busca */}
      <ClientsSearch />

      {/* Tabela */}
      <ClientsTable clientes={clientes ?? []} />

      {/* Paginação */}
      <ClientsPagination page={currentPage} totalPages={totalPages} />
    </div>
  );
}
