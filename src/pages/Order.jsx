import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";
import { toast } from "react-toastify";
import axios from "axios";
import "../style/Order.css";
import { useCart } from "../CartContext"; // импортируем контекст
import { v4 as uuidv4 } from "uuid";

const machines = [
  { id: 1, type: "Газель", capacity: 2 },
  { id: 2, type: "zil", capacity: 5 },
  { id: 3, type: "kamaz", capacity: 10 },
];

const Order = () => {
  const navigate = useNavigate();
  const { cart, loading, clearCart } = useCart(); // используем контекст

  const [order, setOrder] = useState({
    name: "",
    phone: "",
    passport: "",
    clientId: "",
    volume: "",
    machineId: "",
    address: "",
    deliveryType: "delivery",
    coordinates: null,
  });

  const [filteredMachines, setFilteredMachines] = useState([]);

  useEffect(() => {
    if (order.volume) {
      const filtered = machines.filter(
        (m) => m.capacity >= parseInt(order.volume)
      );
      setFilteredMachines(filtered);

      if (!filtered.find((m) => m.id === parseInt(order.machineId))) {
        setOrder((prev) => ({ ...prev, machineId: "" }));
      }
    } else {
      setFilteredMachines([]);
    }
  }, [order.volume, order.machineId]);

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleMapSelect = (coords) => {
    setOrder((prev) => ({ ...prev, coordinates: coords }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Корзина пуста!");
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const selectedMachine = machines.find((m) => m.id === parseInt(order.machineId));

    const items = cart.map((item) => ({
      product: item._id,
      quantity: item.quantity || 1,
    }));

    const deliveryMethod = order.deliveryType === "delivery"
      ? selectedMachine?.type?.toLowerCase() || "zil"
      : "pickup";

    const newOrder = {
      ...order,
      items,
      machineType: selectedMachine?.type || "",
      date: new Date(),
      total,
      status: "pending",
      deliveryMethod, // правильное значение для схемы
      // убираем orderNumber, пусть Mongoose сгенерирует
    };

    try {
      await axios.post("http://localhost:5000/api/orders", newOrder, {
        withCredentials: true,
      });

      clearCart();
      toast.success("Заказ успешно оформлен!");
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error.response?.data || error);
      toast.error(error.response?.data?.error || "Ошибка оформления заказа");
    }
  };



  if (loading) return <p>Загрузка корзины...</p>;
  if (cart.length === 0) {
    toast.error("Корзина пуста!");
    return;
  }

  return (
    <div className="order-container">
      <h2 className="order-title">📝 Оформление заказа</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <input name="name" placeholder="Имя" value={order.name} onChange={handleChange} className="order-input" required />
        <input name="phone" placeholder="Телефон" value={order.phone} onChange={handleChange} className="order-input" required />
        <input name="passport" placeholder="Паспорт или ИНН" value={order.passport} onChange={handleChange} className="order-input" required />
        <input name="clientId" placeholder="ID клиента (если есть)" value={order.clientId} onChange={handleChange} className="order-input" />

        <select name="volume" value={order.volume} onChange={handleChange} className="order-input order-select" required>
          <option value="">-- Выберите объём (тонн) --</option>
          <option value="2">2 тонны</option>
          <option value="5">5 тонн</option>
          <option value="10">10 тонн</option>
        </select>

        <select name="machineId" value={order.machineId} onChange={handleChange} className="order-input order-select" required>
          <option value="">-- Выберите машину --</option>
          {filteredMachines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.type} — {m.capacity}т
            </option>
          ))}
        </select>

        <textarea name="address" placeholder="Адрес доставки" value={order.address} onChange={handleChange} className="order-input order-textarea" required />

        <div className="order-delivery-options">
          <label className="order-radio-label">
            <input type="radio" name="deliveryType" value="delivery" checked={order.deliveryType === "delivery"} onChange={handleChange} />
            Доставка
          </label>
          <label className="order-radio-label">
            <input type="radio" name="deliveryType" value="pickup" checked={order.deliveryType === "pickup"} onChange={handleChange} />
            Самовывоз
          </label>
        </div>

        {order.deliveryType === "delivery" && (
          <div className="order-map-section">
            <p className="order-map-text">Выберите точку на карте:</p>
            <MapPicker onLocationSelect={handleMapSelect} />
            {order.coordinates && (
              <p className="order-map-coordinates">
                📍 Координаты: {order.coordinates.lat}, {order.coordinates.lng}
              </p>
            )}
          </div>
        )}

        <button type="submit" className="order-submit-button">✅ Подтвердить заказ</button>
      </form>
    </div>
  );
};

export default Order;
