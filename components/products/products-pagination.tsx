"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {

  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(newPage: number) {

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    router.push(`/dashboard/produtos?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2">

      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
      >
        Anterior
      </Button>

      <span className="flex items-center px-4 text-sm">
        Página {page} de {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
      >
        Próxima
      </Button>

    </div>
  );
}