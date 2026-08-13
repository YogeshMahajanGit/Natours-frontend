import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ToastNotification from '../components/common/ToastNotification';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const from = location.state?.from?.pathname || '/tours';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your email and password.');
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
          <div className="w-12 h-12 rounded-full border-2 border-[#A8541F] bg-[#1F3D2B] text-amber-300 flex items-center justify-center mx-auto mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">Log In to Natours</h1>
          <p className="text-xs font-mono text-[#8E8A7E]">Welcome back, adventurer. Enter your credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address format',
                  },
                })}
                className="w-full pl-10 pr-3 py-2.5 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            {errors.email && (
              <p className="text-xs font-mono text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-mono text-[#A8541F] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#1F3D2B] hover:bg-[#2E5940] text-white font-mono text-sm uppercase tracking-wider font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#F7F4EC] text-center text-xs font-mono text-[#8E8A7E]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#A8541F] font-bold hover:underline">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
