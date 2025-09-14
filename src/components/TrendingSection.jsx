import React from 'react';
import '../style/TrendingSection.css';
import vaseImg from '../img/1.jpg'; // Rasmni img papkasidan import qilish
import mugImg from '../img/2.jpg'; // Misol uchun boshqa rasm
import bowlImg from '../img/4.png'; // Misol uchun boshqa rasm
import cutleryImg from '../img/4.png'; // Agar boshqa rasm bo'lsa, uni almashtiring
import { useNavigate } from 'react-router-dom';

const TrendingSection = () => {
 const navigate = useNavigate();

  const trendingProducts = [
    { id: 1, name: "Кленис 10т", price: 500000, type: "кленис", volume: 10 },
    { id: 2, name: "Щебень 5т", price: 300000, type: "щебень", volume: 5 },
    { id: 3, name: "Кленис 2т", price: 150000, type: "кленис", volume: 2 },
  ];


  const handleViewAll = () => {
    navigate("/store");
  };

  return (
<div className="home-container">
      <h1 className="home-title">Добро пожаловать в Keramsite Shop!</h1>
      <p className="home-subtitle">Лучшие материалы для вашего строительства.</p>

      {/* Trending Section */}
      <section className="trending-section">
        <h2 className="trending-title">🔥 Тренды</h2>
        <div className="trending-cards">
          {trendingProducts.map((item) => (
            <div key={item.id} className="trending-card">
              <h3 className="trending-card-name">{item.name}</h3>
              <p className="trending-card-details">Тип: {item.type}</p>
              <p className="trending-card-details">Объём: {item.volume} тонн</p>
              <p className="trending-card-price">{item.price.toLocaleString()} сум</p>
              <button className="trending-card-button">В корзину</button>
            </div>
          ))}
        </div>
        <button onClick={handleViewAll} className="trending-view-all-button">
          Хаммасини кўриш
        </button>
      </section>
    </div>
  );
};

export default TrendingSection;