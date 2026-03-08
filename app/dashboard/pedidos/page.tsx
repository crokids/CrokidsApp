"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ClientSearch from "./components/client-search";
import ProductSelector from "./components/product-selector";
import Cart from "./components/cart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Client, Produto, UnidadeProduto, CartItem } from "@/lib/schemas/types";

// Componente interno que recebe a key e reseta quando ela muda
function PedidoForm() {
  const router = useRouter();

  const [client, setClient] = useState<Client | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItem = (produto: Produto, unidade: UnidadeProduto, quantidade: number) => {
    const key = `${produto.id}-${unidade.id}`;
    setCartItems((prev) => {
      const exists = prev.find((i) => i.key === key);
      if (exists) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantidade: i.quantidade + quantidade } : i
        );
      }
      return [...prev, { key, produto, unidade, quantidade }];
    });
  };

  const removeItem = (key: string) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key));
  };

  const updateQuantity = (key: string, quantidade: number) => {
    if (quantidade <= 0) return removeItem(key);
    setCartItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantidade } : i))
    );
  };

  const handleSelectClient = (c: Client | null) => {
    setClient(c);
    setCartItems([]);
  };

  const handleConfirm = () => {
    sessionStorage.setItem(
      "pedido_rascunho",
      JSON.stringify({ client, cartItems })
    );
    router.push("/dashboard/pedidos/confirmar");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Novo Pedido</h1>

      <Card>
        <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
        <CardContent>
          <ClientSearch selected={client} onSelect={handleSelectClient} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Produtos</CardTitle></CardHeader>
        <CardContent>
          <ProductSelector
            client={client}
            cartItems={cartItems}
            onAdd={addItem}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Carrinho
            {cartItems.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({cartItems.length} {cartItems.length === 1 ? "item" : "itens"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Cart
            client={client}
            cartItems={cartItems}
            onRemove={removeItem}
            onUpdateQuantity={updateQuantity}
            onConfirm={handleConfirm}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Page lê o searchParam e passa como key para forçar remount ao iniciar novo pedido
export default function PedidosPage() {
  const searchParams = useSearchParams();
  const resetKey = searchParams.get("new") ?? "initial";

  return <PedidoForm key={resetKey} />;
}