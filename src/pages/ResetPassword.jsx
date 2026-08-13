import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { authApi } from '../api/authApi';
import ToastNotification from '../components/common/ToastNotification';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: null, type: 'info' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    setToast({ message: null, type: 'info' });

    try {
      await authApi.resetPassword(token, {
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });

      setToast({
        message: 'Password successfully updated! Redirecting to login...',
        type: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Password reset token is invalid or expired.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <ToastNotification
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: 'info' })}
      />

      <div className="w-full max-w-md ticket-stub rounded-2xl p-8 bg-white shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border-2 border-[#A8541F] bg-[#1F3D2B] text-amber-300 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">Choose New Password</h1>
          <p className="text-xs font-mono text-[#8E8A7E]">
            Please enter your new strong password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
              <input
                type="password"
                placeholder="•••••••• (min 8 chars)"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                className="w-full pl-10 pr-3 py-2.5 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            {errors.password && (
              <p className="text-xs font-mono text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('passwordConfirm', {
                  required: 'Please confirm your new password',
                  validate: (val) => val === password || 'Passwords do not match',
                })}
                className="w-full pl-10 pr-3 py-2.5 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            {errors.passwordConfirm && (
              <p className="text-xs font-mono text-red-600 mt-1">{errors.passwordConfirm.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#1F3D2B] hover:bg-[#2E5940] text-white font-mono text-sm uppercase tracking-wider font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Set New Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
