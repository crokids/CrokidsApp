import ClientSearch from "./components/client-search";
import ProductSelector from "./components/product-selector";
import Cart from "./components/cart";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PedidosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Novo Pedido</h1>

      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientSearch />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSelector />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carrinho</CardTitle>
        </CardHeader>
        <CardContent>
          <Cart />
        </CardContent>
      </Card>
    </div>
  );
}