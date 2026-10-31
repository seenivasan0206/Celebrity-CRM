import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut,
  CheckCheck,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const { user, logout, theme, toggleTheme } = useAuth();
  const { searchQuery, setSearchQuery, notifications, markAllNotificationsRead } = useCrm();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="crm-header">
      <div className="header-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="header-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search celebrities, campaigns, contracts, shoots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear search"
            >
              <X size={15} />
            </button>
          ) : (
            <span className="search-shortcut">⌘K</span>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Date badge */}
        <div className="date-badge">
          <Calendar size={14} color="var(--primary)" />
          <span>{todayFormatted}</span>
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          className="header-action-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light Frost' : 'Dark Luxe'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="header-action-btn"
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowUserMenu(false);
            }}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-count" />}
          </button>

          {showNotifs && (
            <div className="notification-popover">
              <div className="notif-header">
                <h4>Notifications ({unreadCount} new)</h4>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      markAllNotificationsRead();
                      setShowNotifs(false);
                    }}
                  >
                    <CheckCheck size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`notif-card ${n.unread ? 'unread' : ''}`}>
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-text">{n.text}</span>
                    <span className="notif-time">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            type="button"
            className="header-user-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifs(false);
            }}
          >
            <div className="user-avatar-wrap">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
              />
              <span className="online-status-dot" />
            </div>
            <div className="user-meta-header">
              <span className="user-name-header">{user?.name || 'Admin'}</span>
              <span className="user-role-header">{user?.role || 'Administrator'}</span>
            </div>
            <ChevronDown size={14} color="var(--text-dim)" />
          </button>

          {showUserMenu && (
            <div className="user-menu-popover">
              <div className="popover-header">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
              <button
                type="button"
                className="popover-item"
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
              >
                <User size={16} /> Account Profile
              </button>
              <button
                type="button"
                className="popover-item"
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
              >
                <SettingsIcon size={16} /> CRM Preferences
              </button>
              <button
                type="button"
                className="popover-item danger"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
