import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const setAuthInfo = useAuthStore((state) => state.setAuthInfo);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post('/api/auth/login', data);

      if (response.status === 200) {
        const { token, username, email } = response.data;

        setAuthInfo(token, username, email);

        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);

        navigate('/todos');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white max-w-md w-full rounded-lg shadow-lg p-10"
      >
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
          Log In
        </h2>

       
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="you@example.com"
            className={`w-full border rounded-md px-4 py-3 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-blue-500'
            }`}
          />
          {errors.email && (
            <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Enter your password"
            className={`w-full border rounded-md px-4 py-3 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-blue-500'
            }`}
          />
          {errors.password && (
            <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
          )}
        </div>

        
        <div className="mb-6 text-right">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

    
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow transition"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="mt-4 w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-md shadow transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
