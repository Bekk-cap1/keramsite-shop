import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center p-4 bg-gray-50">
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest animate-pulse">
        404
      </h1>
      <div className="bg-white px-2 text-sm text-gray-800 rounded-md rotate-12 absolute shadow-lg">
        Sahifa topilmadi
      </div>
      <button className="mt-5">
        <Link
          to="/"
          className="relative inline-block text-sm font-medium text-white group active:text-blue-500 focus:outline-none focus:ring"
        >
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-blue-600 group-hover:translate-y-0 group-hover:translate-x-0"></span>
          <span className="relative block px-8 py-3 bg-blue-500 border border-current rounded-md">
            Bosh sahifaga qaytish
          </span>
        </Link>
      </button>
    </div>
  );
};

export default NotFound;
