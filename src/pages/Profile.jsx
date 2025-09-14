import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useUserAuth();

  const [orders, setOrders] = useState([]);
  const [sortKey, setSortKey] = useState("date");
  const [showPassport, setShowPassport] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Для аккордеона

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Ошибка загрузки заказов:", err);
        toast.error("❌ Не удалось загрузить заказы");
      }
    };

    if (user) fetchOrders();
  }, [user, loading, navigate]);

  // Смена пароля
  const handleChangePassword = async () => {
    if (passwordData.newPass !== passwordData.confirm) {
      toast.error("❌ Пароли не совпадают!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "/api/users/password",
        {
          currentPassword: passwordData.current,
          newPassword: passwordData.newPass,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ " + res.data.message);
      setPasswordData({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      console.error("changePassword xatosi:", err);
      toast.error("❌ " + (err.response?.data?.message || err.message));
    }
  };

  const maskPassport = (passport) => {
    if (!passport) return "—";
    return showPassport
      ? passport
      : passport.slice(0, 2) + "*****" + passport.slice(-2);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortKey === "status") {
      return (a.status || "ожидает").localeCompare(b.status || "ожидает");
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        ⏳ Загрузка профиля...
      </div>
    );
  }
  console.log(orders);
  

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            👤 Личный кабинет
          </h2>
          <button
            onClick={logout}
            className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Выйти
          </button>
        </div>

        {/* Данные профиля */}
        {user && (
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Данные профиля
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <p>
                <strong>ФИО:</strong>{" "}
                {user.firstName + " " + user.lastName || "—"}
              </p>
              <p>
                <strong>Email:</strong> {user.email || "—"}
              </p>
              <p>
                <strong>Телефон:</strong> {user.phone || "—"}
              </p>
              <p>
                <strong>Паспорт:</strong> {maskPassport(user.passport)}
                <button
                  onClick={() => setShowPassport(!showPassport)}
                  className="ml-2 text-blue-500 underline"
                >
                  {showPassport ? "Скрыть" : "Показать"}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Изменение пароля */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Изменение пароля
          </h3>
          <input
            type="password"
            placeholder="Текущий пароль"
            value={passwordData.current}
            onChange={(e) =>
              setPasswordData({ ...passwordData, current: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Новый пароль"
            value={passwordData.newPass}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPass: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={passwordData.confirm}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirm: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
          <button
            onClick={handleChangePassword}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Сменить пароль
          </button>
        </div>

        {/* История заказов */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              История заказов
            </h3>
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="date">По дате</option>
              <option value="status">По статусу</option>
            </select>
          </div>

          {sortedOrders.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">Нет заказов.</p>
          ) : (
            <ul className="space-y-4">
              {sortedOrders.map((order) => (
                <li
                  key={order._id}
                  className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
                >
                  {/* Верхняя часть заказа */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order._id ? null : order._id
                      )
                    }
                  >
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        📅 {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-lg font-semibold text-gray-800 mb-1">
                        🆔 {order.orderNumber} — {order.items.length} товаров —{" "}
                        {order.total} сум
                      </p>
                      <p className="text-sm text-gray-700">
                        📌 Доставка:{" "}
                        {order.deliveryMethod === "pickup"
                          ? "Самовывоз"
                          : `${order.deliveryMethod} (${
                              order.deliveryVehicle || "-"
                            })`}
                      </p>
                    </div>
                    <span className="text-blue-500">
                      {expandedOrderId === order._id ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Детали заказа */}
                  {expandedOrderId === order._id && (
                    <div className="mt-3 border-t pt-3 space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.product._id}
                          className="flex justify-between text-gray-700 text-sm"
                        >
                          <span>{item.product.name}</span>
                          <span>
                            {item.quantity} × {item.price} сум
                          </span>
                        </div>
                      ))}
                      <p className="text-gray-700 text-sm mt-2">
                        <strong>Адрес доставки:</strong>{" "}
                        {order.deliveryAddress?.address || "—"}
                      </p>
                      {order.notes && (
                        <p className="text-gray-700 text-sm">
                          <strong>Примечания:</strong> {order.notes}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
