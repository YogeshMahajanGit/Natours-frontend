import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('natours_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('natours_token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await authApi.getMe();
      setUser(userData);
      setToken(storedToken);
    } catch {
      localStorage.removeItem('natours_token');
      localStorage.removeItem('natours_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authApi.login({ email, password });
      const jwtToken = data.token;
      const currentUser = data.data?.user || data.data?.data;

      localStorage.setItem('natours_token', jwtToken);
      localStorage.setItem('natours_user', JSON.stringify(currentUser));
      setToken(jwtToken);
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      throw new Error(message);
    }
  };

  const signup = async (userData) => {
    setError(null);
    try {
      const data = await authApi.signup(userData);
      const jwtToken = data.token;
      const currentUser = data.data?.user || data.data?.data;

      if (jwtToken) {
        localStorage.setItem('natours_token', jwtToken);
        localStorage.setItem('natours_user', JSON.stringify(currentUser));
        setToken(jwtToken);
        setUser(currentUser);
      }
      return { success: true, user: currentUser };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('natours_token');
    localStorage.removeItem('natours_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateProfile = async (updateData) => {
    setError(null);
    try {
      const res = await authApi.updateMe(updateData);
      const updatedUser = res.data?.user || res.data?.data || res.data;
      setUser(updatedUser);
      localStorage.setItem('natours_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      setError(message);
      throw new Error(message);
    }
  };

  const changePassword = async (passwordData) => {
    setError(null);
    try {
      const res = await authApi.updatePassword(passwordData);
      if (res.token) {
        localStorage.setItem('natours_token', res.token);
        setToken(res.token);
      }
      return res;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update password.';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteAccount = async () => {
    setError(null);
    try {
      await authApi.deleteMe();
      logout();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to deactivate account.';
      setError(message);
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from '../hooks/useAuth';

