import ClientForm from "@/components/form/client-form";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export default function NovoClientePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Novo Cliente</h1>

        <Link href="/dashboard/clientes">
          <Button>
            <ArrowBigLeft className="mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <ClientForm />
    </div>
  );
}
