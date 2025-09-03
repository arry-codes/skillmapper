import { useForm } from 'react-hook-form';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthProvider.jsx';
import { Link } from 'react-router-dom';
import { ToastContainer, Bounce, toast } from 'react-toastify';


const Signup = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate()
  const { control, register, handleSubmit, reset, formState: { errors }, } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, data);
      const { message, authToken } = res.data
      localStorage.setItem('authToken', authToken);
      reset({
        username: '',
        password: '',
      });

      setIsLoggedIn(true)

      toast(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => navigate('/'),
      });
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      const msg = (err.response?.data?.message || 'Signup failed');
      toast(msg, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your SkillMap Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div>
            <label htmlFor="username" className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              {...register('username',

                {
                  required: 'Username is required',
                  minLength: {
                    message: "Enter valid username",
                    value: 2
                  }
                }

              )}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address'
                }
              })}
              className='w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              {...register('password', {
                required: true,
                minLength: {
                  value: 5,
                  message: "Min length of password:5"
                }

              })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Log in</Link>
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

export default Signup;
