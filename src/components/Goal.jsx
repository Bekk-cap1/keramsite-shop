import React from 'react';
import CountUp from 'react-countup';
import '../style/Goal.css';

const Goal = () => {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stat-item">
          <CountUp end={1200} duration={3.5} className="count-up" />
          <span className="stat-label">YEARS EXPERIENCE</span>
        </div>
        <div className="stat-item">
          <CountUp end={500} duration={3.5} className="count-up" />
          <span className="stat-label">HAPPY CLIENTS</span>
        </div>
        <div className="stat-item">
          <CountUp end={500000} duration={3.5} className="count-up" />
          <span className="stat-label">WEB AWARDS</span>
        </div>
        <div className="stat-item">
          <CountUp end={10000} duration={3.5} className="count-up" />
          <span className="stat-label">PRODUCTS SOLD</span>
        </div>
        <div className="stat-item">
          <CountUp end={10500000} duration={3.5} className="count-up" />
          <span className="stat-label">PROJECTS</span>
        </div>
        <div className="stat-item">
          <CountUp end={900} duration={3.5} className="count-up" />
          <span className="stat-label">GIFT COLLECTIONS</span>
        </div>
      </div>
    </section>
  );
};

export default Goal;