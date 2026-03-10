"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { Plus, Check } from "lucide-react";
import {
  validarQuantidadeTiras,
} from "@/lib/pedido-utils";
import type {
  Client,
  Produto,
  UnidadeProduto,
  CartItem,
} from "@/lib/schemas/types";
import Image from "next/image";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extrai a gramatura do nome do produto. Ex: "02-30GR CEBOLA" → "30GR" */
function extractGramatura(nome: string): string {
  const match = nome.match(/(\d+\s*GR)/i);
  return match ? match[1].toUpperCase().replace(/\s/g, "") : "OUTROS";
}

/** Extrai o sabor do nome/descrição. Ex: "30GR CEBOLA" → "CEBOLA" */
function extractSabor(descricao: string): string {
  return descricao.replace(/^\d+\s*GR\s*/i, "").trim();
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  client: Client | null;
  cartItems: CartItem[];
  onAdd: (
    produto: Produto,
    unidade: UnidadeProduto,
    quantidade: number,
  ) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductSelector({ client, cartItems, onAdd }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [erroQuantidade, setErroQuantidade] = useState<string | null>(null);

  // Seleções step-by-step
  const [gramaturaSelected, setGramaturaSelected] = useState<string | null>(
    null,
  );
  const [produtoSelected, setProdutoSelected] = useState<Produto | null>(null);
  const [unidadeSelected, setUnidadeSelected] = useState<UnidadeProduto | null>(
    null,
  );
  const [quantidade, setQuantidade] = useState(1);

  // Feedback de adicionado
  const [justAdded, setJustAdded] = useState(false);

  // ── Busca produtos quando cliente é selecionado ───────────────────────────
  useEffect(() => {
    if (!client) {
      setProdutos([]);
      resetSelections();
      return;
    }

    setLoading(true);
    setError(null);

    fetch("/api/produtos")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar produtos");
        return res.json();
      })
      .then((data: Produto[]) =>
        setProdutos(
          data.map((p) => ({
            ...p,
            unidades_produto: p.unidades_produto ?? [],
          })),
        ),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [client]);

  // ── Resets ────────────────────────────────────────────────────────────────

  const resetSelections = () => {
    setGramaturaSelected(null);
    setProdutoSelected(null);
    setUnidadeSelected(null);
    setQuantidade(1);
  };

  const handleSelectGramatura = (g: string) => {
    setGramaturaSelected(g);
    setProdutoSelected(null);
    setUnidadeSelected(null);
    setQuantidade(1);
  };

  const handleSelectProduto = (p: Produto) => {
    setProdutoSelected(p);
    setUnidadeSelected(null);
    setErroQuantidade(null);
    setQuantidade(1);
  };
  const handleSelectUnidade = (u: UnidadeProduto) => {
    setUnidadeSelected(u);
    setErroQuantidade(null);
    setQuantidade(1);
  };

  // ── Adicionar ao pedido ───────────────────────────────────────────────────

  const handleAdd = () => {
    if (!produtoSelected || !unidadeSelected || quantidade < 1) return;

    const erro = validarQuantidadeTiras(
      quantidade,
      unidadeSelected.nome_unidade,
      produtoSelected.gramatura,
    );
    if (erro) {
      setErroQuantidade(erro);
      return;
    }

    setErroQuantidade(null);
    onAdd(produtoSelected, unidadeSelected, quantidade);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    setProdutoSelected(null);
    setUnidadeSelected(null);
    setQuantidade(1);
  };

  // ── Utilitários ───────────────────────────────────────────────────────────

  const gramaturas = useMemo(() => {
    const set = new Set(produtos.map((p) => extractGramatura(p.nome)));
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    if (!gramaturaSelected) return [];
    return produtos.filter(
      (p) => extractGramatura(p.nome) === gramaturaSelected,
    );
  }, [produtos, gramaturaSelected]);

  /** Verifica se determinado produto+unidade já está no carrinho */
  const isInCart = (produtoId: number, unidadeId: number) =>
    cartItems.some((i) => i.key === `${produtoId}-${unidadeId}`);

  // ─────────────────────────────────────────────────────────────────────────

  if (!client) {
    return (
      <p className="text-sm text-muted-foreground">
        Selecione um cliente para carregar os produtos.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Erro ao carregar produtos: {error}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── PASSO 1: Gramatura ─────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Gramatura
        </p>
        <div className="flex flex-wrap gap-2">
          {gramaturas.map((g) => (
            <button
              key={g}
              onClick={() => handleSelectGramatura(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                gramaturaSelected === g
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── PASSO 2: Sabor ─────────────────────────────────────────────── */}
      {gramaturaSelected && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Sabor
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {produtosFiltrados.map((produto) => {
              const sabor = extractSabor(produto.descricao);
              const selected = produtoSelected?.id === produto.id;

              return (
                <button
                  key={produto.id}
                  onClick={() => handleSelectProduto(produto)}
                  className={`p-3 rounded-lg border text-left text-sm font-medium transition-colors ${
                    selected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex flex-row items-center gap-1">
                    {produto.img_url && (
                      <Image
                        src={produto.img_url as string}
                        alt={sabor}
                        width={42}
                        height={42}
                        className="mb-2"
                      />
                    )}
                    {sabor}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PASSO 3: Unidade ───────────────────────────────────────────── */}
      {produtoSelected && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Unidade
          </p>
          <div className="flex flex-wrap gap-2">
            {produtoSelected.unidades_produto
              .filter((u) => u.ativo)
              .map((unidade) => {
                const alreadyInCart = isInCart(produtoSelected.id, unidade.id);
                const selected = unidadeSelected?.id === unidade.id;

                return (
                  <button
                    key={unidade.id}
                    onClick={() =>
                      !alreadyInCart && handleSelectUnidade(unidade)
                    }
                    disabled={alreadyInCart}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      alreadyInCart
                        ? "opacity-40 cursor-not-allowed border-border bg-muted"
                        : selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                    }`}
                  >
                    {alreadyInCart && "✓ "}
                    {unidade.nome_unidade}
                    <span className="ml-1.5 text-xs opacity-70">
                      R$ {Number(unidade.preco).toFixed(2)}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── PASSO 4: Quantidade + Adicionar ────────────────────────────── */}
      {unidadeSelected && (
        <div className="flex items-end gap-3 flex-wrap">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Quantidade
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors font-medium"
              >
                −
              </button>
              <Input
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) =>
                  setQuantidade(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center"
              />
              <button
                onClick={() => setQuantidade((q) => q + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors font-medium"
              >
                +
              </button>
            </div>
          </div>

          <Button
            onClick={handleAdd}
            className={`gap-2 transition-all duration-200 ${
              justAdded ? "bg-green-600 hover:bg-green-600" : ""
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" /> Adicionado!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Adicionar ao Pedido
              </>
            )}
          </Button>
          {erroQuantidade && (
            <p className="text-sm text-destructive">{erroQuantidade}</p>
          )}
        </div>
      )}

      {/* Preview da seleção atual */}
      {produtoSelected && unidadeSelected && (
        <div className="text-sm border rounded-md p-3 bg-muted/40 text-muted-foreground">
          <span className="font-medium text-foreground">
            {produtoSelected.descricao}
          </span>
          {" · "}
          {unidadeSelected.nome_unidade}
          {" · "}
          {quantidade}x{" · "}
          <span className="font-medium text-foreground">
            R$ {(Number(unidadeSelected.preco) * quantidade).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
