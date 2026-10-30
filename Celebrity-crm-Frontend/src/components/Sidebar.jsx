import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  FileText,
  Megaphone,
  Camera,
  Tv,
  Sparkles,
  Inbox,
  FolderLock,
  BarChart2,
  Settings,
  Crown,
  ChevronRight,
  LogOut,
  Star
} from 'lucide-react';

export default function Sidebar({ collapsed }) {
  const { user, logout } = useAuth();
  const { celebrities, shoots, campaigns, contracts, managers } = useCrm();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Celebrities', path: '/celebrities', icon: Users, badge: celebrities.length },
    { label: 'Managers', path: '/managers', icon: UserCheck, badge: managers.length },
    { label: 'Agencies', path: '/managers', icon: Building2 },
    { label: 'Contracts', path: '/contracts', icon: FileText, badge: contracts.length },
    { label: 'Campaigns', path: '/campaigns', icon: Megaphone, badge: campaigns.length },
    { label: 'Shoots', path: '/shoots', icon: Camera, badge: shoots.length },
    { label: 'OTT Projects', path: '/campaigns', icon: Tv },
    { label: 'Casting Calls', path: '/celebrities', icon: Sparkles },
    { label: 'Applications', path: '/celebrities', icon: Inbox },
    { label: 'Files', path: '/contracts', icon: FolderLock },
    { label: 'Reports', path: '/reports', icon: BarChart2 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className={`crm-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="brand-wrapper">
          <div className="brand-icon">
            <Star size={22} fill="#ffffff" />
          </div>
          <div className="brand-title">
            <h1>Zenve CRM</h1>
            <span>Talent Portal</span>
          </div>
        </Link>
      </div>

      <nav className="sidebar-content">
        <span className="nav-section-title">Navigation</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={19} className="nav-icon-only" />
              <span>{item.label}</span>
              {item.badge !== undefined && !collapsed && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="tier-card" onClick={() => navigate('/settings')}>
            <div className="tier-icon">
              <Crown size={18} />
            </div>
            <div className="tier-info">
              <span className="tier-name">{user?.plan || 'Premium VIP'}</span>
              <span className="tier-sub">Subscription is active</span>
            </div>
            <ChevronRight size={14} color="var(--text-dim)" />
          </div>
        )}

        <button
          className="sidebar-nav-item"
          style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
          onClick={() => {
            logout();
            navigate('/login');
          }}
          title={collapsed ? 'Log Out' : undefined}
        >
          <LogOut size={18} color="var(--accent-rose)" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

