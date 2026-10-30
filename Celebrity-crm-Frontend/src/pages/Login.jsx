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
  Sparkles,
  Clapperboard,
  BadgeCheck,
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
      <div className="auth-glow-blob-1" />
      <div className="auth-glow-blob-2" />

      <div className="auth-split-container">
        {/* Left Hero Pane */}
        <div className="auth-hero-pane">
          <div className="auth-hero-top">
            <div className="auth-brand-badge">
              <div className="icon-box">
                <Star size={24} fill="#ffffff" />
              </div>
              <div className="brand-text">
                <h2>Zenve CRM</h2>
                <span>Talent & Celebrity OS</span>
              </div>
            </div>
            <span className="hero-pill">
              <Sparkles size={14} /> v2.4 Enterprise Edition
            </span>
          </div>

          <div className="auth-hero-center">
            <h1 className="hero-title">
              Orchestrate <span>Celebrity</span> Partnerships & Productions.
            </h1>
            <p className="hero-sub">
              Zenve CRM brings high-profile talent rosters, endorsements, call-sheet scheduling,
              and multi-million dollar contracts into one unified executive workspace.
            </p>

            <div className="hero-features-list">
              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <BadgeCheck size={18} />
                </div>
                <span>Pan-India Top Star Management (Vijay, Nayanthara, Suriya & More)</span>
              </div>
              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <Clapperboard size={18} />
                </div>
                <span>End-to-End Shoot Scheduling & Location Dispatch</span>
              </div>
              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <ShieldCheck size={18} />
                </div>
                <span>Multi-Tier Legal Contracts & Brand Milestone Escrow</span>
              </div>
            </div>
          </div>

          <div className="auth-hero-bottom">
            <div className="avatar-stack">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Vijay" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Nayanthara" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Suriya" />
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" alt="Ajith" />
            </div>
            <div className="social-proof-text">
              <strong>Trusted by 140+ Entertainment Agencies</strong>
              <span>Managing over $85M+ in annual celebrity campaigns</span>
            </div>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="auth-form-pane">
          <div className="auth-form-card">
            <div className="auth-header-block">
              <h3>Sign In to Zenve CRM</h3>
              <p>Welcome back! Access your talent management command center.</p>
            </div>

            {/* Quick 1-Click Demo Logins */}
            <div className="demo-login-box">
              <span className="demo-login-label">⚡ Quick 1-Click Demo Access</span>
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
                  <Clapperboard size={13} color="#06B6D4" /> Manager Demo
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#F43F5E',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
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
                    Forgot Password?
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
                  <span>Keep me signed in for 30 days</span>
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
              <span>Don't have an agency account?</span>
              <Link to="/register">Create Account</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="modal-close-btn" onClick={() => setShowForgotModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {forgotSubmitted ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
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
                    Enter your registered email address and we'll send you an encrypted token to reset your password.
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

