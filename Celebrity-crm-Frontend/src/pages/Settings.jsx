import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import { User, Bell, Shield, Palette, Crown, Save, Check } from 'lucide-react';

export default function Settings() {
  const { user, updateProfile, theme, toggleTheme } = useAuth();
  const { addToast } = useCrm();

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin',
    email: user?.email || 'admin@zenvecrm.io',
    role: user?.role || 'System Administrator',
    agency: user?.agency || 'Zenve Global Entertainment'
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast('Profile information successfully saved!', 'success');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Portal Settings & Preferences</h2>
          <p>Customize your executive profile, notifications, and system aesthetics</p>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-nav">
          <button
            className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} /> Profile & Agency
          </button>
          <button
            className={`settings-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={16} /> Theme & Display
          </button>
          <button
            className={`settings-nav-btn ${activeTab === 'subscription' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscription')}
          >
            <Crown size={16} /> Subscription Tier
          </button>
        </div>

        <div>
          {activeTab === 'profile' && (
            <div className="settings-panel">
              <div className="settings-panel-title">
                <h3>Executive Profile</h3>
                <p>Update your personal and agency identity</p>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="settings-form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="zenve-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Email</label>
                    <input
                      type="email"
                      className="zenve-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="settings-form-grid">
                  <div className="form-group">
                    <label className="form-label">Executive Role</label>
                    <input
                      type="text"
                      className="zenve-input"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agency / Production Company</label>
                    <input
                      type="text"
                      className="zenve-input"
                      value={formData.agency}
                      onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" className="btn-primary">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-panel">
              <div className="settings-panel-title">
                <h3>Theme & Visual Display</h3>
                <p>Toggle between Dark Luxe and Light Frost UI themes</p>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div
                  onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '20px',
                    borderRadius: '12px',
                    background: '#0B0F19',
                    color: '#FFFFFF',
                    border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    boxShadow: theme === 'dark' ? '0 0 16px var(--primary-glow)' : 'none'
                  }}
                >
                  <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Dark Luxe {theme === 'dark' && <Check size={18} color="var(--primary)" />}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '6px' }}>
                    Obsidian aesthetic with neon indigo accents and glass blur.
                  </p>
                </div>

                <div
                  onClick={() => { if (theme !== 'light') toggleTheme(); }}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '20px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    border: theme === 'light' ? '2px solid var(--primary)' : '1px solid #CBD5E1',
                    cursor: 'pointer',
                    boxShadow: theme === 'light' ? '0 0 16px var(--primary-glow)' : 'none'
                  }}
                >
                  <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Light Frost {theme === 'light' && <Check size={18} color="var(--primary)" />}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '6px' }}>
                    Crisp daylight workspace with high contrast readability.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="settings-panel">
              <div className="settings-panel-title">
                <h3>Subscription & License</h3>
                <p>Enterprise membership status and active features</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                    <Crown size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Zenve VIP Enterprise</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Active · Renews 28 Nov 2027</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Includes unlimited celebrity rosters, automated shoot dispatch, legal contract generation, and multi-agency collaboration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

