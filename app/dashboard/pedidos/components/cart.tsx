"use client";

import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import type { Client, CartItem } from "@/lib/schemas/types";
import Image from "next/image";
import { quantidadeEmTiras, precoPorTira } from "@/lib/pedido-utils";

type Props = {
  client: Client | null;
  cartItems: CartItem[];
  onRemove: (key: string) => void;
  onUpdateQuantity: (key: string, quantidade: number) => void;
  onConfirm: () => void;
};

/** Separa gramatura e sabor. Ex: "30GR QUEIJO" → ["30GR", "QUEIJO"] */
function splitDescricao(descricao: string): {
  gramatura: string;
  sabor: string;
} {
  const match = descricao.match(/^(\d+\s*GR)\s*(.+)$/i);
  if (match) return { gramatura: match[1].toUpperCase(), sabor: match[2] };
  return { gramatura: "", sabor: descricao };
}

export default function Cart({
  client,
  cartItems,
  onRemove,
  onUpdateQuantity,
  onConfirm,
}: Props) {
  const totalPrice = cartItems.reduce((acc, i) => {
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

  if (!client) {
    return (
      <p className="text-sm text-muted-foreground">
        Selecione um cliente para iniciar o pedido.
      </p>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <ShoppingCart className="w-10 h-10 opacity-20" />
        <p className="text-sm">Nenhum produto adicionado ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="divide-y">
        {cartItems.map((item) => {
          const { gramatura, sabor } = splitDescricao(item.produto.descricao);

          // ✅ Converte tudo para tiras
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
            <div key={item.key} className="py-3 flex items-center gap-3">
              {/* Imagem */}
              {item.produto.img_url ? (
                <Image
                  src={item.produto.img_url}
                  alt={item.produto.descricao}
                  width={32}
                  height={32}
                  className="rounded object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded bg-muted shrink-0" />
              )}

              {/* Nome */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium leading-tight">
                  {gramatura}
                </p>
                <p className="text-sm font-semibold leading-tight truncate">
                  {sabor}
                </p>
                {/* ✅ Sempre em tiras */}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tiras} tira{tiras !== 1 ? "s" : ""} · R${" "}
                  {precoTira.toFixed(2)}/tira
                </p>
              </div>

              {/* Controle de quantidade — mantém a unidade que o vendedor selecionou */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.key, item.quantidade - 1)
                  }
                  className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors text-sm"
                >
                  −
                </button>
                <span className="w-7 text-center text-sm font-medium tabular-nums">
                  {item.quantidade}
                </span>
                <button
                  onClick={() =>
                    onUpdateQuantity(item.key, item.quantidade + 1)
                  }
                  className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors text-sm"
                >
                  +
                </button>
              </div>

              {/* ✅ Subtotal em tiras */}
              <p className="text-sm font-semibold w-16 text-right tabular-nums shrink-0">
                R$ {subtotal.toFixed(2)}
              </p>

              <button
                onClick={() => onRemove(item.key)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                title="Remover item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Total + confirmar */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
          </p>
          <p className="text-lg font-bold tabular-nums">
            Total: R$ {totalPrice.toFixed(2)}
          </p>
        </div>

        <Button className="w-full" size="lg" onClick={onConfirm}>
          Confirmar Pedido
        </Button>
      </div>
    </div>
  );
}
