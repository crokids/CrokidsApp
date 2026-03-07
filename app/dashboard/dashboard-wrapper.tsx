"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import Topbar from "@/components/dashboard/topbar";

export default function DashboardShell({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar role={role} />
      </div>

      {/* Sidebar Mobile */}
      <MobileSidebar role={role} open={open} setOpen={setOpen} />

      <div className="flex-1">
        <Topbar setOpen={setOpen} />

        <main className="p-6 bg-gray-50 min-h-screen">{children}</main>
      </div>
    </div>
  );
}