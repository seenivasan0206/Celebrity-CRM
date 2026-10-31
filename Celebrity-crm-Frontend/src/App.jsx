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
import Agencies from './pages/Agencies';
import OttProjects from './pages/OttProjects';
import CastingCalls from './pages/CastingCalls';
import Applications from './pages/Applications';
import Files from './pages/Files';
import Reports from './pages/Reports';
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

            {/* Authenticated Application Routes with Separate Dedicated Paths */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="celebrities" element={<Celebrities />} />
              <Route path="managers" element={<Managers />} />
              <Route path="agencies" element={<Agencies />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="shoots" element={<Shoots />} />
              <Route path="ott-projects" element={<OttProjects />} />
              <Route path="casting" element={<CastingCalls />} />
              <Route path="applications" element={<Applications />} />
              <Route path="files" element={<Files />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CrmProvider>
    </AuthProvider>
  );
}
