// pages/Login.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserAuth } from '../contexts/UserAuthContext'; // UserAuthContext'dan foydalanish
import '../style/Login.css';
import VerifyModal from '../components/VerfiyModal'; // Agar kerak bo'lsa

const Login = () => {
    const [formData, setFormData] = useState({
        passport: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user } = useUserAuth(); // login va user ni kontekstdan olish
    const [isModalOpen, setIsModalOpen] = useState(false); // Tasdiqlash oynasi

    // Agar foydalanuvchi allaqachon kirgan bo'lsa, uy sahifasiga yo'naltirish
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Xatolarni tozalash

        // `useUserAuth` dagi login funksiyasini chaqirish
        console.log(formData);

        const success = await login(formData); // FormData ni direkt o'tkazish

        if (success) {
            toast.success('Muvaffaqiyatli kirdingiz!');
            navigate('/'); // Asosiy sahifaga yo'naltirish
            window.location.reload()
        } else {
            // Backenddan kelgan xatolikni ko'rsatish (agar contextda to'g'ri ishlov berilsa)
            setError('Noto\'g\'ri pasport yoki parol.'); // Umumiy xabar
            toast.error('Noto\'g\'ri pasport yoki parol.');

            // Agar backend maxsus xatolik qaytarsa (masalan, tasdiqlanmaganlik)
            // if (err.response?.status === 403 && err.response.data.error === 'Passport surat bilan tasdiqlanmagan') {
            // 	setIsModalOpen(true);
            // }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2 className="login-title">Kirish (Pasport bilan)</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        name="passport"
                        value={formData.passport}
                        onChange={handleChange}
                        placeholder="Pasport seriyasi va raqami"
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Parol"
                        required
                        className="login-input"
                    />
                    <button
                        type="submit"
                        className="login-button"
                    >
                        Kirish
                    </button>
                </form>
                {/* {message && <p className="success-message">{message}</p>} */}
                {error && <p className="error-message">{error}</p>}
                <p className="login-link">
                    Akkauntingiz yo‘qmi? <a href="/register">Ro‘yxatdan o‘tish</a>
                </p>
            </div>

            {/* VerifyModal komponentini chaqirish */}
            <VerifyModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                passportNumber={formData.passport}
            />
        </div>
    );
};

export default Login;