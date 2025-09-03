import React from "react";
import { useForm } from "react-hook-form";
import axios from 'axios'
import { Link, useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider.jsx";
import { Bounce, toast,ToastContainer } from 'react-toastify';

const LoginForm = () => {
  const { setIsLoggedIn,isProfileCompleted,setIsProfileCompleted } = useAuth();


  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate()
  // Form submit handler
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, data)
      const { message, authToken } = res.data

      localStorage.setItem('authToken', authToken)
      reset({
        username: '',
        password: '',
      });
      setIsLoggedIn(true)
      setIsProfileCompleted(res.data.isProfileCompleted);

      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => navigate(from, { replace: true }),
      });
    }
    catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      const msg = err.response?.data || 'Login failed'
      toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Log in to SkillMap</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm mb-1">Username</label>
            <input
              type="text"
              id="username"
              {...register("username",
                {
                  required: "Username is required",
                  minLength: {
                    value: 2,
                    message: 'Enter valid username'
                  }
                })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              type="password"
              id="password"
              {...register("password",
                {
                  required: "Password is required",
                  minLength: {
                    value: 5,
                    message: "Enter valid password"
                  }

                })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>

  );
};

export default LoginForm;
