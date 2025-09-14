import React, { useEffect, useState } from "react";
import "../style/Account.css"; // CSS faylini import qildik

const Account = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(stored);
  }, []);

  return (
    <div className="account-container">
      <h2 className="account-title">📋 История заказов</h2>

      {orders.length === 0 ? (
        <p className="account-no-orders">У вас пока нет заказов.</p>
      ) : (
        <div className="account-orders-container">
          {orders.map((order, index) => (
            <div
              key={index}
              className="account-order-card"
            >
              <div className="account-order-detail"><strong>ФИО:</strong> {order.fullName}</div>
              <div className="account-order-detail"><strong>Телефон:</strong> {order.phone}</div>
              <div className="account-order-detail"><strong>Тип:</strong> {order.type === "delivery" ? "Доставка" : "Самовывоз"}</div>
              {order.address && <div className="account-order-detail"><strong>Адрес:</strong> {order.address}</div>}
              <div className="account-order-detail"><strong>Машина:</strong> {order.car}</div>
              <div className="account-order-detail">
                <strong>Статус:</strong>{" "}
                <span
                  className={`account-order-status ${
                    order.status === "оплачен"
                      ? "account-status-paid"
                      : order.status === "ожидание оплаты"
                      ? "account-status-pending"
                      : "account-status-unknown"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Account;