import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../style/Footer.css";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-brown text-beige py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 footer-logo">
            <i className="fas fa-bricks text-xl"></i>
            <Link to="/" className="text-xl font-bold hover:text-cream transition-colors duration-300">
              Keramsite Shop
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4 footer-links">
            <Link to="/store" className="hover:text-cream transition-all duration-300">
              Магазин
            </Link>
            <Link to="/order" className="hover:text-cream transition-all duration-300">
              Заказ
            </Link>
            <Link to="/contact" className="hover:text-cream transition-all duration-300">
              Контакты
            </Link>
          </div>
        </div>
        <p className="mt-4 footer-text">© 2025 Keramsite Shop. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;