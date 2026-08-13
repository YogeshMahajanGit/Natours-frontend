import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, ShieldAlert, Save, Loader2, KeyRound, AlertTriangle } from 'lucide-react';
import ToastNotification from '../components/common/ToastNotification';

const Profile = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ message: null, type: 'info' });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    watch,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watch('password');

  const onUpdateProfile = async (data) => {
    setProfileSubmitting(true);
    try {
      await updateProfile(data);
      setToast({ message: 'Profile details updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const onChangePassword = async (data) => {
    setPasswordSubmitting(true);
    try {
      await changePassword({
        passwordCurrent: data.passwordCurrent,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });
      resetPasswordForm();
      setToast({ message: 'Password updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update password.', type: 'error' });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await deleteAccount();
    } catch (err) {
      setToast({ message: err.message || 'Failed to deactivate account.', type: 'error' });
      setDeactivating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <ToastNotification
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: 'info' })}
      />

      {/* Profile Header */}
      <div className="border-b-2 border-dashed border-[#D6CFBE] pb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#1F3D2B] text-amber-300 font-mono font-bold text-2xl flex items-center justify-center border-2 border-[#A8541F] shadow">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div>
          <span className="text-xs font-mono text-[#A8541F] uppercase font-bold tracking-widest block mb-0.5">
            EXPLORER PROFILE
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">{user?.name}</h1>
          <p className="text-xs font-mono text-[#8E8A7E]">{user?.email} • Role: {user?.role || 'User'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form 1: Profile Settings */}
        <div className="ticket-stub rounded-2xl p-6 bg-white shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F7F4EC] pb-3 text-[#1F3D2B]">
            <User className="w-5 h-5" />
            <h3 className="font-serif text-xl font-bold">Personal Information</h3>
          </div>

          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
                <input
                  type="text"
                  {...registerProfile('name', { required: 'Name is required' })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>
              {profileErrors.name && (
                <p className="text-xs font-mono text-red-600 mt-1">{profileErrors.name.message}</p>
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
                  {...registerProfile('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>
              {profileErrors.email && (
                <p className="text-xs font-mono text-red-600 mt-1">{profileErrors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={profileSubmitting}
              className="w-full py-2.5 bg-[#1F3D2B] hover:bg-[#2E5940] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {profileSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Info</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Form 2: Password Settings */}
        <div className="ticket-stub rounded-2xl p-6 bg-white shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F7F4EC] pb-3 text-[#1F3D2B]">
            <KeyRound className="w-5 h-5 text-[#A8541F]" />
            <h3 className="font-serif text-xl font-bold">Security & Password</h3>
          </div>

          <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerPassword('passwordCurrent', {
                    required: 'Current password is required',
                  })}
                  className="w-full pl-10 pr-3 py-2 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>
              {passwordErrors.passwordCurrent && (
                <p className="text-xs font-mono text-red-600 mt-1">{passwordErrors.passwordCurrent.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E8A7E] absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="•••••••• (min 8 chars)"
                  {...registerPassword('password', {
                    required: 'New password is required',
                    minLength: { value: 8, message: 'Must be at least 8 characters' },
                  })}
                  className="w-full pl-10 pr-3 py-2 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>
              {passwordErrors.password && (
                <p className="text-xs font-mono text-red-600 mt-1">{passwordErrors.password.message}</p>
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
                  {...registerPassword('passwordConfirm', {
                    required: 'Please confirm new password',
                    validate: (val) => val === newPassword || 'Passwords do not match',
                  })}
                  className="w-full pl-10 pr-3 py-2 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>
              {passwordErrors.passwordConfirm && (
                <p className="text-xs font-mono text-red-600 mt-1">{passwordErrors.passwordConfirm.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordSubmitting}
              className="w-full py-2.5 bg-[#A8541F] hover:bg-[#8C4318] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {passwordSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone: Account Deactivation */}
      <div className="ticket-stub rounded-2xl p-6 bg-red-50/50 border border-red-200 space-y-4">
        <div className="flex items-center gap-2 text-red-800">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-serif text-lg font-bold">Danger Zone: Deactivate Account</h3>
        </div>
        <p className="text-xs font-mono text-red-700 leading-relaxed">
          Deactivating your account will disable your login access and clear client session credentials.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-mono text-xs uppercase rounded-lg shadow font-semibold"
        >
          Deactivate Account
        </button>
      </div>

      {/* Deactivation Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ticket-stub rounded-2xl p-6 bg-white max-w-md w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">Deactivate Your Account?</h3>
            <p className="text-xs text-[#1B1B18]/70 leading-relaxed">
              Are you sure you want to deactivate your Natours account? This action will log you out immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-mono uppercase text-[#8E8A7E] hover:text-[#1B1B18]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase font-bold rounded-lg shadow disabled:opacity-50"
              >
                {deactivating ? 'Deactivating...' : 'Confirm Deactivation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
