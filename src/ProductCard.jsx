// (карточка товара с кнопкой)
import React from "react";
import { useCart } from "../CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="p-4 rounded-xl shadow-md bg-white flex flex-col items-start gap-2">
      <h2 className="text-xl font-bold text-blue-800">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.description}</p>
      <p className="text-lg font-semibold">{product.price} сум / тонна</p>
      <button
        onClick={() => addToCart(product, product.amount)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Добавить в корзину ({product.amount} т)
      </button>
    </div>
  );
};

export default ProductCard;
