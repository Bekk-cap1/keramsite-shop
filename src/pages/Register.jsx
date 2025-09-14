import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../style/Register.css';
import Modal from '../components/Modal';

const Register = () => {
    const [formData, setFormData] = useState({
        passport: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        passportImage: null,
    });
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [authToken, setAuthToken] = useState(null); // Bu login tokeni bo'lishi mumkin
    const [userEmailVerificationToken, setUserEmailVerificationToken] = useState(null); // Email tasdiqlash uchun token
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError('');
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, passportImage: e.target.files[0] });
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.passport) {
            setError("Iltimos, barcha maydonlarni to'ldiring.");
            return false;
        }

        const passportRegex = /^[A-Z]{2}\d{7}$/;
        if (!passportRegex.test(formData.passport)) {
            setError("Pasport seriyasi va raqami noto'g'ri formatda. Misol: AB1234567.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Noto'g'ri email formati.");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Parol kamida 6 belgidan iborat bo'lishi kerak.");
            return false;
        }

        if (!formData.passportImage) {
            setError("Pasport surati yuklanmagan!");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (!validateForm()) {
            toast.error(error);
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            // Passport image dan boshqa hamma fieldlarni append qilamiz
            if (key !== 'passportImage') {
                data.append(key, formData[key]);
            }
        }
        data.append('passportImage', formData.passportImage); // Passport rasmini alohida qo'shamiz

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register-with-passport', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(response.data.message);
            setAuthToken(response.data.token); // Bu login tokeni
            // Agar backend email tasdiqlash uchun alohida token qaytarsa, uni ham saqlash kerak
            // Masalan: setUserEmailVerificationToken(response.data.emailVerificationToken);
            // Hozircha, sizning backend kodingiz register funksiyasida emailVerificationToken ni yaratib,
            // uni user obyekti ichida saqlaydi. Agar response.data.user.emailVerificationToken qaytsa,
            // uni shu yerda olish kerak. Agar qaytmasa, uni olishning yo'lini topish kerak.
            // Oddiyroq yo'l: backendni o'zgartirib, har doim emailVerificationToken ni qaytarish.
            // Agar hozirgi holatda register funksiyasi faqat login tokenini qaytarsa,
            // unda emailni tasdiqlash uchun alohida request kerak bo'ladi.
            // Endi modalni ochamiz va tasdiqlash usulini tanlashni so'raymiz.
            setLoading(false)
            // setShowModal(true);
            setFormData({
                passport: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                passportImage: null,
            })
        } catch (err) {
            setError(err.response?.data?.error || 'Server xatosi ro‘y berdi');
            toast.error(err.response?.data?.error || 'Server xatosi ro‘y berdi');
            setLoading(false)
        }
    };

    // *** Emailni tasdiqlash funksiyasi ***
    // Bu funksiya endi POST metodini ishlatadi va kodni yuboradi
    const handleEmailVerification = async (e) => {
        e.preventDefault();
        try {
            // Backendga yuborilayotgan ma'lumotlar: { code: verificationCode }
            // Va Authorization header orqali login tokeni
            const response = await axios.post('http://localhost:5000/api/auth/verify-email', { // Endpointni o'zgartirdik
                code: verificationCode,
                email: formData.email,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Userning login tokeni
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setShowModal(false);
                navigate('/login'); // Tasdiqlashdan keyin login sahifasiga o'tkazish
            } else {
                setError(response.data.error || 'Tasdiqlashda xatolik yuz berdi.');
                toast.error(response.data.error || 'Tasdiqlashda xatolik yuz berdi.');
            }
        } catch (err) {
            // Xatolikni serverdan olish yoki umumiy xabar ko'rsatish
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Tasdiqlash kodi noto\'g\'ri yoki eskirgan.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    // *** Telefonni tasdiqlash funksiyasi ***
    const handlePhoneVerification = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-phone', {
                code: verificationCode, // Backendga kodni yuborish
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Userning login tokeni
                },
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setShowModal(false);
                navigate('/login'); // Tasdiqlashdan keyin login sahifasiga o'tkazish
            } else {
                setError(response.data.error || 'Tasdiqlashda xatolik yuz berdi.');
                toast.error(response.data.error || 'Tasdiqlashda xatolik yuz berdi.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Tasdiqlash kodi noto\'g\'ri yoki eskirgan.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    // Emailni tasdiqlash usulini tanlash
    const handleSelectEmail = () => {
        setVerificationMethod('email');
        // Bu yerda backendga murojaat qilinishi kerak,
        // chunki backend emailga kodni yuborishi kerak.
        // Agar register funksiyasi allaqachon kodni yuborgan bo'lsa,
        // unda faqat modalni ochish kifoya.
        // Lekin sizning kodingizda registerdan keyin to'g'ridan-to'g'ri modal ochilyapti,
        // va unda "Elektron pochtangizga tasdiqlash kodi yuborildi" deb xabar berilyapti.
        // Bu shuni anglatadiki, register funksiyasi allaqachon kodni yuborgan.
        toast.info("Elektron pochtangizga tasdiqlash kodi yuborildi. Iltimos, tekshiring.");
        setShowModal(true);

    };

    // Telefonni tasdiqlash usulini tanlash
    const handleSelectPhone = () => {
        setVerificationMethod('phone');
        // Bu yerda ham, agar backend telefon raqamiga kodni yubormasa,
        // uni yuborish uchun alohida request kerak bo'lishi mumkin.
        // Lekin hozirgi kodingizda register funksiyasi ikkala kodni ham yaratib,
        // backendga yuborgan. Shuning uchun faqat modalni ochish kifoya.
        setShowModal(true);
    };

    return (
        <div className="register-page-container">
            <div className="register-container">
                <h2 className="register-title">Ro‘yxatdan o‘tish (Pasport bilan)</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ism" required className="register-input" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Familiya" required className="register-input" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="register-input" />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon raqam" required className="register-input" />
                    <input type="text" name="passport" value={formData.passport} onChange={handleChange} placeholder="Pasport seriyasi va raqami (masalan: AB1234567)" required className="register-input" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Parol" required className="register-input" />
                    <div className="file-input-wrapper">
                        <label>Pasport surati:</label>
                        <input type="file" name="passportImage" onChange={handleFileChange} required />
                    </div>
                    {
                        loading == true ?
                            <div class="flex items-center justify-center">
                                <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>

                            :
                            <button type="submit" className="register-button">Ro‘yxatdan o‘tish</button>
                    }
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="login-link">
                    Sizda allaqachon akkaunt bormi? <a href="/login">Kirish</a>
                </p>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className="flex flex-col items-center p-6 space-y-4">
                        <h3 className="text-xl font-bold text-gray-800">Tasdiqlash usulini tanlang</h3>
                        {verificationMethod === 'phone' ? (
                            <form onSubmit={handlePhoneVerification} className="w-full flex flex-col items-center space-y-4">
                                <p className="text-gray-600 text-center">Telefon raqamingizga yuborilgan kodni kiriting.</p>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Tasdiqlash kodi"
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Tasdiqlash</button>
                            </form>
                        ) : verificationMethod === 'email' ? (
                            <form onSubmit={handleEmailVerification} className="w-full flex flex-col items-center space-y-4">
                                <p className="text-gray-600 text-center">Emailingizga yuborilgan kodni kiriting.</p>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Tasdiqlash kodi"
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Tasdiqlash</button>
                            </form>
                        ) : (
                            <>
                                <p className="text-gray-600 text-center">Ro‘yxatdan o‘tishni yakunlash uchun, iltimos, tanlangan usul orqali tasdiqlang.</p>
                                <div className="w-full space-y-2">
                                    <button
                                        onClick={handleSelectEmail}
                                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Email orqali tasdiqlash
                                    </button>
                                    <button
                                        onClick={handleSelectPhone}
                                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                                    >
                                        Telefon orqali tasdiqlash
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Register;