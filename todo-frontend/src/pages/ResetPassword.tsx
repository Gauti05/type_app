import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type ResetFormInputs = z.infer<typeof resetSchema>;

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormInputs) => {
    try {
      await axios.post(`/api/auth/reset-password/${token}`, data);
      alert('Password reset successful! Please login again.');
      navigate('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white max-w-md w-full rounded-lg shadow-lg p-10"
      >
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
          Reset Password
        </h2>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Enter new password"
            className={`w-full border rounded-md px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.password && (
            <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow transition"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
