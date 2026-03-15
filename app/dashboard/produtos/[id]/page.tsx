import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/form/product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;
  // ✅ Lê a página atual
  const { page = "1" } = await searchParams;

  const { data: produto } = await supabase
    .from("produtos")
    .select(
      `
      id,
      nome,
      descricao,
      img_url,
      ativo,
      gramatura,
      unidades_produto(
        id,
        nome_unidade,
        quantidade_salgadinho,
        preco
      )
    `, // ✅ gramatura incluída
    )
    .eq("id", id)
    .single();

  if (!produto) {
    return <div>Produto não encontrado</div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Produto</h1>

        {/* ✅ Voltar preserva a página */}
        <Link href={`/dashboard/produtos?page=${page}`}>
          <Button variant="outline">
            <ArrowBigLeft />
            Voltar
          </Button>
        </Link>
      </div>

      <ProductForm product={produto} />
    </div>
  );
}