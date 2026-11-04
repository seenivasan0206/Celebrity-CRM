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

  const [email, setEmail] = useState('admin@zenve.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your work email/username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Unable to connect to authentication server. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Professional Enterprise Sign In Card */}
      <div className="auth-form-card">
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}
          >
            <Star size={20} fill="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineHeight: 1.1 }}>
              Zenve CRM
            </h2>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Enterprise Talent OS
            </span>
          </div>
        </div>

        <div className="auth-header-block">
          <h3>Sign In</h3>
          <p>
            Enter your authorized credentials to access your talent workspace
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--secondary-subtle)',
              border: '1px solid var(--secondary-border)',
              color: 'var(--text-main)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 500,
              lineHeight: 1.4
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ margin: 0 }}>Work Email or Username</label>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>Default: admin</span>
            </div>
            <div className="form-input-wrap" style={{ marginTop: '4px' }}>
              <Mail size={18} className="input-icon-left" />
              <input
                type="text"
                className="zenve-input"
                placeholder="admin or name@agency.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
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
                <ArrowRight size={16} />
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
            padding: '8px 12px',
            background: 'var(--bg-card-alt)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}
        >
          <ShieldCheck size={14} color="var(--accent)" />
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
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      border: '1px solid var(--accent-border)'
                    }}
                  >
                    <Check size={20} />
                  </div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '6px' }}>Recovery Link Sent</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    We dispatched a secure password reset link to <strong>{forgotEmail}</strong>.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Enter your registered work email and we will send you an authorized reset link.
                  </p>
                  <div className="form-group" style={{ marginTop: '12px' }}>
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
