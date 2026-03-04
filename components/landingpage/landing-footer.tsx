"use client";
import { CrokidsLogo } from "@/components/landingpage/crokids-logo";


export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <CrokidsLogo />
          <p className="text-center text-sm text-muted-foreground">
            {"\u00A9"} {new Date().getFullYear()} Crokids Salgadinhos de Trigo.
            Todos os direitos reservados.
          </p>
      </div>
    </footer>
  );
}
