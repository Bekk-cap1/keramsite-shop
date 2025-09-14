import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../CartContext"; // импорт контекста
import "../style/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();

  const totalCartPrice = cart.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate("/order");
    } else {
      toast.error("Корзина пуста!");
    }
  };

  const handleRemove = (itemId, name) => {
    removeFromCart(itemId);
    toast.error(`${name} удалён из корзины!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h2
        className="cart-page-title text-3xl font-bold text-center mb-6"
        style={{ color: "var(--brown)" }}
      >
        🛒 Ваша корзина
      </h2>

      {cart.length === 0 ? (
        <p
          className="cart-empty text-center text-lg"
          style={{ color: "var(--brown)" }}
        >
          Корзина пуста
        </p>
      ) : (
        <>
          <ul className="space-y-6">
            {cart.map((item) => (
              <li
                key={item._id}
                className=" flex flex-col sm:flex-row justify-between items-center p-4 rounded-xl shadow-lg bg-white"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.name}
                    className="w-60 h-30 object-cover rounded-lg shadow-md"
                  />
                  <div>
                    <h3
                      className="cart-item-name font-semibold text-lg"
                      style={{ color: "var(--brown)" }}
                    >
                      {item.name}
                    </h3>
                    <p className="cart-item-description text-sm text-gray-600">
                      {item.shortDescription || ""}
                    </p>
                    <p
                      className="cart-item-price text-md font-semibold mt-1"
                      style={{ color: "var(--brown)" }}
                    >
                      {item.price.toLocaleString()} сум{" "}
                      {item.quantity ? `×${item.quantity}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  className="cart-remove-button bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 mt-4 sm:mt-0"
                  onClick={() => handleRemove(item._id, item.name)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary mt-6 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center bg-white w-full">
            <p
              className="text-lg font-semibold mb-2 sm:mb-0 w-1/2"
              style={{ color: "var(--brown)" }}
            >
              💰 Сумма: {totalCartPrice.toLocaleString()} сум
            </p>
            <div className="flex gap-2 flex-col w-full sm:flex-row sm:w-1/2 sm:items-center">
              <button
                className="cart-checkout-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={handleCheckout}
              >
                Перейти к оформлению
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-brown px-4 py-3 rounded-lg"
                onClick={clearCart}
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
