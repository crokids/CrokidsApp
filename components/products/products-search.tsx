"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function ProductsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsString = useMemo(() => searchParams.toString(), [searchParams]);

  const initialSearch = searchParams.get("search") ?? "";

  const [value, setValue] = useState(initialSearch);

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

    router.replace(`/dashboard/produtos?${params.toString()}`);
  }, [debouncedValue, paramsString, router]);

  return (
    <div className="max-w-sm">
      <Input
        placeholder="Buscar produto..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}