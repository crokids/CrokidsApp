"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldOff, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Pedido = {
  id: number;
  nome_cliente: string;
  cidade_cliente: string;
  tipo_pagamento: string;
  nf: boolean;
  total: number;
  created_at: string;
};

type PedidoMes = {
  mes: string;   // "Jan", "Fev" ...
  total: number;
};

type Props = {
  nomeVendedor: string;
  ultimosPedidos: Pedido[];
  pedidosPorMes: PedidoMes[];
  clientesAtivos: number;
  clientesBloqueados: number;
  totalProdutos: number;
  pedidosMes: number;
};

export default function DashboardClient({
  nomeVendedor,
  ultimosPedidos,
  pedidosPorMes,
  clientesAtivos,
  clientesBloqueados,
  totalProdutos,
  pedidosMes,
}: Props) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Olá, {nomeVendedor} 👋
      </h1>

      {/* ── Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{clientesAtivos}</p>
              <p className="text-xs text-muted-foreground">Clientes ativos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-700">
              <ShieldOff className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{clientesBloqueados}</p>
              <p className="text-xs text-muted-foreground">Bloqueados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{totalProdutos}</p>
              <p className="text-xs text-muted-foreground">Produtos ativos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{pedidosMes}</p>
              <p className="text-xs text-muted-foreground">Pedidos no mês</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Gráfico + Últimos pedidos ──────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Gráfico de barras */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pedidos por mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pedidosPorMes} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  formatter={(v) => [Number(v), "Pedidos"]}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Últimos 5 pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimosPedidos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
            ) : (
              <div className="divide-y">
                {ultimosPedidos.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.nome_cliente}</p>
                      <p className="text-xs text-muted-foreground">{p.cidade_cliente}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant={p.tipo_pagamento === "AV" ? "default" : "secondary"}>
                        {p.tipo_pagamento}
                      </Badge>
                      {p.nf && <Badge variant="outline">NF</Badge>}
                      <span className="text-sm font-semibold tabular-nums">
                        R$ {Number(p.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}