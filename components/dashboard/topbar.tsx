"use client";

import { Menu } from "lucide-react";

export default function Topbar({
  setOpen,
}: {
  setOpen: (v: boolean) => void;
}) {
  return (
    <div className="md:hidden flex items-center p-4 border-b">
      <button onClick={() => setOpen(true)}>
        <Menu />
      </button>

      <h1 className="ml-4 font-semibold">Crokids</h1>
    </div>
  );
}