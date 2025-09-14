import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка корзины с сервера
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setCart([]); 
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.cart?.items?.map(i => ({ ...i.product, quantity: i.quantity })) || []);
    } catch (err) {
      console.error(err);
      toast.error("Не удалось загрузить корзину с сервера");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Сначала войдите в аккаунт!");
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: item._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // обновляем контекст
      toast.success("Товар добавлен в корзину");
    } catch (err) {
      toast.error("Не удалось добавить товар");
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      });
      fetchCart();
      toast.success("Товар успешно удален")
    } catch (err) {
      toast.error("Не удалось удалить товар");
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      toast.success("Корзина очищена");
    } catch (err) {
      toast.error("Не удалось очистить корзину");
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
