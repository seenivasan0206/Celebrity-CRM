import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: 1,
  name: 'Admin',
  email: 'admin@zenvecrm.io',
  role: 'System Administrator',
  agency: 'Zenve Global Entertainment',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  plan: 'Premium Plan (Active)'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('zenve_auth_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
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
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (email, password) => {
    // Simulated authentication with realistic verification
    if (!email || !password) {
      return { success: false, message: 'Please provide both email and password' };
    }
    
    // Create or find user
    let loggedUser = DEFAULT_USER;
    if (email.toLowerCase().includes('manager')) {
      loggedUser = {
        id: 2,
        name: 'Sarah Jenkins',
        email: email,
        role: 'Talent Manager',
        agency: 'Global Talent & Media',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        plan: 'Executive Pro'
      };
    } else if (email !== DEFAULT_USER.email) {
      loggedUser = {
        id: Date.now(),
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: 'VIP Talent Executive',
        agency: 'Zenve Entertainment Network',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        plan: 'Custom Enterprise'
      };
    }

    setUser(loggedUser);
    localStorage.setItem('zenve_auth_user', JSON.stringify(loggedUser));
    return { success: true, user: loggedUser };
  };

  const register = (data) => {
    const { name, email, agency, role } = data;
    if (!name || !email) {
      return { success: false, message: 'Name and email are required' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      agency: agency || 'Zenve Talent Agency',
      role: role || 'Talent Executive',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      plan: 'Growth Pro (Trial)'
    };

    setUser(newUser);
    localStorage.setItem('zenve_auth_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zenve_auth_user');
  };

  const updateProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('zenve_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

