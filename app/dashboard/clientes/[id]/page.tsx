import { createClient } from "@/lib/supabase/server";
import ClientForm from "@/components/form/client-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";

export default async function EditClientPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { id } = await params;

  const { data: cliente, error } = await supabase
    .from("clientes")
    .select(
      `
    id,
    codcli,
    razao,
    fantasia,
    tipo_log,
    tipo_estab,
    nome_log,
    bairro,
    cidade,
    estado,
    uf,
    telefone,
    celular,
    cnpj_cpf,
    tipo_estab,
    bloqueio,
    dt_bloqueo
  `,
    )
    .eq("id", id)
    .single();

  console.log("Erro:", error);

  if (!cliente) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Cliente</h1>

        <Link href="/dashboard/clientes">
          <Button>
            <ArrowBigLeft />
            Voltar
          </Button>
        </Link>
      </div>

      <ClientForm
        key={cliente.id}
        cliente={{
          ...cliente,
          fantasia: cliente.fantasia ?? "",
          tipo_log: cliente.tipo_log ?? undefined,
          nome_log: cliente.nome_log ?? "",
          bairro: cliente.bairro ?? "",
          cidade: cliente.cidade ?? "",
          estado: cliente.estado ?? "",
          uf: cliente.uf ?? "",
          telefone: cliente.telefone ?? "",
          celular: cliente.celular ?? "",
          cnpj_cpf: cliente.cnpj_cpf ?? "",
          tipo_estab: cliente.tipo_estab ?? "",
          bloqueio: (cliente.bloqueio ?? "N") as "S" | "N",
          dt_bloqueo: cliente.dt_bloqueo ?? "",
        }}
      />
    </div>
  );
}
