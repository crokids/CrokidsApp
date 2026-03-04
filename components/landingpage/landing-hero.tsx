"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Package, TrendingUp, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Left content */}
        <div className="relative z-10 flex flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Sistema de Pedidos Online
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-balance font-sans text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              O sabor <span className="text-primary">crocante</span>
              {" que todo mundo "}
              <span className="relative inline-block">
                <span className="relative z-10">ama</span>
                <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-accent/30 md:bottom-2 md:h-4" />
              </span>
            </h1>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Gerencie pedidos, controle producao e acompanhe entregas dos seus
              salgadinhos de trigo favoritos. Tudo num so lugar.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group gap-2 rounded-full px-8 py-6 text-base font-semibold"
              >
                Acessar o Sistema
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 border-t border-border pt-8 md:gap-12">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Package className="size-4 text-primary" />
                <span className="font-mono text-3xl font-bold text-foreground">
                  2k+
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Produção
              </span>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Star className="size-4 text-primary" />
                <span className="font-mono text-3xl font-bold text-foreground">
                  12+
                </span>
              </div>
              <span className="text-sm text-muted-foreground">Sabores</span>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="size-4 text-primary" />
                <span className="font-mono text-3xl font-bold text-foreground">
                  98%
                </span>
              </div>
              <span className="text-sm text-muted-foreground">Satisfacao</span>
            </div>
          </div>
        </div>

        {/* Right side - product showcase */}
        <div className="relative">
          {/* Main image */}
          <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-2xl shadow-primary/10">
            <Image
              src="/images/hero-snacks.png"
              alt="Salgadinhos de trigo Crokids - conchinhas crocantes"
              width={700}
              height={500}
              className="aspect-[4/3] w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

            {/* Overlay card */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/80 p-4 backdrop-blur-lg">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="size-6 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    Pedido #3482 confirmado
                  </span>
                  <span className="text-xs text-muted-foreground">
                    500 pct Conchinha + 300 pct Tubinho - Saiu para entrega
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating mascot card */}
          <div className="absolute -left-6 -top-6 z-20 hidden overflow-hidden rounded-2xl border border-border/50 bg-card p-2 shadow-xl md:block">
            <Image
              src="/images/crokids-logo.png"
              alt="Mascote Crokids"
              width={72}
              height={72}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Floating snack detail card */}
          <div className="absolute -right-4 top-8 hidden rounded-2xl border border-border/50 bg-card p-3 shadow-lg md:block">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-lg bg-accent/20 bg-slate-900 dark:bg-white">
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 fill-none stroke-accent"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-xs font-medium text-foreground">
                Lote aprovado
              </span>
            </div>
          </div>

          {/* Close-up texture card */}
          <div className="absolute -bottom-4 -right-4 hidden overflow-hidden rounded-2xl border border-border/50 shadow-lg md:block">
            <Image
              src="/images/snack-shells.png"
              alt="Textura crocante dos salgadinhos"
              width={120}
              height={80}
              className="aspect-[3/2] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
