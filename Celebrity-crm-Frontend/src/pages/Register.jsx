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
  ArrowRight,
  ShieldCheck,
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
      <div className="auth-form-card register-card">
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
          <h3>Create Account</h3>
          <p>Set up your agency portal to manage celebrities, campaigns & shoots</p>
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
                autoComplete="name"
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
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ margin: 0 }}>Portal Username *</label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Min 3 characters</span>
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
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Agency / Studio</label>
              <div className="form-input-wrap">
                <Building2 size={18} className="input-icon-left" />
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. Apex Talent"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="zenve-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{ paddingLeft: '14px' }}
              >
                <option value="Executive Talent Manager">Talent Manager</option>
                <option value="Casting Director">Casting Director</option>
                <option value="Agency VP / Partner">Agency Partner</option>
                <option value="Celebrity Business Head">Business Head</option>
                <option value="Producer / Studio Lead">Producer</option>
              </select>
            </div>
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
                autoComplete="new-password"
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
            {isLoading ? (
              <span>Setting up workspace...</span>
            ) : (
              <>
                <span>Create Agency Account</span>
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
          <span>Already have an account?</span>
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
