import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import { User, Bell, Shield, Palette, Crown, Save, Check, Download, Zap, Lock } from 'lucide-react';

export default function Settings() {
  const { user, updateProfile, theme, toggleTheme } = useAuth();
  const { addToast } = useCrm();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin',
    email: user?.email || 'admin@zenvecrm.io',
    role: user?.role || 'System Administrator',
    agency: user?.agency || 'Zenve Global Entertainment'
  });

  // Sync with user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'Admin',
        email: user.email || 'admin@zenvecrm.io',
        role: user.role || 'System Administrator',
        agency: user.agency || 'Zenve Global Entertainment'
      });
    }
  }, [user]);

  // Security Form state
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Preferences state
  const [notifPreferences, setNotifPreferences] = useState({
    shootReminders: true,
    contractMilestones: true,
    campaignAlerts: true,
    castingSubmissions: false
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    addToast('Profile information successfully saved!', 'success');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!securityData.newPassword || securityData.newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'danger');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      addToast('New passwords do not match!', 'danger');
      return;
    }
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    addToast('Security password updated successfully!', 'success');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    addToast('Notification preferences updated!', 'success');
  };

  const handleUpgradePlan = () => {
    updateProfile({ plan: 'VIP Platinum Enterprise' });
    addToast('Upgraded to VIP Platinum Enterprise License!', 'success');
  };

  const handleDownloadInvoice = () => {
    addToast('Latest receipt & invoice downloaded (PDF)', 'info');
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
            type="button"
            className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} /> Profile & Agency
          </button>
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={16} /> Theme & Display
          </button>
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} /> Notifications
          </button>
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} /> Security & Password
          </button>
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'subscription' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscription')}
          >
            <Crown size={16} /> Subscription Tier
          </button>
        </div>

        <div>
          {/* TAB 1: PROFILE */}
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
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Email</label>
                    <input
                      type="email"
                      className="zenve-input"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="settings-form-grid">
                  <div className="form-group">
                    <label className="form-label">Executive Role</label>
                    <input
                      type="text"
                      className="zenve-input"
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agency / Production Company</label>
                    <input
                      type="text"
                      className="zenve-input"
                      value={profileData.agency}
                      onChange={(e) => setProfileData({ ...profileData, agency: e.target.value })}
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

          {/* TAB 2: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="settings-panel">
              <div className="settings-panel-title">
                <h3>Theme & Visual Display</h3>
                <p>Toggle between Dark Luxe and Light Frost UI themes with 1 click</p>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                  }}
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '22px',
                    borderRadius: '12px',
                    background: '#0B0F19',
                    color: '#FFFFFF',
                    border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    boxShadow: theme === 'dark' ? '0 0 20px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Dark Luxe (Recommended)</h4>
                    {theme === 'dark' && <Check size={20} color="var(--primary)" />}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Obsidian aesthetic with neon indigo accents, glass cards, and comfortable contrast for night sessions.
                  </p>
                </div>

                <div
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                  }}
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '22px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    border: theme === 'light' ? '2px solid var(--primary)' : '1px solid #CBD5E1',
                    cursor: 'pointer',
                    boxShadow: theme === 'light' ? '0 0 20px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Light Frost</h4>
                    {theme === 'light' && <Check size={20} color="var(--primary)" />}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Crisp daylight workspace with ultra-clean borders and high daytime contrast.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="settings-panel">
              <div className="settings-panel-title">
                <h3>Notification Preferences</h3>
                <p>Choose when and how Zenve CRM delivers updates and alerts</p>
              </div>

              <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label className="remember-check" style={{ fontSize: '0.9rem', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-card-alt)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>Shoot Schedule Reminders</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Notify 24 hours prior to call time and location dispatch</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPreferences.shootReminders}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, shootReminders: e.target.checked })}
                  />
                </label>

                <label className="remember-check" style={{ fontSize: '0.9rem', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-card-alt)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>Contract Milestone Alerts</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Receive alerts when talent contracts approach renewal or expiry</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPreferences.contractMilestones}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, contractMilestones: e.target.checked })}
                  />
                </label>

                <label className="remember-check" style={{ fontSize: '0.9rem', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-card-alt)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>Campaign Progress Reports</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Weekly brand deliverables and social reach updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPreferences.campaignAlerts}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, campaignAlerts: e.target.checked })}
                  />
                </label>

                <label className="remember-check" style={{ fontSize: '0.9rem', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-card-alt)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>Casting Call Submissions</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Instant notification when an audition portfolio is submitted</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPreferences.castingSubmissions}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, castingSubmissions: e.target.checked })}
                  />
                </label>

                <div>
                  <button type="submit" className="btn-primary">
                    <Save size={16} /> Save Notification Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="settings-panel">
              <div className="settings-panel-title">
                <h3>Security & Password</h3>
                <p>Manage your login credentials and two-factor authentication</p>
              </div>

              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="zenve-input"
                    placeholder="••••••••••••"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="zenve-input"
                    placeholder="Minimum 6 characters"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="zenve-input"
                    placeholder="Repeat new password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                  />
                </div>

                <div>
                  <button type="submit" className="btn-primary">
                    <Lock size={16} /> Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="settings-panel">
              <div className="settings-panel-title">
                <h3>Subscription & License</h3>
                <p>Enterprise membership status and active features</p>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                      <Crown size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user?.plan || 'Zenve VIP Enterprise'}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Active · Renews 28 Nov 2027</span>
                    </div>
                  </div>
                  <span className="badge badge-emerald">ACTIVE LICENSE</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Includes unlimited celebrity rosters, automated shoot dispatch, legal contract generation, and multi-agency collaboration.
                </p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="button" className="btn-primary" onClick={handleUpgradePlan}>
                    <Zap size={16} /> Upgrade to VIP Platinum
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleDownloadInvoice}>
                    <Download size={16} /> Download Tax Invoice (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
