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
  ShieldCheck,
  Check
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your work email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(email.trim(), password);
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Invalid credentials. Please verify your email and password.');
      }
    }, 450);
  };

  return (
    <div className="auth-page-wrapper">
      {/* Professional Enterprise Sign In Card */}
      <div className="auth-form-card">
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
              flexShrink: 0
            }}
          >
            <Star size={24} fill="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.85)', margin: 0, lineHeight: 1.1 }}>
              Zenve CRM
            </h2>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#67e8f9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Enterprise Talent OS
            </span>
          </div>
        </div>

        <div className="auth-header-block">
          <h3 style={{ fontSize: '1.4rem' }}>Sign In</h3>
          <p style={{ fontSize: '0.84rem', marginTop: '4px', lineHeight: 1.4 }}>
            Enter your authorized credentials to access your talent workspace
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#F43F5E',
              padding: '11px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              lineHeight: 1.4
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Work Email Address</label>
            <div className="form-input-wrap">
              <Mail size={18} className="input-icon-left" />
              <input
                type="email"
                className="zenve-input"
                placeholder="name@agency.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                Forgot password?
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
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-submit-auth"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Security & Compliance Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 12px',
            background: 'rgba(0, 0, 0, 0.28)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            fontSize: '0.74rem',
            color: 'rgba(255, 255, 255, 0.72)'
          }}
        >
          <ShieldCheck size={15} color="#10B981" />
          <span>256-bit SSL Encrypted · SOC2 Compliant Security</span>
        </div>

        <div className="auth-switch-footer" style={{ marginTop: '2px' }}>
          <span>Need an enterprise account?</span>
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
                    Enter your registered work email and we will send you an authorized reset link.
                  </p>
                  <div className="form-group" style={{ marginTop: '14px' }}>
                    <label className="form-label">Work Email</label>
                    <input
                      type="email"
                      className="zenve-input"
                      placeholder="name@agency.com"
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
