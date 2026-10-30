import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agency: '',
    role: 'Executive Talent Manager',
    password: '',
    agree: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return { percent: 0, text: '', color: 'transparent' };
    if (len < 6) return { percent: 30, text: 'Weak', color: '#F43F5E' };
    if (len < 10) return { percent: 65, text: 'Moderate', color: '#F59E0B' };
    return { percent: 100, text: 'Strong (Optimal)', color: '#10B981' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide your name and work email.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!formData.agree) {
      setError('Please agree to Zenve CRM terms of service.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = register(formData);
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Unable to register account.');
      }
    }, 450);
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
              <Sparkles size={14} /> 14-Day Enterprise Trial
            </span>
          </div>

          <div className="auth-hero-center">
            <h1 className="hero-title">
              Power Your <span>Agency</span> with Hollywood-Grade Tools.
            </h1>
            <p className="hero-sub">
              Empower your talent team with centralized contract tracking, shoot production calendars,
              and live campaign analytics tailored for high-profile celebrities.
            </p>

            <div className="hero-features-list">
              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <ShieldCheck size={18} />
                </div>
                <span>Confidential NDA & Escrow Vault for Star Payouts</span>
              </div>
              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <Briefcase size={18} />
                </div>
                <span>Sync with OTT Giants (Netflix, Prime, Sony LIV, Disney+ Hotstar)</span>
              </div>
            </div>
          </div>

          <div className="auth-hero-bottom">
            <div className="avatar-stack">
              <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80" alt="Anirudh" />
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Trisha" />
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Samantha" />
            </div>
            <div className="social-proof-text">
              <strong>Join 450+ Top Talent Executives</strong>
              <span>Scale your representation with zero friction</span>
            </div>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="auth-form-pane">
          <div className="auth-form-card" style={{ maxWidth: '480px' }}>
            <div className="auth-header-block">
              <h3>Create Agency Account</h3>
              <p>Start orchestrating celebrity rosters and high-tier endorsements.</p>
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
                <label className="form-label">Full Name *</label>
                <div className="form-input-wrap">
                  <User size={18} className="input-icon-left" />
                  <input
                    type="text"
                    className="zenve-input"
                    placeholder="e.g. Karthik Raja"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Work Email *</label>
                <div className="form-input-wrap">
                  <Mail size={18} className="input-icon-left" />
                  <input
                    type="email"
                    className="zenve-input"
                    placeholder="karthik@agency.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Agency / Production House</label>
                <div className="form-input-wrap">
                  <Building2 size={18} className="input-icon-left" />
                  <input
                    type="text"
                    className="zenve-input"
                    placeholder="e.g. Apex Global Talent Management"
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Executive Role</label>
                <select
                  className="zenve-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Executive Talent Manager">Executive Talent Manager</option>
                  <option value="Casting Director">Casting Director</option>
                  <option value="Agency VP / Partner">Agency VP / Partner</option>
                  <option value="Celebrity Business Head">Celebrity Business Head</option>
                  <option value="Producer / Studio Lead">Producer / Studio Lead</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Create Password *</label>
                <div className="form-input-wrap">
                  <Lock size={18} className="input-icon-left" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="zenve-input"
                    placeholder="Minimum 6 characters"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {formData.password && (
                  <div className="strength-bar-container">
                    <div className="strength-bar-track">
                      <div
                        className="strength-bar-fill"
                        style={{
                          width: `${strength.percent}%`,
                          backgroundColor: strength.color
                        }}
                      />
                    </div>
                    <span className="strength-label" style={{ color: strength.color }}>
                      {strength.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-options-row">
                <label className="remember-check">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  />
                  <span>I agree to Zenve CRM Privacy & Security Policy</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-submit-auth"
                disabled={isLoading}
              >
                {isLoading ? 'Setting up workspace...' : (
                  <>
                    <span>Create Agency Portal</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch-footer">
              <span>Already have an account?</span>
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

