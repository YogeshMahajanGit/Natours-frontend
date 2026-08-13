import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ToastNotification from '../components/common/ToastNotification';

const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/tours', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });
      navigate('/tours', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
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
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">Create an Account</h1>
          <p className="text-xs font-mono text-[#8E8A7E]">Join the Natours expedition community today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="John Doe"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                className="w-full pl-10 pr-3 py-2.5 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            {errors.name && (
              <p className="text-xs font-mono text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

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
            <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
              Password
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
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('passwordConfirm', {
                  required: 'Please confirm your password',
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
            className="w-full py-3 bg-[#A8541F] hover:bg-[#8C4318] text-white font-mono text-sm uppercase tracking-wider font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#F7F4EC] text-center text-xs font-mono text-[#8E8A7E]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1F3D2B] font-bold hover:underline">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
