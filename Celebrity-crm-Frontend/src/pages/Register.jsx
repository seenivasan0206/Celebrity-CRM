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
  Sparkles,
  AtSign
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    agency: '',
    role: 'Executive Talent Manager',
    password: '',
    agree: true
  });
  const [usernameManual, setUsernameManual] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate suggested username from email or name
  const handleEmailChange = (val) => {
    setFormData((prev) => {
      const next = { ...prev, email: val };
      if (!usernameManual) {
        const raw = val.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
        next.username = raw.length >= 3 ? raw : (raw ? raw + '123' : '');
      }
      return next;
    });
  };

  const handleNameChange = (val) => {
    setFormData((prev) => {
      const next = { ...prev, name: val };
      if (!usernameManual && !prev.email) {
        const raw = val.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
        next.username = raw.length >= 3 ? raw : (raw ? raw + '123' : '');
      }
      return next;
    });
  };

  // Simple password strength calculation using 5-colour palette
  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return { percent: 0, text: '', color: 'transparent' };
    if (len < 6) return { percent: 30, text: 'Weak', color: 'var(--secondary)' };
    if (len < 10) return { percent: 65, text: 'Moderate', color: 'var(--primary)' };
    return { percent: 100, text: 'Strong (Optimal)', color: 'var(--accent)' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide your full name and work email.');
      return;
    }

    const cleanUsername = (formData.username || formData.email.split('@')[0] || '').trim();
    if (cleanUsername.length < 3) {
      setError('Username must contain at least 3 characters.');
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

    try {
      const res = await register({
        ...formData,
        username: cleanUsername
      });
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Unable to register account.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Registration failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page-wrapper auth-register-wrapper">
      <div className="auth-split-container">
        {/* Left Hero Pane */}
        <div className="auth-hero-pane">
          <div className="auth-hero-top">
            <div className="auth-brand-badge">
              <div className="icon-box">
                <Star size={20} fill="#ffffff" />
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
              <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80" alt="Talent 1" />
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Talent 2" />
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Talent 3" />
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
                background: 'var(--secondary-subtle)',
                border: '1px solid var(--secondary-border)',
                color: 'var(--text-main)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 500
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
                    onChange={(e) => handleNameChange(e.target.value)}
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
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0 }}>Portal Username *</label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Min 3 letters / numbers</span>
                </div>
                <div className="form-input-wrap" style={{ marginTop: '4px' }}>
                  <AtSign size={18} className="input-icon-left" />
                  <input
                    type="text"
                    className="zenve-input"
                    placeholder="e.g. karthik_exec"
                    required
                    value={formData.username}
                    onChange={(e) => {
                      setUsernameManual(true);
                      setFormData({ ...formData, username: e.target.value });
                    }}
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
                    <ArrowRight size={16} />
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
