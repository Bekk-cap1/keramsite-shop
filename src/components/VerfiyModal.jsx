import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Kutubxonani CDN orqali yuklaymiz.
const faceapi = window.faceapi;

const MODEL_URL = 'http://localhost:5000/face-api-models';

const VerifyModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadModels();
        }
    }, [isOpen]);

    const loadModels = async () => {
        try {
            if (!faceapi) {
                toast.error("Face-API.js kutubxonasi mavjud emas.");
                return;
            }
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            setModelsLoaded(true);
            toast.success("Yuzni tanish modellarini yuklandi.");
            startCamera(); // Modellar yuklangandan so'ng kamerani avtomatik ishga tushirish
        } catch (error) {
            console.error('Yuzni tanish modellarini yuklashda xato:', error);
            toast.error('Yuzni tanish modellarini yuklashda xato yuz berdi.');
        }
    };

    const startCamera = async () => {
        try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = videoStream;
            setStream(videoStream);
            await videoRef.current.play();
            toast.info('Kamera ishga tushdi. Yuzingizni kameraga ko‘rsating...');
        } catch (err) {
            console.error('Kameraga kirishda xato:', err);
            toast.error('Kameraga kirishda xato. Iltimos, ruxsat bering.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleVerification = async () => {
        if (!videoRef.current) {
            toast.error('Kamera ishlamayapti.');
            return;
        }

        const authToken = localStorage.getItem('token');
        if (!authToken) {
            toast.error('Autentifikatsiya tokeni topilmadi. Iltimos, qayta kiring.');
            return;
        }

        setLoading(true);
        try {
            const detections = await faceapi.detectSingleFace(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detections) {
                toast.error('Yuzingiz topilmadi. Yuzingizni aniqroq ko‘rsating.');
                setLoading(false);
                return;
            }

            const canvas = canvasRef.current;
            const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            // Sizning backend kodingizdagi `verifyPassport` endpointi yuzni solishtirish logikasini talab qiladi.
            // Bu yerda biz so'rovni soddalashtirilgan holda yuboryapmiz.
            // Backenddagi `verifyPassport` funksiyasida yuz solishtirish logikasini yozishingiz kerak.
            const response = await axios.post(`http://localhost:5000/api/users/verify-passport`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Tokenni yuboramiz
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                onClose();
            } else {
                toast.error(response.data.error);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Tasdiqlashda xato ro‘y berdi.');
        } finally {
            setLoading(false);
            stopCamera();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Yuzni tasdiqlash</h2>
                <p>Kamera ochiladi. Pasport suratingiz bilan solishtirish uchun yuzingizni ko‘rsating.</p>
                <video ref={videoRef} autoPlay muted width="640" height="480" />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                <div className="modal-actions">
                    <button onClick={handleVerification} disabled={loading || !modelsLoaded}>Tasdiqlash</button>
                    <button onClick={onClose} disabled={loading}>Bekor qilish</button>
                </div>
                {loading && <p>Yuklanmoqda...</p>}
            </div>
        </div>
    );
};

export default VerifyModal;
