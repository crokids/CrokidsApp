"use client";

export default function Cart() {
  return (
    <div>
      <h2 className="font-semibold text-lg mb-3">Carrinho</h2>

      <p className="text-sm text-gray-500">
        Nenhum produto adicionado.
      </p>

      <button className="mt-4 bg-black text-white px-4 py-2 rounded">
        Finalizar Pedido
      </button>
    </div>
  );
}