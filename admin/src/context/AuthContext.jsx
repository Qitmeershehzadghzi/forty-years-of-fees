import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin, getMe } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fees_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem('fees_admin_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await getMe();
        setUser(profile);
        localStorage.setItem('fees_admin_user', JSON.stringify(profile));
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        setUser(null);
        localStorage.removeItem('fees_admin_token');
        localStorage.removeItem('fees_admin_user');
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, []);

  const login = async (email, password) => {
    const data = await loginAdmin(email, password);
    localStorage.setItem('fees_admin_token', data.token);
    localStorage.setItem('fees_admin_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await logoutAdmin();
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user) return false;
    const hierarchy = { SUPER_ADMIN: 4, ADMIN: 3, RESEARCHER: 2, VIEWER: 1 };
    return (hierarchy[user.role] || 0) >= (hierarchy[role] || 0);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      hasRole,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
