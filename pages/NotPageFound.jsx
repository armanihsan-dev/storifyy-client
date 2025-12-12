import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudOff, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-hidden relative">
      {/* --- Background Decor --- */}
      {/* Large glowing orbs in the background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-1000"></div>

      {/* Giant 404 Watermark Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="text-[25rem] font-black text-gray-900/[0.03] tracking-tighter transform -rotate-12">
          404
        </h1>
      </div>

      {/* --- Glass Card Content --- */}
      <div className="relative z-10 max-w-lg w-full px-4 text-center">
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-10 md:p-12 relative overflow-hidden group">
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-8 relative">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
            <CloudOff className="w-10 h-10 text-red-500" />
          </div>

          {/* Text */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Page not found
          </h2>

          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Oops! It seems the file or directory you are looking for has
            vanished into the cloud.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all active:scale-95 w-full sm:w-auto justify-center"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            {/* Home Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all active:scale-95 w-full sm:w-auto justify-center"
            >
              <Home size={18} />
              Dashboard
            </button>
          </div>
        </div>

        {/* Footer help text */}
        <p className="mt-8 text-gray-400 text-sm font-medium">
          Error Code: 404 • Cloud Storage App
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
