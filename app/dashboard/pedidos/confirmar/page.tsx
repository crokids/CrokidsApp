"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Client, CartItem } from "@/lib/schemas/types";
import { quantidadeEmTiras, precoPorTira } from "@/lib/pedido-utils";

type TipoPagamento = "AV" | "AP";
type Rascunho = { client: Client; cartItems: CartItem[] };

export default function ConfirmarPedidoPage() {
  const router = useRouter();

  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const [tipoPagamento, setTipoPagamento] = useState<TipoPagamento>("AV");
  const [nf, setNf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [pedidoId, setPedidoId] = useState<number | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("pedido_rascunho");
    if (!raw) {
      router.replace("/dashboard/pedidos");
      return;
    }
    setRascunho(JSON.parse(raw));
  }, [router]);

  if (!rascunho) return null;

  const { client, cartItems } = rascunho;

  // Total calculado sempre em tiras
  const total = cartItems.reduce((acc, i) => {
    const tiras = quantidadeEmTiras(
      i.quantidade,
      i.unidade.nome_unidade,
      i.produto.gramatura,
    );
    const preco = precoPorTira(
      Number(i.unidade.preco),
      i.unidade.nome_unidade,
      i.produto.gramatura,
    );
    return acc + tiras * preco;
  }, 0);
  
  const handleConfirmar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, cartItems, tipoPagamento, nf }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar pedido.");
        return;
      }
      sessionStorage.removeItem("pedido_rascunho");
      setPedidoId(data.id);
      setSucesso(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-bold">Pedido #{pedidoId} confirmado!</h2>
        <p className="text-muted-foreground">O pedido foi salvo com sucesso.</p>
        <Button
          onClick={() => {
            router.push(`/dashboard/pedidos?new=${Date.now()}`);
            setSucesso(false);
          }}
        >
          Novo Pedido
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Confirmar Pedido</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{client.razao}</p>
          <p className="text-sm text-muted-foreground">
            {client.codcli} · {client.cidade}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {cartItems.map((item) => {
              const tiras = quantidadeEmTiras(
                item.quantidade,
                item.unidade.nome_unidade,
                item.produto.gramatura,
              );
              const precoTira = precoPorTira(
                Number(item.unidade.preco),
                item.unidade.nome_unidade,
                item.produto.gramatura,
              );
              const subtotal = tiras * precoTira;

              return (
                <div
                  key={item.key}
                  className="py-3 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {item.produto.descricao}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {/* Se selecionou Fardo, mostra a conversão. Se Tira, mostra direto */}
                      {item.unidade.nome_unidade === "Fardo" ? (
                        <>
                          {item.quantidade}x Fardo{" "}
                          <span className="text-foreground font-medium">
                            → {tiras} tira{tiras !== 1 ? "s" : ""}
                          </span>
                        </>
                      ) : (
                        <span className="text-foreground font-medium">
                          {tiras} tira{tiras !== 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums shrink-0">
                    R$ {subtotal.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-bold tabular-nums">R$ {total.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {(["AV", "AP"] as TipoPagamento[]).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoPagamento(tipo)}
                  className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                    tipoPagamento === tipo
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  {tipo === "AV" ? "À Vista" : "A Prazo"}
                  <span className="block text-xs font-normal opacity-70 mt-0.5">
                    {tipo}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nota Fiscal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {([true, false] as const).map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setNf(val)}
                  className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                    nf === val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  {val ? "Sim" : "Não"}
                  <span className="block text-xs font-normal opacity-70 mt-0.5">
                    NF
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={loading}
        >
          Voltar
        </Button>
        <Button className="flex-1" onClick={handleConfirmar} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Confirmar Pedido"
          )}
        </Button>
      </div>
    </div>
  );
}
