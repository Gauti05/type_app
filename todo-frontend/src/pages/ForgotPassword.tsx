import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotFormInputs = z.infer<typeof forgotSchema>;

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormInputs>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormInputs) => {
    try {
      await axios.post('/api/auth/forgot-password', data);
      alert('If the email is registered, a reset link will be sent.');
    } catch (error) {
      alert('Failed to send password reset email');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white max-w-md w-full rounded-lg shadow-lg p-10"
      >
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          Forgot Password
        </h2>

        <p className="mb-8 text-center text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <div className="mb-8">
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

          {errors.email && (
            <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow transition"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;


