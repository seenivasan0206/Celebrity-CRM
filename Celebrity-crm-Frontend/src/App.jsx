import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CrmProvider } from './context/CrmContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Celebrities from './pages/Celebrities';
import Campaigns from './pages/Campaigns';
import Shoots from './pages/Shoots';
import Contracts from './pages/Contracts';
import Managers from './pages/Managers';
import Settings from './pages/Settings';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CrmProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="celebrities" element={<Celebrities />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="shoots" element={<Shoots />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="managers" element={<Managers />} />
              <Route path="reports" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CrmProvider>
    </AuthProvider>
  );
}

