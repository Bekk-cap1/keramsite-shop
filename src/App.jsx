// pages/App.jsx
import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Order from "./pages/Order";
import Status from "./pages/Status";
import Store from "./pages/Store";
import StoreDetail from "./pages/StoreDetail";
import Cart from "./pages/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyPhoto from "./pages/VerifyPhoto"; // Agar bu sahifa alohida bo'lsa
import NotFound from "./pages/NotFoundPage";

// `useUserAuth` va `UserAuthProvider` ni import qiling
import { UserAuthProvider, useUserAuth } from "./contexts/UserAuthContext";
import OrderHistory from "./pages/OrderHistory";

// Himoyalangan yo'nalish komponenti
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUserAuth(); // Kontekstdan user va loading ni olish
    const token = localStorage.getItem("token")
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Yuklanmoqda...</div>; // Yuklanish holatini ko'rsatish
    }

    // Agar foydalanuvchi mavjud bo'lmasa va yuklanish tugagan bo'lsa, login sahifasiga yo'naltirish
    if (!user || !token) {
        return <Navigate to="/login" replace />; // replace: history listiga qo'shmasdan almashtiradi
    }

    // Agar foydalanuvchi mavjud bo'lsa, bolalarni render qilish
    return children;
};

const AppContent = () => {
    const [showCookiePopup, setShowCookiePopup] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem("cookiesAccepted");
        if (!cookiesAccepted) {
            setShowCookiePopup(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem("cookiesAccepted", "true");
        setShowCookiePopup(false);
    };

    return (
        <div className="min-h-screen bg-accent flex flex-col">
            <Navbar />
            <main className="flex-grow"> {/* Kontentni markazga joylashtirish */}
                {showCookiePopup && (
                    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center justify-between z-50">
                        <p className="text-sm">
                            Biz sizning tajribangizni yaxshilash uchun cookie-fayllardan foydalanamiz.
                        </p>
                        <button
                            onClick={handleAcceptCookies}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Barchasini qabul qilish
                        </button>
                    </div>
                )}
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* VerifyPhoto sahifasi ham ProtectedRoute ichida bo'lishi kerakmi, yoki yo'qmi, aniqlashtiring */}
                    <Route path="/verify-photo/:passport" element={<VerifyPhoto />} />

                    {/* Himoyalangan sahifalar */}
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
                    <Route path="/status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
                    <Route path="/store" element={<Store />} /> {/* Agar store hamma uchun ochiq bo'lsa */}
                    <Route path="/store/:id" element={<StoreDetail />} /> {/* Agar store hamma uchun ochiq bo'lsa */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/order/history" element={<ProtectedRoute><OrderHistory/></ProtectedRoute>} />
                    {/* Agar 404 sahifasi bo'lsa */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} /> {/* Toast bildirishnomalari */}
        </div>
    );
};

// Asosiy App komponenti UserAuthProvider bilan o'raladi
function App() {
    return (
        <Router>
            <UserAuthProvider>
                <AppContent />
            </UserAuthProvider>
        </Router>
    );
}

export default App;