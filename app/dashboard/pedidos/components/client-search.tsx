"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect } from "react";

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

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
     if (!debouncedSearch) return
    const delay = setTimeout(() => {
      if (search.length < 2) {
        setClients([]);
        return;
      }

      fetch(`/api/clientes?search=${debouncedSearch}`)
        .then((res) => res.json())
        .then(setClients);
    }, 300);

    return () => clearTimeout(delay);
  }, [search, debouncedSearch]);

  return (
    <div className="space-y-3 relative">
      <h2 className="font-semibold text-lg text-slate-800">Cliente</h2>

      {selected ? (
        <div className="border p-3 rounded bg-green-50 flex justify-between">
          <div>
            <p className="font-medium text-slate-500">{selected.razao}</p>
            <p className="text-sm text-slate-500">
              {selected.codcli} - {selected.cidade}
            </p>
          </div>

          <button
            onClick={() => setSelected(null)}
            className="text-sm text-red-500"
          >
            trocar
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-2 bg-slate-800"
          />

          {clients.length > 0 && (
            <div className="absolute bg-slate-800 border rounded w-full mt-1 shadow max-h-60 overflow-auto z-10">
              {clients.map((client) => (
                <div
                  key={client.codcli}
                  onClick={() => {
                    setSelected(client);
                    setClients([]);
                    setSearch("");
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <p className="font-medium text-white">{client.razao}</p>
                  <p className="text-xs text-slate-400">
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