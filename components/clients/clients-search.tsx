"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ClientsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsString = useMemo(() => searchParams.toString(), [searchParams]);

  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "todos");

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const params = new URLSearchParams(paramsString);
    const currentSearch = params.get("search") ?? "";

    if (debouncedValue === currentSearch) return;

    if (debouncedValue) {
      params.set("search", debouncedValue);
    } else {
      params.delete("search");
    }

    params.set("page", "1");
    router.replace(`/dashboard/clientes?${params.toString()}`);
  }, [debouncedValue, paramsString, router]);

  function handleStatusChange(val: string) {
    setStatus(val);
    const params = new URLSearchParams(paramsString);

    if (val === "todos") {
      params.delete("status");
    } else {
      params.set("status", val);
    }

    params.set("page", "1");
    router.replace(`/dashboard/clientes?${params.toString()}`);
  }

  return (
    <div className="flex gap-3">
      <Input
        className="max-w-sm"
        placeholder="Buscar cliente..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="ativo">Ativos</SelectItem>
          <SelectItem value="bloqueado">Bloqueados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}