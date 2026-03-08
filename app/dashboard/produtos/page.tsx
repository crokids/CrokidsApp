import { createClient } from "@/lib/supabase/server";
import ProductsTable from "@/components/products/products-table";
import ProductsPagination from "@/components/products/products-pagination";
import ProductsSearch from "@/components/products/products-search";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}) {
  const { page = "1", search = "" } = await searchParams;

  const currentPage = Number(page);

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("produtos")
    .select(
      `
    id,
    nome,
    img_url,
    ativo,
    created_at,
    unidades_produto(id)
  `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("nome", `%${search}%`);
  }

  const { data: produtos, count } = await query.range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>

        <Link href="/dashboard/produtos/novo">
          <Button>Novo produto</Button>
        </Link>
      </div>

      <ProductsSearch />

      <ProductsTable produtos={produtos ?? []} />

      <ProductsPagination page={currentPage} totalPages={totalPages} />
    </div>
  );
}
