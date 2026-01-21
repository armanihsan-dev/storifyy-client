import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { loginWithGoogle } from '../API/LoginWithGoogle';

const Login = () => {
  const BASE_URL = 'https://storifyy-backend.onrender.com';
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        toast.success(data.message || 'Login successful!');
        // UPDATED: Redirect to /app instead of /
        setTimeout(() => {
          navigate('/app');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full h-screen flex">
      <Toaster position="top-center" />

      {/* Left side */}
      <div className="hidden lg:flex flex-col justify-between bg-pink-400 text-white p-10 w-[40%]">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <img src="logo-white.svg" className="w-10" alt="" />
            Storifyy
          </h1>
          <h2 className="text-3xl font-bold mt-10 leading-snug">
            Welcome Back <br /> Login to Continue
          </h2>
          <p className="mt-4 text-white/90">
            Access your documents securely and manage your files with ease.
          </p>
        </div>

        <div className="flex justify-start items-start">
          {/* Replace with actual illustration */}
          <img
            src="/Illustration.png"
            alt="folder illustration"
            className="w-64"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Login</h2>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f75c57]"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f75c57]"
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-pink-400 text-white font-semibold rounded-full hover:bg-[#e14a46] transition"
          >
            {isLoading ? (
              <div className="flex items-center gap-3 justify-center">
                <HashLoader size={15} color="#fff" />
                <p>Logging in...</p>
              </div>
            ) : (
              'Login'
            )}
          </button>
          <p className="text-sm text-center text-gray-500">
            Don’t have an account?{' '}
            <Link to="/register" className="text-[#f75c57] font-medium">
              Register
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
                try {
                  await loginWithGoogle(idToken);
                  toast.success('Login successful!');
                  // UPDATED: Redirect to /app instead of /
                  setTimeout(() => {
                    navigate('/');
                  }, 1000);
                } catch (error) {
                  toast.error('Google login failed');
                  console.error(error);
                }
              }}
              onError={() => {
                console.log('Login Failed');
                toast.error('Google login failed');
              }}
              useOneTap
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
