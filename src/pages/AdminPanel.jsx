import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [orders, setOrders] = useState([]);

  // Псевдо-пароль администратора
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    if (isLoggedIn) {
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(savedOrders);
    }
  }, [isLoggedIn]);

  const handleDelete = (index) => {
    const updated = [...orders];
    updated.splice(index, 1);
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const updateStatus = (index, newStatus) => {
    const updated = [...orders];
    updated[index].status = newStatus;
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert("Неверный пароль");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">🔐 Вход в админку</h2>
        <form onSubmit={handleLogin} className="space-y-2">
          <input
            type="password"
            placeholder="Введите пароль"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Заказы</h2>
      {orders.length === 0 ? (
        <p>Нет заказов.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="border p-4 rounded shadow bg-white">
              <p><strong>Имя:</strong> {order.name}</p>
              <p><strong>Телефон:</strong> {order.phone}</p>
              <p><strong>Машина:</strong> {order.machineType}</p>
              <p><strong>Адрес:</strong> {order.address}</p>
              <p><strong>Тип:</strong> {order.deliveryType}</p>
              <p><strong>Дата:</strong> {order.date}</p>
              <p><strong>Статус:</strong> {order.status || "ожидает"}</p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => updateStatus(index, "готов")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Готов
                </button>
                <button
                  onClick={() => updateStatus(index, "доставлен")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Доставлен
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
