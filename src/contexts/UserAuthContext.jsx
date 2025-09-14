// contexts/UserAuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";

const UserAuthContext = createContext();

export const useUserAuth = () => useContext(UserAuthContext);

// Axios asosiy URL'sini sozlash
axios.defaults.baseURL = "http://localhost:5000"; // Backend manzili
axios.defaults.withCredentials = true; // Cookie'lar bilan ishlash uchun

// Axios so'rovlariga tokenni avtomatik qo'shish uchun interceptor
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Header'ga tokenni qo'shish
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Foydalanuvchi ma'lumotlarini olish (doimiy chaqirilishi mumkin)
    const fetchUser = useCallback(async () => {
        try {
            const res = await axios.get("/api/users/me"); // Foydalanuvchi ma'lumotlari endpoint'i
            setUser(res.data.user);
            return res.data.user; // Ma'lumotni qaytarish
        } catch (err) {
            console.error(
                "Foydalanuvchi ma'lumotlarini olishda xato:",
                err.response?.data?.error || err.message
            );
            setUser(null); // Xatolik yuz berganda foydalanuvchini null qilish
            localStorage.removeItem("token"); // Tokenni ham olib tashlash
            return null;
        } finally {
            setLoading(false); // Yuklanishni tugatish
        }
    }, []);

    // Komponent birinchi marta yuklanganda tokenni tekshirish
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUser(); // Agar token bo'lsa, foydalanuvchi ma'lumotlarini yuklash
        } else {
            setLoading(false); // Token bo'lmasa, yuklanish tugagan deb hisoblash
        }
    }, [fetchUser]); // fetchUser o'zgarganda qayta ishga tushadi (callback bilan)

    // Kirish (Login) funksiyasi
    const login = async (credentials) => {
        setLoading(true); // Kirish jarayonida yuklanishni ko'rsatish
        try {
            // Backenddagi login-with-passport endpoint'iga murojaat qilish
            const res = await axios.post("/api/auth/login-with-passport", credentials);

            // Serverdan kelgan tokenni localStorage ga saqlash
            localStorage.setItem("token", res.data.token);

            // Foydalanuvchi ma'lumotlarini yangilash
            await fetchUser();

            return true; // Muvaffaqiyatli kirish
        } catch (err) {
            console.error(
                "Kirish xatosi:",
                err.response?.data?.error || err.message
            );
            // Agar xatolik bo'lsa, tokenni tozalash
            localStorage.removeItem("token");
            setUser(null);
            return false; // Kirish muvaffaqiyatsiz
        } finally {
            setLoading(false); // Yuklanishni tugatish
        }
    };

    // Ro'yxatdan o'tish (Register) funksiyasi
    const register = async (formData) => {
        setLoading(true);
        try {
            // Backenddagi register-with-passport endpoint'iga murojaat qilish
            const res = await axios.post("/api/auth/register-with-passport", formData);

            // Ro'yxatdan o'tgandan so'ng tokenni saqlash va foydalanuvchini yuklash
            localStorage.setItem("token", res.data.token);
            await fetchUser(); // Yangi ro'yxatdan o'tgan foydalanuvchini yuklash

            return true; // Muvaffaqiyatli ro'yxatdan o'tish
        } catch (err) {
            console.error(
                "Ro'yxatdan o'tish xatosi:",
                err.response?.data?.error || err.message
            );
            return false; // Ro'yxatdan o'tish muvaffaqiyatsiz
        } finally {
            setLoading(false);
        }
    };

    // Chiqish (Logout) funksiyasi
    const logout = async () => {
        setLoading(true);
        try {
            // Tokenni localStorage dan o'chirish
            localStorage.removeItem("token");
            setUser(null); // Foydalanuvchi holatini null qilish

            // Agar serverda ham logout endpointi bo'lsa, uni chaqirish
            // await axios.post("/api/auth/logout"); // Endpoint mavjud bo'lsa
        } catch (err) {
            console.error(
                "Chiqish xatosi:",
                err.response?.data?.error || err.message
            );
        } finally {
            setLoading(false);
        }
    };

    // Kontekst qiymatlari
    return (
        <UserAuthContext.Provider value={{ user, loading, login, register, logout, fetchUser }}>
            {children}
        </UserAuthContext.Provider>
    );
};