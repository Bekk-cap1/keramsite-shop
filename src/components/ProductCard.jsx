import React from "react";
import { toast } from "react-toastify"; // Toast import qilish
import "../style/ProductCard.css"; // Agar CSS mavjud bo'lsa

const ProductCard = ({ product, onAdd }) => {
  if (!product) return <div>Продукт не найден</div>; // Xavfsizlik tekshiruvi

  const handleAddToCart = () => {
    onAdd(product);
    toast.success(`${product.name} корзинкга қўшилди!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="product-card">
      <h3 className="text-lg font-semibold text-primary">{product.name}</h3>
      <p className="text-secondary mt-1">Тип: {product.supportedProducts.join(", ")}</p>
      <p className="text-secondary">Макс. объём: {product.maxVolume} м³</p>
      <p className="text-primary font-bold mt-2">Цена: 0 сум</p> {/* Narxni keyinroq qo'shish mumkin */}
      <button
        onClick={handleAddToCart} // Hodisani o'zgarish
        className="mt-4 w-full bg-primary text-accent px-4 py-2 rounded-lg hover:bg-secondary hover:text-primary transition-all duration-300"
      >
        Добавить в корзину
      </button>
    </div>
  );
};

export default ProductCard;