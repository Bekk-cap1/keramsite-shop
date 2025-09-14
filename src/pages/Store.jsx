import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../CartContext"; // <-- импортируем контекст
import axios from "axios";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { cart, addToCart } = useCart(); // <-- используем контекст

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Ошибка загрузки продуктов:", err);
      }
    };
    fetchProducts();
  }, []);

  // Фильтрация
  const filteredProducts = products
    .filter((p) => (filter === "all" ? true : p.category === filter))
    .filter((p) =>
      search
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((p) => (minPrice ? p.price >= parseFloat(minPrice) : true))
    .filter((p) => (maxPrice ? p.price <= parseFloat(maxPrice) : true));

  // Сортировка
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "views":
        return b.views - a.views;
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2
        className="text-center text-2xl sm:text-3xl font-bold mb-6"
        style={{ color: "var(--brown)" }}
      >
        🏬 Магазин
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Боковая панель */}
        <aside className="space-y-6 p-4 rounded-lg shadow-md" style={{ backgroundColor: "var(--white)" }}>
          {/* Поиск */}
          <input
            type="text"
            placeholder="🔍 Поиск товара..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded-md border"
            style={{ borderColor: "var(--brown)", color: "var(--brown)" }}
          />

          {/* Категории */}
          <div>
            <h3 className="font-bold mb-2" style={{ color: "var(--brown)" }}>Категории</h3>
            <div className="flex flex-col gap-2">
              {[
                { key: "all", label: "Все" },
                { key: "sheben", label: "Щебень" },
                { key: "qum", label: "Песок" },
                { key: "sement", label: "Цемент" },
                { key: "g'isht", label: "Кирпич" },
                { key: "beton", label: "Бетон" },
                { key: "boshqa", label: "Другое" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className="px-3 py-2 rounded-lg text-left font-medium transition-colors"
                  style={{
                    backgroundColor: filter === key ? "var(--brown)" : "var(--beige)",
                    color: filter === key ? "var(--cream)" : "var(--brown)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Цена */}
          <div>
            <h3 className="font-bold mb-2" style={{ color: "var(--brown)" }}>Цена</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Мин"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="p-2 rounded-md border w-20"
                style={{ borderColor: "var(--brown)", color: "var(--brown)" }}
              />
              <input
                type="number"
                placeholder="Макс"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-2 rounded-md border w-20"
                style={{ borderColor: "var(--brown)", color: "var(--brown)" }}
              />
            </div>
          </div>

          {/* Сортировка */}
          <div>
            <h3 className="font-bold mb-2" style={{ color: "var(--brown)" }}>Сортировка</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-2 rounded-md border w-full"
              style={{ borderColor: "var(--brown)", color: "var(--brown)" }}
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="views">Популярность</option>
              <option value="newest">Новинки</option>
            </select>
          </div>

          {/* Сброс */}
          <button
            onClick={() => {
              setFilter("all");
              setSearch("");
              setSort("default");
              setMinPrice("");
              setMaxPrice("");
            }}
            className="px-4 py-2 rounded-md font-bold w-full"
            style={{ backgroundColor: "var(--beige)", color: "var(--brown)" }}
          >
            Сбросить фильтры
          </button>
        </aside>

        {/* Список товаров */}
        <main className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((item) => (
              <div
                key={item._id}
                className="flex flex-col justify-between rounded-lg shadow-md p-4 transition-transform hover:scale-105"
                style={{ backgroundColor: "var(--white)" }}
              >
                <Link to={`/store/${item._id}`} className="cursor-pointer">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-full h-44 sm:h-52 object-contain mb-4"
                  />
                  <h3 className="text-lg sm:text-xl font-bold mb-1" style={{ color: "var(--brown)" }}>
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{item.shortDescription || ""}</p>
                <p className="text-lg font-bold mb-4" style={{ color: "var(--brown)" }}>
                  {item.price.toLocaleString()} сум
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  {/* 🔹 Добавление в корзину через контекст */}
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 rounded-md font-semibold w-full sm:w-auto cursor-pointer"
                    style={{ backgroundColor: "var(--beige)", color: "var(--brown)"}}
                  >
                    В корзину
                  </button>

                  <Link
                    to={`/store/${item._id}`}
                    className="px-4 py-2 rounded-md font-semibold text-center w-full sm:w-auto"
                    style={{ backgroundColor: "var(--brown)", color: "var(--cream)" }}
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Store;
