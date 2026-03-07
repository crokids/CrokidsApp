"use client";

import Link from "next/link";
import { Home, ShoppingCart, Users, Package, Download } from "lucide-react";
import { LogoutButton } from "../logout-button";

export default function Sidebar({ role }: { role: string }) {
  const adminLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Pedidos", href: "/dashboard/pedidos", icon: ShoppingCart },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Produtos", href: "/dashboard/produtos", icon: Package },
    { name: "Exportar", href: "/dashboard/export", icon: Download },
  ];

  const vendedorLinks = [
    { name: "Pedidos", href: "/dashboard/pedidos", icon: ShoppingCart },
  ];

  const links = role === "admin" ? adminLinks : vendedorLinks;

  return (
     <aside className="w-64 bg-zinc-900 text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Crokids</h2>

      <nav className="flex flex-col gap-3 flex-1">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800"
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <LogoutButton />
    </aside>
  );
}
