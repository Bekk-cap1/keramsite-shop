// src/pages/StoreDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const StoreDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        const prod = res.data.product;
        setProduct(prod);

        if (prod?.category) {
          const relatedRes = await axios.get(`/api/products?category=${prod.category}`);
          setRelated(
            (relatedRes.data.products || []).filter((p) => p._id !== prod._id)
          );
        }
      } catch (err) {
        console.error("Ошибка загрузки товара:", err);
      }
    };
    fetchProduct();
  }, [id]);

  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
    toast.success("🛒 Товар добавлен в корзину!");
  };

  if (!product) {
    return <p className="text-center py-10">Загрузка...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Основной блок товара */}
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-md p-6">
        {/* Фото товара */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-full max-w-md object-contain rounded-md"
          />
        </div>

        {/* Информация о товаре */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-brown">
              {product.name}
            </h2>
            <p className="text-gray-700">{product.category}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-xl sm:text-2xl font-bold mb-2 text-brown">
              {product.price.toLocaleString()} сум
            </p>
            <span className="flex justify-between">
              <p className="text-green-400">Stock: {product.stock}</p>
              <p className="text-red-400">Sales: {product.sales}</p>
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="px-6 py-3 rounded-md font-semibold transition bg-brown text-cream hover:opacity-90 text-white"
          >
            В корзину
          </button>
        </div>
      </div>

      {/* Похожие товары */}
      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-brown">
            Похожие товары
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:scale-105 transition-transform"
              >
                <Link to={`/store/${item._id}`}>
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-full h-40 object-contain mb-3"
                  />
                  <h4 className="text-lg font-semibold mb-1 text-brown">
                    {item.name}
                  </h4>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{item.shortDescription}</p>
                <p className="font-bold mb-3 text-brown">
                  {item.price.toLocaleString()} сум
                </p>
                <button
                  onClick={() => addToCart(item)}
                  className="px-4 py-2 rounded-md font-semibold transition bg-beige text-brown hover:opacity-90 bg-brown text-cream text-white"
                >
                  В корзину
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
