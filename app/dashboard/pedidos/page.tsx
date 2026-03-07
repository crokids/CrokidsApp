import ClientSearch from "./components/client-search";
import ProductSelector from "./components/product-selector";
import Cart from "./components/cart";

export default function PedidosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Novo Pedido</h1>

      {/* Cliente */}
      <div className="bg-white p-4 rounded-lg shadow">
        <ClientSearch />
      </div>

      {/* Produtos */}
      <div className="bg-white p-4 rounded-lg shadow">
        <ProductSelector />
      </div>

      {/* Carrinho */}
      <div className="bg-white p-4 rounded-lg shadow">
        <Cart />
      </div>
    </div>
  );
}