"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";

type Client = {
  codcli: number;
  fantasia: string;
  razao: string;
  cidade: string;
};

export default function ClientSearch() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setClients([]);
      return;
    }

    setLoading(true);

    fetch(`/api/clientes?search=${debouncedSearch}`)
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
      })
      .finally(() => setLoading(false));

  }, [debouncedSearch]);

  return (
    <div className="space-y-3 relative">

      {selected ? (
        <div className="border rounded-lg p-3 bg-muted flex justify-between">
          <div>
            <p className="font-medium">{selected.razao}</p>
            <p className="text-sm text-muted-foreground">
              {selected.codcli} - {selected.cidade}
            </p>
          </div>

          <button
            onClick={() => setSelected(null)}
            className="text-sm text-destructive"
          >
            trocar
          </button>
        </div>
      ) : (
        <>
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {(loading || clients.length > 0) && (
            <div className="absolute bg-popover border rounded-md w-full mt-1 shadow-md max-h-60 overflow-auto z-10 p-2">

              {loading && (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              )}

              {!loading &&
                clients.map((client) => (
                  <div
                    key={client.codcli}
                    onClick={() => {
                      setSelected(client);
                      setClients([]);
                      setSearch("");
                    }}
                    className="p-3 cursor-pointer hover:bg-muted rounded-md"
                  >
                    <p className="font-medium">{client.razao}</p>

                    <p className="text-xs text-muted-foreground">
                      {client.codcli} - {client.cidade}
                    </p>
                  </div>
                ))}

            </div>
          )}
        </>
      )}
    </div>
  );
}