"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { LogoutButton } from "../logout-button";

export default function MobileSidebar({
  role,
  open,
  setOpen,
}: {
  role: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const adminLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pedidos", href: "/dashboard/pedidos" },
    { name: "Clientes", href: "/dashboard/clientes" },
    { name: "Produtos", href: "/dashboard/produtos" },
    { name: "Exportar", href: "/dashboard/export" },
  ];

  const vendedorLinks = [{ name: "Pedidos", href: "/dashboard/pedidos" }];

  const links = role === "admin" ? adminLinks : vendedorLinks;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-64 bg-zinc-900 text-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Crokids</h2>

          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="p-2 rounded hover:bg-zinc-800"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <LogoutButton />
      </div>

      <div
        className="flex-1 bg-black/40"
        onClick={() => setOpen(false)}
      />
    </div>
  );
}