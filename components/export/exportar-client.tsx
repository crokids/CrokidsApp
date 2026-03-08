"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Download, Loader2, ChevronRight, ChevronDown, Trash2 } from "lucide-react";

type ItemPedido = {
  nome_produto: string;
  nome_unidade: string;
  quantidade: number;
  quantidade_unidade: number;
  preco_unitario: number;
  subtotal: number;
};

type PedidoExport = {
  id: number;
  created_at: string;
  codcli: number;
  codigo_vendedor: string;
  tipo_pagamento: string;
  nf: boolean;
  nome_cliente: string;
  total: number;
  itens: ItemPedido[];
};

type Props = {
  isAdmin: boolean;
};

export default function ExportarClient({ isAdmin }: Props) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [pedidos, setPedidos] = useState<PedidoExport[]>([]);
  const [produtos, setProdutos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<Set<number>>(new Set());
  const [deletando, setDeletando] = useState<number | null>(null);
  const [pedidoParaDeletar, setPedidoParaDeletar] = useState<number | null>(null);

  const toggleExpandir = (id: number) => {
    setExpandido((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBuscar = async () => {
    if (!dataInicio || !dataFim) { setError("Selecione as duas datas."); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/pedidos/exportar?inicio=${dataInicio}&fim=${dataFim}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setPedidos(data.pedidos);
      setProdutos(data.produtos);
      setExpandido(new Set());
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: number) => {
    setDeletando(id);
    setPedidoParaDeletar(null);
    try {
      const res = await fetch(`/api/pedidos/delete/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        toast.error("Erro ao excluir pedido", { description: d.error });
        return;
      }
      setPedidos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pedido excluído com sucesso.");
    } catch {
      toast.error("Erro de conexão ao excluir pedido.");
    } finally {
      setDeletando(null);
    }
  };

  const handleExportar = () => {
    if (!pedidos.length) return;
    setExportando(true);
    try {
      const header = [
        "Data", "Cod_cli", "cod_vendedor", "tipo_pgt", "nf", "obs",
        ...produtos.flatMap((_, i) => [`Produto${i + 1}`, `Quantidade${i + 1}`]),
      ].join(";");

      const linhas = pedidos.map((p) => {
        const qtdMap: Record<string, number> = {};
        p.itens.forEach((item) => { qtdMap[item.nome_produto] = item.quantidade_unidade; });

        const d = new Date(p.created_at);
        const data = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

        return [
          data, p.codcli, p.codigo_vendedor, p.tipo_pagamento,
          p.nf ? "true" : "false", "",
          ...produtos.flatMap((nome) => [nome, String(qtdMap[nome] ?? 0)]),
        ].join(";");
      });

      const csv = [header, ...linhas].join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pedidos_${dataInicio}_${dataFim}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isAdmin ? "Exportar Pedidos" : "Meus Pedidos"}
      </h1>

      {/* Filtros */}
      <Card>
        <CardHeader><CardTitle className="text-base">Filtro por período</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Data início
              </label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Data fim
              </label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-40"
              />
            </div>
            <Button onClick={handleBuscar} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
            </Button>

            {/* Botão CSV apenas para admin */}
            {isAdmin && pedidos.length > 0 && (
              <Button variant="outline" onClick={handleExportar} disabled={exportando} className="gap-2">
                <Download className="w-4 h-4" />
                Exportar CSV ({pedidos.length} pedidos)
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Tabela */}
      {pedidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {pedidos.length} pedido{pedidos.length !== 1 && "s"} encontrado{pedidos.length !== 1 && "s"}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs">
                  <th className="w-8 px-3 py-2" />
                  <th className="text-left py-2 pr-4 font-medium px-3">Data</th>
                  <th className="text-left py-2 pr-4 font-medium">Cliente</th>
                  <th className="text-left py-2 pr-4 font-medium">Vendedor</th>
                  <th className="text-left py-2 pr-4 font-medium">Pgto</th>
                  <th className="text-left py-2 pr-4 font-medium">NF</th>
                  <th className="text-right py-2 pr-4 font-medium">Total</th>
                  <th className="w-8 py-2" />
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => {
                  const aberto = expandido.has(p.id);
                  const d = new Date(p.created_at);
                  const dataFmt = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                  const total = isNaN(Number(p.total)) ? 0 : Number(p.total);

                  return (
                    <React.Fragment key={p.id}>
                      <tr
                        className="border-b hover:bg-muted/40 transition-colors cursor-pointer"
                        onClick={() => toggleExpandir(p.id)}
                      >
                        <td className="px-3 py-2 text-muted-foreground">
                          {aberto ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </td>
                        <td className="py-2 pr-4 tabular-nums px-3 whitespace-nowrap">{dataFmt}</td>
                        <td className="py-2 pr-4">
                          <p className="font-medium">{p.nome_cliente}</p>
                          <p className="text-xs text-muted-foreground">{p.codcli}</p>
                        </td>
                        <td className="py-2 pr-4">{p.codigo_vendedor}</td>
                        <td className="py-2 pr-4">
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                            p.tipo_pagamento === "AV"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {p.tipo_pagamento}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-xs">{p.nf ? "Sim" : "Não"}</td>
                        <td className="py-2 pr-4 text-right tabular-nums font-semibold whitespace-nowrap">
                          R$ {total.toFixed(2)}
                        </td>
                        <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                            {isAdmin  && (
                          <button
                            onClick={() => setPedidoParaDeletar(p.id)}
                            disabled={deletando === p.id}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            title="Excluir pedido"
                          >
                            {deletando === p.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />}
                          </button>
                            )}
                        </td>
                      </tr>

                      {aberto && (
                        <tr className="bg-muted/30 border-b">
                          <td colSpan={8} className="px-10 py-3">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-muted-foreground border-b">
                                  <th className="text-left pb-1.5 font-medium">Produto</th>
                                  <th className="text-left pb-1.5 font-medium">Unidade</th>
                                  <th className="text-right pb-1.5 font-medium">Qtd</th>
                                  <th className="text-right pb-1.5 font-medium">Qtd (un)</th>
                                  <th className="text-right pb-1.5 font-medium">Preço/un</th>
                                  <th className="text-right pb-1.5 font-medium">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/50">
                                {p.itens.map((item, idx) => {
                                  const preco = isNaN(Number(item.preco_unitario)) ? 0 : Number(item.preco_unitario);
                                  const sub = isNaN(Number(item.subtotal)) ? 0 : Number(item.subtotal);
                                  return (
                                    <tr key={idx}>
                                      <td className="py-1.5 font-medium">{item.nome_produto}</td>
                                      <td className="py-1.5 text-muted-foreground">{item.nome_unidade}</td>
                                      <td className="py-1.5 text-right tabular-nums">{item.quantidade}</td>
                                      <td className="py-1.5 text-right tabular-nums">{item.quantidade_unidade}</td>
                                      <td className="py-1.5 text-right tabular-nums">R$ {preco.toFixed(2)}</td>
                                      <td className="py-1.5 text-right tabular-nums font-medium">R$ {sub.toFixed(2)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Dialog de confirmação */}
      <AlertDialog
        open={pedidoParaDeletar !== null}
        onOpenChange={(open) => { if (!open) setPedidoParaDeletar(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O pedido e todos os seus itens serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => pedidoParaDeletar && handleDeletar(pedidoParaDeletar)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}