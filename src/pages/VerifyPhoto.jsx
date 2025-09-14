import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyPhoto = () => {
  const { passport } = useParams();
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!photo) {
      setError("Surat yuklanmagan!");
      return;
    }

    const data = new FormData();
    data.append('photo', photo);

    try {
      const response = await axios.post(`http://localhost:5000/api/users/verify-with-photo/${passport}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      alert('Tasdiqlash muvaffaqiyatli! Endi tizimga kirishingiz mumkin.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Server xatosi ro‘y berdi');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Suratni tasdiqlash</h2>
        <p className="text-center text-gray-600 mb-4">Iltimos, pasport suratingizdagi yuz bilan bir xil bo'lgan suratingizni yuklang.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Suratingiz:</label>
            <input
              type="file"
              name="photo"
              onChange={handleFileChange}
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
          >
            Tasdiqlash
          </button>
        </form>
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyPhoto;
