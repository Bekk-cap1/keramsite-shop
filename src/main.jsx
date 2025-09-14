import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./CartContext.jsx"; // 👈 добавили импорт

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider> {/* 👈 обернули в провайдер */}
    <App />
  </CartProvider>
);
