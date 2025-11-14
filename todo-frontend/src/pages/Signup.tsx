import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const signupSchema = z
  .object({
    username: z.string().min(3, 'Username should be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      await axios.post('/api/auth/signup', {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white max-w-md w-full rounded-lg shadow-lg p-10"
      >
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
          Sign Up
        </h2>

       
        <div className="mb-6">
          <label htmlFor="username" className="block mb-2 font-semibold text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username')}
            placeholder="Your username"
            className={`w-full rounded-md px-4 py-3 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.username ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-600 focus:ring-blue-500'
            }`}
          />
          {errors.username && <p className="text-red-600 mt-1 text-sm">{errors.username.message}</p>}
        </div>

      
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="you@example.com"
            className={`w-full rounded-md px-4 py-3 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.email ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-600 focus:ring-blue-500'
            }`}
          />
          {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Enter your password"
            className={`w-full rounded-md px-4 py-3 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.password ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-600 focus:ring-blue-500'
            }`}
          />
          {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
        </div>

        <div className="mb-8">
          <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            placeholder="Confirm your password"
            className={`w-full rounded-md px-4 py-3 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.confirmPassword ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-600 focus:ring-blue-500'
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 mt-1 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow transition"
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;


