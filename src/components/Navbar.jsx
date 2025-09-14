import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/Navbar.css";
import { useCart } from "../CartContext"; // <-- импортируем контекст

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navRef = useRef(null);
  const orderGroupRef = useRef(null);
  const cartContainerRef = useRef(null);

  const { cart, removeFromCart, clearCart } = useCart(); // <-- используем контекст

  // Проверка авторизации
  const checkAuth = () => setIsAuthenticated(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    checkAuth();
    const handleStorageChange = (e) => {
      if (e.key === "token") checkAuth();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Выход
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Вы вышли из аккаунта");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Тоггл меню
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsOrderDropdownOpen(false);
    setIsCartDropdownOpen(false);
  };

  // Клик вне меню
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target) && window.innerWidth <= 640) setIsOpen(false);
      if (orderGroupRef.current && !orderGroupRef.current.contains(e.target)) setIsOrderDropdownOpen(false);
      if (cartContainerRef.current && !cartContainerRef.current.contains(e.target)) setIsCartDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setIsOpen(true);
        setIsOrderDropdownOpen(false);
        setIsCartDropdownOpen(false);
      } else setIsOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Поиск
  const handleSearch = (e) => setSearchQuery(e.target.value);

  // Сумма корзины
  const totalCartPrice = useMemo(
    () => cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0),
    [cart]
  );

  // Checkout
  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate("/order");
    } else toast.error("Корзина пуста!");
  };

  // 📱 Закрыть мобильное меню
  const closeMobileMenu = () => {
    if (window.innerWidth <= 640) {
      setIsOpen(false);
      setIsOrderDropdownOpen(false);
      setIsCartDropdownOpen(false);
    }
  };

  // 📦 Открытие дропдауна заказов
  const handleOrderLinkClick = (e) => {
    if (window.innerWidth <= 640) {
      e.preventDefault();
      setIsOrderDropdownOpen((prev) => !prev);
      setIsCartDropdownOpen(false);
    }
  };

  // ❌ Закрытие корзины при уходе мыши
  const handleCartMouseLeave = () => {
    if (window.innerWidth > 640) setIsCartDropdownOpen(false);
  };

  const handleCartButtonClick = (e) => {
    if (window.innerWidth <= 640) {
      e.preventDefault();
      setIsCartDropdownOpen((prev) => !prev);
      setIsOrderDropdownOpen(false);
    } else {
      setIsCartDropdownOpen(true);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="brand-link" onClick={closeMobileMenu}>
          <i className="fas fa-bricks"></i> Keramsite Shop
        </Link>

        <div className="burger-menu-toggle">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>

        <nav ref={navRef} className={`main-nav ${isOpen ? "nav-active" : ""}`}>
          <div className="nav-group">
            <Link to="/store" className="nav-link" onClick={closeMobileMenu}>
              <i className="fas fa-store"></i> Магазин
            </Link>
          </div>

          <div className="nav-group" ref={orderGroupRef}>
            <Link to="/order" onClick={handleOrderLinkClick} className="nav-link">
              <i className="fas fa-box"></i> Заказ
            </Link>
            <div className={`dropdown ${isOrderDropdownOpen && window.innerWidth <= 640 ? "active" : ""}`}>
              <Link to="/order" className="dropdown-link" onClick={closeMobileMenu}>Заказать</Link>
              <Link to="/status" className="dropdown-link" onClick={closeMobileMenu}>Активные заказы</Link>
              <Link to="/order/history" className="dropdown-link" onClick={closeMobileMenu}>История заказов</Link>
            </div>
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-user"></i> Профиль
              </Link>
              <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="nav-button">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-sign-in-alt"></i> Вход
              </Link>
              <Link to="/register" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-user-plus"></i> Регистрация
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div
              className="relative"
              ref={cartContainerRef}
              onMouseEnter={() => window.innerWidth > 640 && setIsCartDropdownOpen(true)}
              onMouseLeave={handleCartMouseLeave}
            >
              <button
                className="flex items-center mt-2 gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition"
                onClick={handleCartButtonClick}
              >
                <i className="fas fa-shopping-cart"></i> Корзина ({cart.length})
              </button>

              {cart?.length > 0 && (
                <div className={`pt-2 ${isCartDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                  <div className={`absolute right-0 pt-4 w-72 bg-white shadow-lg rounded-lg p-4 z-50 transition-all ${isCartDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                    <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <li key={item._id} className="flex justify-between p-2 rounded-2xl shadow-sm my-2 items-center">
                          <div>
                            <span className="text-gray-700">{item.name} — {item.price.toLocaleString()} сум</span>
                            <div className="flex items-center gap-1">
                              <span className="text-green-400">Количество: {item.quantity}</span>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item._id)} className="text-red-500 font-bold ml-2 px-2 py-1 cursor-pointer border border-red-500 border-solid rounded-full">✕</button>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 font-semibold text-gray-800">💰 Сумма: {totalCartPrice.toLocaleString()} сум</p>
                    <div className="mt-2 flex flex-col gap-2">
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" onClick={handleCheckout}>Перейти к оформлению</button>
                      <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg" onClick={() => { navigate("/cart"); closeMobileMenu(); }}>Подробнее</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
