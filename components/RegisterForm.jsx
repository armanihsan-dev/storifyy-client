import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../API/LoginWithGoogle';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

const RegisterForm = () => {
  const BASE_URL = 'http://localhost:3000';
  const [isRegistered, setisRegistered] = useState(true);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes = 600 seconds
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  // Countdown effect
  useEffect(() => {
    let interval;
    if (showOtpBox && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      toast.error('OTP expired. Please resend.');
      setShowOtpBox(false);
    }
    return () => clearInterval(interval);
  }, [showOtpBox, timer]);

  // Format timer (MM:SS)
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  // handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle OTP send
  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter your email first');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message || 'OTP sent successfully!');
        setShowOtpBox(true);
        setTimer(600); // reset timer
      }
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // handle OTP input
  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otpValues];
      newOtp[index] = value.slice(-1);
      setOtpValues(newOtp);
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  // Handle paste full OTP at once
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtpValues(digits);
      document.getElementById('otp-3').focus(); // move focus to last box
    } else {
      toast.error('Please paste a valid 4-digit OTP');
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpValues.join('');
    if (otp.length !== 4) {
      toast.error('Please enter all 4 digits');
      return;
    }

    // Send OTP verification request
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, otp }),
    });

    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success('OTP verified successfully!');
      setShowOtpBox(false);
    }
  };

  // handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setisRegistered(false);

    const response = await fetch(`${BASE_URL}/user/register`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.error) {
      toast.error(data.error);
      setisRegistered(true);
    } else {
      setisRegistered(true);
      setFormData({
        name: '',
        email: '',
        password: '',
      });
      toast.success(data.message);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <section className="w-full h-screen flex relative">
      <Toaster position="top-center" />

      {/* OTP Modal */}
      {showOtpBox && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-80 text-center space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Enter 4-digit OTP
            </h3>
            <p className="text-sm text-gray-500">
              Sent to <span className="font-medium">{formData.email}</span>
            </p>

            <div className="flex justify-center gap-3">
              {otpValues.map((v, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={v}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onPaste={handleOtpPaste} // allow pasting full OTP
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                />
              ))}
            </div>

            <p className="text-sm text-gray-600 font-medium">
              Expires in{' '}
              <span className="text-pink-500">{formatTime(timer)}</span>
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleVerifyOtp}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-medium transition"
              >
                Verify OTP
              </button>
              <button
                onClick={() => setShowOtpBox(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left side */}
      <div className="hidden lg:flex flex-col justify-between bg-pink-400 text-white p-10 w-[40%]">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <img
              src="../public/logo-white.svg"
              alt="folder illustration"
              className="w-10"
            />
            StoreIt
          </h1>
          <h2 className="text-3xl font-bold mt-10 leading-snug">
            Manage your files <br /> the best way
          </h2>
          <p className="mt-4 text-white/90">
            Awesome, we've created the perfect place for you to store all your
            documents.
          </p>
        </div>

        <div className="flex justify-start items-start">
          <img
            src="../public/Illustration.png"
            alt="folder illustration"
            className="w-64"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>

          {/* Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f75c57]"
          />

          {/* Email + Send OTP */}
          <div className="flex gap-1 ">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f75c57]"
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpLoading}
              className="w-30 text-sm bg-pink-100 text-pink-500 font-medium rounded-lg hover:bg-pink-200 transition flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {otpLoading ? (
                <>
                  <HashLoader size={14} color="#f75c57" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>

          {/* Password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f75c57]"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-pink-400 text-white font-semibold rounded-full hover:bg-[#e14a46] transition"
          >
            {isRegistered ? (
              'Create Account'
            ) : (
              <div className="flex items-center gap-3 justify-center">
                <HashLoader size={15} color="#fff" />
                <p>Registering...</p>
              </div>
            )}
          </button>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-400 font-medium">
              Login
            </Link>
          </p>
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="w-full flex items-center justify-center">
            <GoogleLogin
              shape="pill"
              size="large"
              onSuccess={async (credentialResponse) => {
                const idToken = credentialResponse.credential;
                await loginWithGoogle(idToken);
                navigate('/');
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterForm;
