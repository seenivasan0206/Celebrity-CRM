import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import { User, Bell, Shield, Palette, Crown, Save, Download, Zap, Lock, Sun, Moon } from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const { user, updateProfile, theme, toggleTheme } = useAuth();
  const { addToast } = useCrm();

  const userRole = (user?.role || '').toUpperCase();
  const isAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.fullName || 'Administrator',
    email: user?.email || 'admin@celebritycrm.com',
    role: user?.role || 'Executive Talent Manager',
    agency: user?.agency || 'Zenve Talent Network'
  });

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

  // Subscription state
  const [subscription, setSubscription] = useState({
    planName: user?.plan || 'Zenve VIP Enterprise',
    renewalDate: '28 Nov 2027',
    status: 'ACTIVE',
    description: 'Includes unlimited celebrity rosters, automated shoot dispatch, legal contract generation, and multi-agency collaboration.'
  });

  // Fetch live settings from Spring Boot backend on mount
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await api.settings.getAll();
        if (isMounted && res) {
          if (res.profile) {
            setProfileData({
              name: res.profile.name || res.profile.fullName || 'Administrator',
              email: res.profile.email || 'admin@celebritycrm.com',
              role: res.profile.role || 'ROLE_ADMIN',
              agency: res.profile.agencyName || res.profile.agency || 'Zenve Global Entertainment'
            });
          }
          if (res.notifications) {
            setNotifPreferences({
              shootReminders: res.notifications.shootReminders ?? res.notifications.shootScheduleReminders ?? true,
              contractMilestones: res.notifications.contractMilestones ?? res.notifications.contractMilestoneAlerts ?? true,
              campaignAlerts: res.notifications.campaignAlerts ?? res.notifications.campaignProgressReports ?? true,
              castingSubmissions: res.notifications.castingSubmissions ?? res.notifications.castingCallSubmissions ?? false
            });
          }
          if (res.subscription) {
            setSubscription({
              planName: res.subscription.planName || res.subscription.plan || 'Zenve VIP Enterprise',
              renewalDate: res.subscription.renewalDate || '28 Nov 2027',
              status: res.subscription.status || 'ACTIVE',
              description: res.subscription.description || 'Enterprise Active License'
            });
          }
        }
      } catch (err) {
        console.warn('Backend settings fetch failed, using local profile:', err.message);
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const effectiveRole = isAdmin ? profileData.role : (user?.role || profileData.role);
    const updatedPayload = {
      fullName: profileData.name,
      email: profileData.email,
      agencyName: profileData.agency,
      role: effectiveRole
    };
    try {
      await api.settings.updateProfile(updatedPayload);
      if (updateProfile) {
        updateProfile({ ...profileData, role: effectiveRole });
      }
      addToast('Profile information successfully saved to backend database!', 'success');
    } catch (err) {
      console.warn('Backend update failed:', err.message);
      if (updateProfile) {
        updateProfile({ ...profileData, role: effectiveRole });
      }
      addToast('Profile information saved locally!', 'info');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!securityData.newPassword || securityData.newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'danger');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      addToast('New passwords do not match!', 'danger');
      return;
    }
    try {
      await api.settings.changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
        confirmPassword: securityData.confirmPassword
      });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      addToast('Security password updated successfully in backend!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update password. Verify current password.', 'danger');
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    try {
      await api.settings.updateNotifications({
        shootReminders: notifPreferences.shootReminders,
        contractMilestones: notifPreferences.contractMilestones,
        campaignAlerts: notifPreferences.campaignAlerts,
        castingSubmissions: notifPreferences.castingSubmissions
      });
      addToast('Notification preferences persisted in database!', 'success');
    } catch (err) {
      console.warn('Backend notification update failed:', err.message);
      addToast('Notification preferences updated locally!', 'info');
    }
  };

  const handleUpgradePlan = async () => {
    const upgradedPlan = 'VIP Platinum Enterprise';
    try {
      await api.settings.updateSubscription({
        planName: upgradedPlan
      });
      setSubscription(prev => ({ ...prev, planName: upgradedPlan }));
      if (updateProfile) {
        updateProfile({ plan: upgradedPlan });
      }
      addToast(`Upgraded to ${upgradedPlan} License!`, 'success');
    } catch (err) {
      console.warn('Backend subscription update failed:', err.message);
      setSubscription(prev => ({ ...prev, planName: upgradedPlan }));
      if (updateProfile) {
        updateProfile({ plan: upgradedPlan });
      }
      addToast(`Upgraded to ${upgradedPlan} License (locally)!`, 'success');
    }
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
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Email</label>
                    <input
                      type="email"
                      className="zenve-input"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Executive Role</span>
                      {!isAdmin && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Lock size={11} /> Locked by Administrator
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      className="zenve-input"
                      value={profileData.role}
                      disabled={!isAdmin}
                      readOnly={!isAdmin}
                      style={!isAdmin ? { opacity: 0.75, cursor: 'not-allowed', background: 'var(--bg-card-alt)' } : {}}
                      onChange={(e) => isAdmin && setProfileData({ ...profileData, role: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agency / Production House</label>
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
                <p>Choose your preferred interface theme and layout density</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div
                  className={`crm-card ${theme === 'dark' ? 'active-border' : ''}`}
                  onClick={() => {
                    if (theme === 'light' && toggleTheme) {
                      toggleTheme();
                      api.settings.updateTheme({ mode: 'dark' }).catch(() => {});
                    }
                  }}
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: 'var(--c-surface)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Moon size={20} color="var(--primary)" />
                    <strong style={{ color: 'var(--text-main)' }}>Dark Luxe (Default)</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Cinematic midnight aesthetic with subtle elevation and high contrast readability.
                  </p>
                </div>

                <div
                  className={`crm-card ${theme === 'light' ? 'active-border' : ''}`}
                  onClick={() => {
                    if (theme === 'dark' && toggleTheme) {
                      toggleTheme();
                      api.settings.updateTheme({ mode: 'light' }).catch(() => {});
                    }
                  }}
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: 'var(--c-surface)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Sun size={20} color="var(--primary)" />
                    <strong style={{ color: 'var(--text-main)' }}>Light Frost</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Clean daylight editorial look with crisp white surfaces and soft shadows.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="settings-panel">
              <div className="settings-panel-title">
                <h3>Notifications & Alerts</h3>
                <p>Manage how and when you receive talent updates</p>
              </div>

              <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label className="remember-check" style={{ fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={notifPreferences.shootReminders}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, shootReminders: e.target.checked })}
                  />
                  <span>Shoot call sheet reminders (24 hours prior)</span>
                </label>

                <label className="remember-check" style={{ fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={notifPreferences.contractMilestones}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, contractMilestones: e.target.checked })}
                  />
                  <span>Contract renewal milestone alerts</span>
                </label>

                <label className="remember-check" style={{ fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={notifPreferences.campaignAlerts}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, campaignAlerts: e.target.checked })}
                  />
                  <span>Brand campaign deliverables & target updates</span>
                </label>

                <label className="remember-check" style={{ fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={notifPreferences.castingSubmissions}
                    onChange={(e) => setNotifPreferences({ ...notifPreferences, castingSubmissions: e.target.checked })}
                  />
                  <span>New audition self-tape submissions</span>
                </label>

                <div style={{ marginTop: '10px' }}>
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
                  background: 'var(--bg-card-alt)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--c-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Crown size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{subscription.planName}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>Active · Renews {subscription.renewalDate}</span>
                    </div>
                  </div>
                  <span className="badge badge-accent">{subscription.status} LICENSE</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  {subscription.description}
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
