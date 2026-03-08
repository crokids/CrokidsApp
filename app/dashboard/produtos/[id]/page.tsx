import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/form/product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { id } = await params;

  const { data: produto } = await supabase
    .from("produtos")
    .select(
      `
      id,
      nome,
      descricao,
      img_url,
      ativo,
      unidades_produto(
        id,
        nome_unidade,
        quantidade_salgadinho,
        preco
      )
    `,
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

        <Link href="/dashboard/produtos">
          <Button>
            <ArrowBigLeft />
            Voltar
          </Button>
        </Link>
      </div>

      <ProductForm product={produto} />
    </div>
  );
}
