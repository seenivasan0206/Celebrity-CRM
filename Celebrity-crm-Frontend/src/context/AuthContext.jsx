import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('zenve_auth_user') || localStorage.getItem('zenve_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('zenve_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zenve_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  /**
   * Real Authentication Login — calls Backend POST /api/auth/login
   */
  const login = async (identifier, password) => {
    if (!identifier || !password) {
      return { success: false, message: 'Please provide both work email/username and password.' };
    }

    try {
      const cleanIdentifier = identifier.trim();
      // Send request to real backend auth endpoint with all alias fields
      const res = await api.auth.login({
        usernameOrEmail: cleanIdentifier,
        username: cleanIdentifier,
        email: cleanIdentifier,
        password: password
      });

      const token = res.token;
      const authenticatedUser = {
        id: res.userId || res.id,
        username: res.username || cleanIdentifier.split('@')[0],
        email: res.email || cleanIdentifier,
        name: res.fullName || res.username || cleanIdentifier.split('@')[0],
        role: res.role || 'ROLE_ADMIN',
        agency: 'Zenve Global Entertainment',
        plan: 'Enterprise Active License',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(res.fullName || res.username || cleanIdentifier)}`
      };

      if (token) {
        sessionStorage.setItem('zenve_auth_token', token);
        localStorage.setItem('zenve_auth_token', token);
      }
      sessionStorage.setItem('zenve_auth_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('zenve_auth_user', JSON.stringify(authenticatedUser));

      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Invalid credentials. Please verify your email and password.'
      };
    }
  };

  /**
   * Real Authentication Register — calls Backend POST /api/auth/register
   */
  const register = async (data) => {
    const { name, email, password, role } = data;
    if (!name || !email || !password) {
      return { success: false, message: 'Name, email, and password are required.' };
    }

    try {
      // Derive a safe alphanumeric username of at least 3 characters
      let username = (data.username || email.split('@')[0] || name.replace(/\s+/g, '')).trim().toLowerCase();
      username = username.replace(/[^a-z0-9._-]/g, '');
      if (username.length < 3) {
        username = (username + 'user').substring(0, 15);
      }

      // Map role cleanly to Role enum string
      let mappedRole = 'ROLE_USER';
      if (role) {
        const rUpper = role.toUpperCase();
        if (rUpper.includes('ADMIN') || rUpper.includes('PARTNER')) mappedRole = 'ROLE_ADMIN';
        else if (rUpper.includes('MANAGER') || rUpper.includes('HEAD') || rUpper.includes('PRODUCER')) mappedRole = 'ROLE_MANAGER';
        else if (rUpper.includes('CASTING')) mappedRole = 'ROLE_CASTING_DIRECTOR';
      }

      const res = await api.auth.register({
        username,
        email: email.trim().toLowerCase(),
        password,
        fullName: name.trim(),
        role: mappedRole,
        agency: data.agency || undefined
      });

      const token = res.token;
      const newUser = {
        id: res.userId || res.id,
        username: res.username || username,
        email: res.email || email,
        name: res.fullName || name,
        role: res.role || mappedRole,
        agency: data.agency || 'Zenve Talent Agency',
        plan: 'Enterprise Active License',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      };

      if (token) {
        sessionStorage.setItem('zenve_auth_token', token);
        localStorage.setItem('zenve_auth_token', token);
      }
      sessionStorage.setItem('zenve_auth_user', JSON.stringify(newUser));
      localStorage.setItem('zenve_auth_user', JSON.stringify(newUser));

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Unable to register account. Please check your credentials.'
      };
    }
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  /**
   * Logout — clears all sessions and tokens
   */
  const logout = () => {
    setUser(null);
    setIsLogoutModalOpen(false);
    sessionStorage.removeItem('zenve_auth_user');
    localStorage.removeItem('zenve_auth_user');
    sessionStorage.removeItem('zenve_auth_token');
    localStorage.removeItem('zenve_auth_token');
  };

  /**
   * Update Profile
   */
  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      sessionStorage.setItem('zenve_auth_user', JSON.stringify(updated));
      localStorage.setItem('zenve_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, theme, toggleTheme, isLogoutModalOpen, openLogoutModal, closeLogoutModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
