import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../style/Status.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Ошибка загрузки истории заказов:', err);
        toast.error('Не удалось загрузить историю заказов');
      }
    };

    fetchOrders();
  }, []);


  if (orders.length === 0) {
    return <p className="status-no-data">Нет информации о истории заказов.</p>;
  }

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };


  return (
    <div className="status-container">
      <h2 className="status-title">📜 История заказов</h2>
      <div className='flex gap-4 w-full flex-col'>
      {orders.map((order) => (
        <div key={order._id} className="status-card">
          <div className="status-info">
            <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Статус:</strong> {order.status}</p>
            <p><strong>Сумма:</strong> {order.total.toLocaleString()} сум</p>
            <button onClick={() => toggleExpand(order._id)} className="order-expand-button">
              {expandedOrderId === order._id ? 'Скрыть детали' : 'Показать детали'}
            </button>

            {expandedOrderId === order._id && (
              <div className="order-details">
                <h4>Товары в заказе:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.product._id}>
                      {item.product.name} — {item.quantity} шт — {item.total.toLocaleString()} сум
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default OrderHistory;
