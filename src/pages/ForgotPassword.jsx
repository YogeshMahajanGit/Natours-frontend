import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/authApi';
import ToastNotification from '../components/common/ToastNotification';

const ForgotPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await authApi.forgotPassword(data.email);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send reset email. Please verify your email address.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <ToastNotification
        message={errorMsg}
        type="error"
        onClose={() => setErrorMsg(null)}
      />

      <div className="w-full max-w-md ticket-stub rounded-2xl p-8 bg-white shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border-2 border-[#1F3D2B] bg-[#F7F4EC] text-[#1F3D2B] flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">Reset Password</h1>
          <p className="text-xs font-mono text-[#8E8A7E]">
            Enter your account email to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-[#1F3D2B] text-white rounded-xl text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-amber-300 mx-auto" />
            <h3 className="font-serif font-bold text-lg">Reset Link Dispatched</h3>
            <p className="text-xs font-mono text-[#F7F4EC]/80 leading-relaxed">
              If an account associated with that email exists, we've sent reset instructions. Please check your inbox.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase text-amber-300 hover:underline pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format',
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-mono text-red-600 mt-1">{errors.email.message}</p>
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
                  <span>Sending Instructions...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Reset Email</span>
                </>
              )}
            </button>
          </form>
        )}

        {!submitted && (
          <div className="pt-4 border-t border-[#F7F4EC] text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8E8A7E] hover:text-[#1F3D2B]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
