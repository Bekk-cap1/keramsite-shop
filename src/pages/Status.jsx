import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "../style/Status.css";

const Status = () => {
  const [lastOrder, setLastOrder] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [userRes, ordersRes] = await Promise.all([
          axios.get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUser(userRes.data.user);

        const orders = ordersRes.data.orders || [];
        if (orders.length === 0) return;

        // Последний заказ
        setLastOrder(orders[0]);

        // Активные заказы
        const actives = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled");
        setActiveOrders(actives);

        toast.info(
          `Статус последнего заказа: ${orders[0].status === "pending" ? "🕓 Ожидается" :
            orders[0].status === "confirmed" ? "✅ Подтверждён" :
              orders[0].status === "ready" ? "🏁 Готов" :
                orders[0].status === "delivered" ? "🏆 Доставлен" :
                  orders[0].status === "cancelled" ? "❌ Отменён" : "❓ Неизвестно"
          }`,
          { position: "top-right", autoClose: 3000 }
        );

      } catch (err) {
        console.error("Ошибка загрузки заказов:", err);
        toast.error("Не удалось загрузить заказы");
      }
    };

    fetchOrders();
  }, []);

  if (!lastOrder && activeOrders.length === 0) return <p className="status-no-data">Нет информации о заказах.</p>;

  const renderOrderCard = (order) => {
    const { items, deliveryMethod, deliveryAddress, total, status, createdAt } = order;
    return (
      <div key={order._id} className="status-card max-w-md">
        <div className="status-info w-full">
          <p><strong>Имя:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Телефон:</strong> {user?.phone}</p>
          <p><strong>Тип доставки:</strong> {deliveryMethod === "pickup" ? "Самовывоз" : "Доставка"}</p>
          {deliveryMethod !== "pickup" && <p><strong>Адрес:</strong> {deliveryAddress?.address}</p>}
          <p><strong>Сумма:</strong> {total.toLocaleString()} сум</p>
          <p><strong>Дата:</strong> {new Date(createdAt).toLocaleString()}</p>
          <p className="status-status w-full"><strong>Статус:</strong> {
            status === "pending" ? "🕓 Ожидается" :
              status === "confirmed" ? "✅ Подтверждён" :
                status === "ready" ? "🏁 Готов" :
                  status === "delivered" ? "🏆 Доставлен" :
                    status === "cancelled" ? "❌ Отменён" :
                      "❓ Неизвестно"
          }</p>

          <h4 className="status-items-title">Товары в заказе:</h4>
          <ul className="status-items-list">
            {items.map(item => (
              <li key={item.product._id} className="status-item">
                {item.product.name} — {item.quantity} шт — {item.total.toLocaleString()} сум
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="status-container">
      {lastOrder && (
        <>
          <h2 className="status-title">📦 Последний заказ</h2>
          {renderOrderCard(lastOrder)}
        </>
      )}

      {activeOrders.length > 0 && (
        <>
          <h2 className="status-title mt-6">🚚 Активные заказы</h2>
          <span className="flex gap-4">
            {activeOrders.map(order => renderOrderCard(order))}
          </span>
        </>
      )}
    </div>
  );
};

export default Status;
