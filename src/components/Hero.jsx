import React from "react";
import "../style/Hero.css"

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h3 className="hero-subtitle">KRAMIC POTTERY</h3>
          <h1 className="hero-title">TIMBER NIGHTFALL</h1>
          <h2 className="hero-subtitle">VASE ART CERAMIC</h2>
          <div className="hero-line"></div>
          <p className="hero-description">Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="hero-social">
          <a href="#" className="hero-social-icon"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="hero-social-icon"><i className="fab fa-twitter"></i></a>
          <a href="#" className="hero-social-icon"><i className="fab fa-pinterest"></i></a>
        </div>
      </div>
    </section>
  );
};

export default Hero;