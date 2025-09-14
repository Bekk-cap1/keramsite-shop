// (отображение корзины)

import React from "react";
import { useCart } from "../CartContext";

const CartPage = () => {
  const { cartItems } = useCart();

  if (cartItems.length === 0) return <p>Корзина пуста.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">🛒 Корзина</h1>
      {cartItems.map(item => (
        <div
          key={item.id}
          className="bg-white p-4 rounded-xl shadow mb-2 flex justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">Количество: {item.quantity} т</p>
          </div>
          <div className="text-right">
            <p className="text-blue-600 font-bold">{item.price * item.quantity} сум</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
