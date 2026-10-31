import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@zenvecrm.io');
  const [password, setPassword] = useState('ZenveAdmin#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    }, 450);
  };

  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@zenvecrm.io');
      setPassword('ZenveAdmin#2026');
      login('admin@zenvecrm.io', 'ZenveAdmin#2026');
    } else {
      setEmail('manager@zenvecrm.io');
      setPassword('ManagerPass#2026');
      login('manager@zenvecrm.io', 'ManagerPass#2026');
    }
    navigate('/');
  };

  return (
    <div className="auth-page-wrapper">
      {/* Centered Sign In Card Only */}
      <div className="auth-form-card">
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '4px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 16px var(--primary-glow)'
            }}
          >
            <Star size={22} fill="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.85)', margin: 0, lineHeight: 1.1 }}>
              Zenve CRM
            </h2>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#67e8f9', textShadow: '0 1px 4px rgba(0,0,0,0.85)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Talent & Celebrity OS
            </span>
          </div>
        </div>

        <div className="auth-header-block" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.3rem' }}>Sign In</h3>
          <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>Enter your credentials to access your talent portal</p>
        </div>

        {/* Quick 1-Click Demo Logins */}
        <div className="demo-login-box">
          <span className="demo-login-label">⚡ 1-Click Quick Demo</span>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn-demo-quick"
              onClick={() => handleDemoLogin('admin')}
            >
              <Star size={13} color="#F59E0B" /> Admin Demo
            </button>
            <button
              type="button"
              className="btn-demo-quick"
              onClick={() => handleDemoLogin('manager')}
            >
              <ArrowRight size={13} color="#06B6D4" /> Manager Demo
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#F43F5E',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrap">
              <Mail size={18} className="input-icon-left" />
              <input
                type="email"
                className="zenve-input"
                placeholder="name@agency.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Password</span>
              <button
                type="button"
                className="forgot-link"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotSubmitted(false);
                }}
              >
                Forgot?
              </button>
            </div>
            <div className="form-input-wrap">
              <Lock size={18} className="input-icon-left" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="zenve-input"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-options-row">
            <label className="remember-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-submit-auth"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : (
              <>
                <span>Enter Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-switch-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Create Account</Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="modal-close-btn" onClick={() => setShowForgotModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {forgotSubmitted ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px'
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '6px' }}>Recovery Link Sent</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    We dispatched a secure password reset link to <strong>{forgotEmail}</strong>.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Enter your registered email address and we'll send you a recovery link.
                  </p>
                  <div className="form-group" style={{ marginTop: '14px' }}>
                    <label className="form-label">Work Email</label>
                    <input
                      type="email"
                      className="zenve-input"
                      placeholder="admin@zenvecrm.io"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowForgotModal(false)}>
                Close
              </button>
              {!forgotSubmitted && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (forgotEmail) setForgotSubmitted(true);
                  }}
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
