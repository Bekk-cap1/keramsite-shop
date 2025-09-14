import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "../components/Modal";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useUserAuth();

  const [orders, setOrders] = useState([]);
  const [sortKey, setSortKey] = useState("date");
  const [showPassport, setShowPassport] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [verificationMethod, setVerificationMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [authToken, setAuthToken] = useState();
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if(!user.isPhoneVerified && !user.isEmailVerified){
      setAuthToken(localStorage.getItem("token"));
    }
  }, []);

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

    if (user) {
      fetchOrders();
      if (!user.isEmailVerified || !user.isPhoneVerified) {
        setShowModal(true);
      }
    }
  }, [user, loading, navigate]);

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

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/auth/verify-email",
        {
          code: verificationCode,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        window.location.reload()
        setVerificationCode("");
        // Обновление состояния пользователя для отображения галочки
        // Это простой способ, но лучше было бы сделать re-fetch данных пользователя
        // user.isEmailVerified = true;
        // console.log(user)
      } else {
        toast.error(response.data.error || "Tasdiqlashda xatolik yuz berdi.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Tasdiqlash kodi noto'g'ri yoki eskirgan.";
      toast.error(errorMessage);
    }
  };

  const handlePhoneVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-phone",
        {
          code: verificationCode,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        setVerificationCode("");
        window.location.reload()
        // Обновление состояния пользователя
        // user.isPhoneVerified = true;
      } else {
        toast.error(response.data.error || "Tasdiqlashda xatolik yuz berdi.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Tasdiqlash kodi noto'g'ri yoki eskirgan.";
      toast.error(errorMessage);
    }
  };

  const handleSelectEmail = () => {
    setVerificationMethod("email");
    resendEmailCode();
  };

  const handleSelectPhone = () => {
    setVerificationMethod("phone");
    resendPhoneCode();
  };

  const resendEmailCode = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/resend-email-code",
        {}, // Пустое тело запроса, email берется из токена
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (res.data.success) {
        toast.success("✅ Код повторно отправлен на почту!");
      } else {
        toast.error(res.data.error || "❌ Ошибка при отправке кода на почту");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Не удалось отправить код");
    }
  };

  const resendPhoneCode = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/resend-phone-code",
        {}, // Пустое тело запроса, phone берется из токена
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (res.data.success) {
        toast.success("✅ Код повторно отправлен на телефон!");
      } else {
        toast.error(res.data.error || "❌ Ошибка при отправке кода на телефон");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Не удалось отправить код");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        ⏳ Загрузка профиля...
      </div>
    );
  }

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
                <strong>ФИО:</strong> {user.firstName + " " + user.lastName || "—"}
              </p>
              <div className="flex items-center space-x-2">
                <strong>Email:</strong> {user.email || "—"}
                {user.isEmailVerified ? (
                  <span className="text-green-500">✅</span>
                ) : (
                  <button
                    onClick={() => {
                      setShowModal(true);
                    }}
                    className="ml-2 text-blue-500 underline"
                  >
                    Подтвердить
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <strong>Телефон:</strong> {user.phone || "—"}
                {user.isPhoneVerified ? (
                  <span className="text-green-500">✅</span>
                ) : (
                  <button
                    onClick={() => {
                      setShowModal(true);
                    }}
                    className="ml-2 text-blue-500 underline"
                  >
                    Подтвердить
                  </button>
                )}
              </div>
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
                          : `${order.deliveryMethod} (${order.deliveryVehicle || "-"
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

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <div className="flex flex-col items-center p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800">
                Tasdiqlash usulini tanlang
              </h3>
              {verificationMethod === "phone" ? (
                <form
                  onSubmit={handlePhoneVerification}
                  className="w-full flex flex-col items-center space-y-4"
                >
                  <p className="text-gray-600 text-center">
                    Telefon raqamingizga yuborilgan kodni kiriting.
                  </p>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Tasdiqlash kodi"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                  >
                    Tasdiqlash
                  </button>
                  <button
                    type="button"
                    onClick={resendPhoneCode}
                    className="text-sm text-blue-500 underline mt-2"
                  >
                    Kodni qayta yuborish
                  </button>
                </form>
              ) : verificationMethod === "email" ? (
                <form
                  onSubmit={handleEmailVerification}
                  className="w-full flex flex-col items-center space-y-4"
                >
                  <p className="text-gray-600 text-center">
                    Emailingizga yuborilgan kodni kiriting.
                  </p>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Tasdiqlash kodi"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  >
                    Tasdiqlash
                  </button>
                  <button
                    type="button"
                    onClick={resendEmailCode}
                    className="text-sm text-blue-500 underline mt-2"
                  >
                    Kodni qayta yuborish
                  </button>
                </form>
              ) : (
                <>
                  <p className="text-gray-600 text-center">
                    Ro‘yxatdan o‘tishni yakunlash uchun, iltimos, tanlangan usul
                    orqali tasdiqlang.
                  </p>
                  <div className="w-full space-y-2">
                      <button
                        onClick={handleSelectEmail} 
                        className={`w-full  text-white py-2 rounded-md ${user.isEmailVerified ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"}`}
                        disabled={user?.isEmailVerified}
                      >
                        Email orqali tasdiqlash
                      </button>
                      <button
                        onClick={handleSelectPhone}
                        className={`w-full  text-white py-2 rounded-md  ${user.isPhoneVerified ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
                        disabled={user?.isPhoneVerified}
                      >
                        Telefon orqali tasdiqlash
                      </button>
                  </div>
                </>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Profile;