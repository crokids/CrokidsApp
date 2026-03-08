"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Users,
  Package,
  Download,
  X,
} from "lucide-react";

import { LogoutButton } from "../logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { CrokidsLogo } from "@/components/landingpage/crokids-logo"

export default function MobileSidebar({
  role,
  open,
  setOpen,
}: {
  role: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
     { name: "Usuários", href: "/dashboard/usuarios", icon: Users },
    { name: "Realizar Pedido", href: "/dashboard/pedidos", icon: ShoppingCart },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Produtos", href: "/dashboard/produtos", icon: Package },
    { name: "Exportar", href: "/dashboard/export", icon: Download },
  ];

  const vendedorLinks = [
    { name: "Realizar Pedido", href: "/dashboard/pedidos", icon: ShoppingCart },
    { name: "Pedidos", href: "/dashboard/export", icon: Download },
  ];

  const links = role === "admin" ? adminLinks : vendedorLinks;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">

      {/* sidebar */}
      <div className="w-64 bg-background border-r h-full flex flex-col animate-in slide-in-from-left">

        {/* header */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <CrokidsLogo size={'default'} />
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
                ${
                  active
                    ? "bg-muted font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* footer */}
        <div className="border-t p-4 space-y-3">

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tema</span>
            <ThemeSwitcher />
          </div>

          <LogoutButton />

        </div>
      </div>

      {/* overlay */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
    </div>
  );
}