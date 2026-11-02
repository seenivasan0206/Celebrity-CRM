import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import { useNavigate } from 'react-router-dom';
import ChangeManagerPhotoModal from '../components/ChangeManagerPhotoModal';
import { MANAGER_PHOTOS_MAP, getManagerPhoto } from '../data/managerPhotos';
import {
  Users,
  Building2,
  Star,
  Search,
  UserPlus,
  ShieldCheck,
  Mail,
  Phone,
  Copy,
  Check,
  Camera,
  X
} from 'lucide-react';

// Guaranteed local high-resolution portrait paths served directly by the application
export const DEFAULT_MANAGER_PHOTOS = {
  1: '/images/managers/1.jpg',
  2: '/images/managers/2.jpg',
  3: '/images/managers/3.jpg',
  4: '/images/managers/4.jpg',
  5: '/images/managers/5.jpg',
  6: '/images/managers/6.jpg',
  7: '/images/managers/7.jpg',
  8: '/images/managers/8.jpg',
  9: '/images/managers/9.jpg',
  10: '/images/managers/10.jpg',
  11: '/images/managers/11.jpg',
  12: '/images/managers/12.jpg',
  13: '/images/managers/13.jpg',
  14: '/images/managers/14.jpg',
  'john doe': '/images/managers/1.jpg',
  'sarah jenkins': '/images/managers/2.jpg',
  'vikram rathore': '/images/managers/3.jpg',
  'priya sunder': '/images/managers/4.jpg',
  'arjun verma': '/images/managers/5.jpg',
  'ananya sen': '/images/managers/6.jpg',
  'rohan mehta': '/images/managers/7.jpg',
  'meera nambiar': '/images/managers/8.jpg',
  'kavita krishnan': '/images/managers/9.jpg',
  'devendra singhania': '/images/managers/10.jpg',
  'tara alagappan': '/images/managers/11.jpg',
  'karthik sundaram': '/images/managers/12.jpg',
  'rhea chawla': '/images/managers/13.jpg',
  'siddharth roy': '/images/managers/14.jpg'
};

// High-resolution online fallback portraits
export const ONLINE_BACKUP_PHOTOS = {
  1: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  4: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  5: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  6: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  7: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  8: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
  9: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
  10: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  11: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  12: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  13: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
  14: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
};

export const resolvePhoto = (mgr) => {
  if (mgr?.photo && (mgr.photo.startsWith('data:') || mgr.photo.startsWith('blob:'))) {
    return mgr.photo;
  }
  if (mgr?.id && MANAGER_PHOTOS_MAP[mgr.id]) {
    return MANAGER_PHOTOS_MAP[mgr.id];
  }
  const nameKey = (mgr?.name || '').toLowerCase().trim();
  if (MANAGER_PHOTOS_MAP[nameKey]) {
    return MANAGER_PHOTOS_MAP[nameKey];
  }
  if (mgr?.photo && mgr.photo.startsWith('/images/')) {
    return mgr.photo;
  }
  return getManagerPhoto(mgr?.id || 1);
};

// Resilient visual avatar component with automatic modern gradient fallback
function ManagerAvatar({ mgr, onAvatarClick }) {
  const [photoSrc, setPhotoSrc] = useState(() => resolvePhoto(mgr));
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setPhotoSrc(resolvePhoto(mgr));
    setImgFailed(false);
  }, [mgr?.photo, mgr?.id, mgr?.name]);

  const initials = (mgr?.name || 'TM')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'TM';

  // Distinct modern gradients for initials fallback
  const gradients = [
    'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
    'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    'linear-gradient(135deg, #10B981 0%, #047857 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
    'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
  ];
  const gradient = gradients[(mgr?.id || 1) % gradients.length];

  const handleImgError = () => {
    const directPath = `/images/managers/${mgr?.id || 1}.jpg`;
    if (photoSrc !== directPath) {
      setPhotoSrc(directPath);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div
      className="manager-photo-wrap"
      onClick={onAvatarClick}
      title="Click to view or change profile photo"
    >
      {!imgFailed && photoSrc ? (
        <img
          src={photoSrc}
          alt={mgr?.name || 'Talent Manager'}
          className="manager-photo-img"
          onError={handleImgError}
          loading="eager"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: gradient,
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '0.04em',
            borderRadius: '14px',
            userSelect: 'none'
          }}
        >
          {initials}
        </div>
      )}
      <div className="manager-photo-hover-overlay">
        <Camera size={16} />
        <span>Change</span>
      </div>
      <span className="manager-online-dot" title="Active Liaison" />
    </div>
  );
}

export default function Managers() {
  const { theme } = useAuth();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  const {
    managers,
    addToast,
    setSearchQuery: setGlobalSearchQuery,
    updateManagerPhoto
  } = useCrm();

  const [selectedAgency, setSelectedAgency] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedManagerForPhoto, setSelectedManagerForPhoto] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Distinct agencies
  const agencies = useMemo(() => {
    const list = Array.from(new Set((managers || []).map((m) => m.agency).filter(Boolean)));
    return ['All', ...list];
  }, [managers]);

  // Total represented talents count across all managers
  const totalTalentsCount = useMemo(() => {
    const unique = new Set();
    (managers || []).forEach((m) => {
      const list = m.representedTalents || m.assignedCelebrities || [];
      list.forEach((t) => unique.add(t));
    });
    return unique.size;
  }, [managers]);

  // Filtered managers
  const filteredManagers = useMemo(() => {
    return (managers || []).filter((m) => {
      const matchesAgency = selectedAgency === 'All' || m.agency === selectedAgency;
      const q = search.toLowerCase().trim();
      const talents = m.representedTalents || m.assignedCelebrities || [];
      const matchesSearch =
        !q ||
        (m.name || '').toLowerCase().includes(q) ||
        (m.agency || '').toLowerCase().includes(q) ||
        (m.role || m.title || '').toLowerCase().includes(q) ||
        talents.some((t) => (t || '').toLowerCase().includes(q));

      return matchesAgency && matchesSearch;
    });
  }, [managers, selectedAgency, search]);

  const handleInviteLiaison = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('https://zenvecrm.io/invite/join-agency-team');
    }
    if (addToast) {
      addToast('Manager invitation link generated & copied to clipboard!', 'info');
    }
  };

  const handleCopyEmail = (e, mgr) => {
    e.preventDefault();
    e.stopPropagation();
    if (!mgr.email) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(mgr.email);
    }
    setCopiedId(mgr.id);
    if (addToast) {
      addToast(`Email copied: ${mgr.email}`, 'info');
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCelebrityClick = (celebName) => {
    if (setGlobalSearchQuery) {
      setGlobalSearchQuery(celebName);
    }
    navigate('/celebrities');
  };

  return (
    <div className="managers-page-wrapper">
      {/* Scoped Dynamic Styles */}
      <style>{`
        .managers-page-wrapper {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* KPI Banner */
        .managers-kpi-banner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .managers-kpi-banner {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .managers-kpi-banner {
            grid-template-columns: 1fr;
          }
        }

        .manager-kpi-card {
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: ${isLight ? '0 1px 3px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.3)'};
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .manager-kpi-card:hover {
          transform: translateY(-2px);
          border-color: ${isLight ? '#cbd5e1' : '#374151'};
          box-shadow: ${isLight ? '0 6px 16px rgba(0,0,0,0.08)' : '0 8px 20px rgba(0,0,0,0.45)'};
        }

        .manager-kpi-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .manager-kpi-meta {
          display: flex;
          flex-direction: column;
        }

        .manager-kpi-label {
          font-size: 0.70rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
        }

        .manager-kpi-value {
          font-size: 1.38rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.2;
          margin-top: 2px;
          font-family: var(--font-display);
        }

        /* Filter Toolbar */
        .managers-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .managers-filter-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .manager-filter-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 15px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .manager-filter-pill-btn:hover {
          border-color: var(--border-medium);
          color: var(--text-main);
          background: ${isLight ? '#f8fafc' : '#172033'};
        }

        .manager-filter-pill-btn.active {
          background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
        }

        /* Search Box */
        .managers-search-box {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 270px;
          flex: 1;
          max-width: 380px;
        }

        .managers-search-input {
          width: 100%;
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          border-radius: 12px;
          padding: 8px 34px 8px 36px;
          font-size: 0.83rem;
          color: var(--text-main);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .managers-search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .managers-search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-dim);
          pointer-events: none;
        }

        .managers-search-clear {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .managers-search-clear:hover {
          color: var(--text-main);
        }

        /* Responsive 3-Column Grid */
        .managers-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        @media (max-width: 1140px) {
          .managers-cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .managers-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Manager Profile Card */
        .manager-profile-card {
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-shadow: ${isLight ? '0 2px 10px rgba(0, 0, 0, 0.05)' : '0 8px 24px rgba(0, 0, 0, 0.4)'};
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          position: relative;
        }

        .manager-profile-card:hover {
          transform: translateY(-4px);
          border-color: ${isLight ? '#cbd5e1' : '#374151'};
          box-shadow: ${isLight ? '0 12px 28px rgba(0, 0, 0, 0.1)' : '0 16px 36px rgba(0, 0, 0, 0.55)'};
        }

        /* Header Row inside Card */
        .manager-card-top {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        /* Visible Photo Container */
        .manager-photo-wrap {
          width: 68px;
          height: 68px;
          min-width: 68px;
          min-height: 68px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          border: 2px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          background: ${isLight ? '#f8fafc' : '#1e293b'};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .manager-photo-wrap:hover {
          transform: scale(1.04);
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
        }

        .manager-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 14px;
        }

        .manager-photo-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 10px;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.2s ease;
          border-radius: 14px;
          gap: 2px;
        }

        .manager-photo-wrap:hover .manager-photo-hover-overlay {
          opacity: 1;
        }

        .manager-online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid ${isLight ? '#ffffff' : '#111827'};
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
          z-index: 2;
        }

        /* Manager Meta */
        .manager-info-meta {
          flex: 1;
          min-width: 0;
        }

        .manager-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .manager-name-text {
          font-size: 1.10rem;
          font-weight: 700;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .manager-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          font-size: 0.68rem;
          font-weight: 700;
          border-radius: 9999px;
          background: ${isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)'};
          color: #10b981;
          border: 1px solid ${isLight ? '#a7f3d0' : 'rgba(16, 185, 129, 0.3)'};
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .manager-role-text {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-top: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .manager-agency-text {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: var(--text-dim);
          margin-top: 4px;
        }

        /* Contact Details */
        .manager-contact-panel {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: ${isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 16px;
          font-size: 0.78rem;
        }

        .manager-contact-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--text-muted);
          text-decoration: none;
        }

        .manager-contact-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .manager-contact-left:hover {
          color: var(--primary);
        }

        .manager-copy-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 3px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .manager-copy-btn:hover {
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
        }

        /* Talents Section */
        .manager-talents-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .manager-talents-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
        }

        .manager-talents-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .manager-celeb-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          font-size: 0.74rem;
          font-weight: 600;
          border-radius: 9999px;
          background: ${isLight ? '#f1f5f9' : '#1a243d'};
          color: var(--text-main);
          border: 1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'};
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .manager-celeb-chip:hover {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          border-color: rgba(99, 102, 241, 0.35);
          transform: translateY(-1px);
        }

        /* Empty State */
        .managers-empty-state {
          text-align: center;
          padding: 56px 20px;
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px dashed ${isLight ? '#cbd5e1' : '#334155'};
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
      `}</style>

      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <h2>Talent Managers & Agency Liaisons ({(managers || []).length})</h2>
          <p>Key agency executives, artist reps, and endorsement agents</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={handleInviteLiaison}
        >
          <UserPlus size={16} /> Invite Liaison
        </button>
      </div>

      {/* KPI Metrics Banner */}
      <div className="managers-kpi-banner">
        <div className="manager-kpi-card">
          <div
            className="manager-kpi-icon"
            style={{
              background: isLight ? '#eef2ff' : 'rgba(99, 102, 241, 0.12)',
              color: '#6366f1'
            }}
          >
            <Users size={21} />
          </div>
          <div className="manager-kpi-meta">
            <span className="manager-kpi-label">Active Liaisons</span>
            <span className="manager-kpi-value">{(managers || []).length}</span>
          </div>
        </div>

        <div className="manager-kpi-card">
          <div
            className="manager-kpi-icon"
            style={{
              background: isLight ? '#ecfeff' : 'rgba(6, 182, 212, 0.12)',
              color: '#06b6d4'
            }}
          >
            <Building2 size={21} />
          </div>
          <div className="manager-kpi-meta">
            <span className="manager-kpi-label">Partner Agencies</span>
            <span className="manager-kpi-value">{agencies.length - 1}</span>
          </div>
        </div>

        <div className="manager-kpi-card">
          <div
            className="manager-kpi-icon"
            style={{
              background: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)',
              color: '#f59e0b'
            }}
          >
            <Star size={21} />
          </div>
          <div className="manager-kpi-meta">
            <span className="manager-kpi-label">Represented Talents</span>
            <span className="manager-kpi-value">{totalTalentsCount}</span>
          </div>
        </div>

        <div className="manager-kpi-card">
          <div
            className="manager-kpi-icon"
            style={{
              background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
              color: '#10b981'
            }}
          >
            <ShieldCheck size={21} />
          </div>
          <div className="manager-kpi-meta">
            <span className="manager-kpi-label">SLA Response</span>
            <span className="manager-kpi-value">&lt; 2 hrs</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="managers-toolbar">
        <div className="managers-filter-pills">
          {agencies.map((agency) => {
            const count =
              agency === 'All'
                ? (managers || []).length
                : (managers || []).filter((m) => m.agency === agency).length;

            return (
              <button
                key={agency}
                type="button"
                className={`manager-filter-pill-btn ${selectedAgency === agency ? 'active' : ''}`}
                onClick={() => setSelectedAgency(agency)}
              >
                <span>{agency === 'All' ? 'All Agencies' : agency}</span>
                <span
                  style={{
                    fontSize: '0.70rem',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: selectedAgency === agency ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-card-alt)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="managers-search-box">
          <Search size={15} className="managers-search-icon" />
          <input
            type="text"
            className="managers-search-input"
            placeholder="Filter by name, talent, agency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="managers-search-clear"
              onClick={() => setSearch('')}
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Managers Cards Grid */}
      {filteredManagers.length === 0 ? (
        <div className="managers-empty-state">
          <Users size={38} color="var(--text-dim)" style={{ opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            No talent managers found
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', maxWidth: '340px' }}>
            {search
              ? `No liaison matching "${search}". Try adjusting your keywords or agency filter.`
              : 'There are no talent managers registered under this agency.'}
          </p>
          {(search || selectedAgency !== 'All') && (
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
              onClick={() => {
                setSearch('');
                setSelectedAgency('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="managers-cards-grid">
          {filteredManagers.map((mgr) => {
            const talents = mgr.representedTalents || mgr.assignedCelebrities || [];

            return (
              <div key={mgr.id} className="manager-profile-card">
                {/* Top Section: Photo & Identity Meta */}
                <div>
                  <div className="manager-card-top">
                    {/* Resilient Avatar Component with Initials Fallback */}
                    <ManagerAvatar
                      mgr={mgr}
                      onAvatarClick={() => {
                        setSelectedManagerForPhoto(mgr);
                        setIsPhotoModalOpen(true);
                      }}
                    />

                    <div className="manager-info-meta">
                      <div className="manager-name-row">
                        <h3 className="manager-name-text" title={mgr.name}>
                          {mgr.name}
                        </h3>
                        <span className="manager-status-badge">
                          <ShieldCheck size={11} /> ACTIVE
                        </span>
                      </div>

                      <div className="manager-role-text" title={mgr.role || mgr.title}>
                        {mgr.role || mgr.title || 'Senior VP of Talent'}
                      </div>

                      <div className="manager-agency-text" title={mgr.agency}>
                        <Building2 size={12} />
                        <span>{mgr.agency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Panel */}
                  <div className="manager-contact-panel">
                    <div className="manager-contact-item">
                      <a
                        href={`mailto:${mgr.email}`}
                        className="manager-contact-left"
                        title="Send email"
                      >
                        <Mail size={13} color="var(--primary)" />
                        <span>{mgr.email}</span>
                      </a>
                      <button
                        type="button"
                        className="manager-copy-btn"
                        onClick={(e) => handleCopyEmail(e, mgr)}
                        title="Copy email address"
                      >
                        {copiedId === mgr.id ? (
                          <Check size={13} color="#10B981" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>

                    <div className="manager-contact-item">
                      <a
                        href={`tel:${mgr.phone}`}
                        className="manager-contact-left"
                        title="Call phone"
                      >
                        <Phone size={13} color="var(--accent-emerald)" />
                        <span>{mgr.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Represented Talents */}
                <div className="manager-talents-section">
                  <div className="manager-talents-header">
                    <span>Represented Talents</span>
                    <span>{talents.length} Talents</span>
                  </div>

                  <div className="manager-talents-chips">
                    {talents.map((celebName) => (
                      <button
                        key={celebName}
                        type="button"
                        className="manager-celeb-chip"
                        onClick={() => handleCelebrityClick(celebName)}
                        title={`View ${celebName} in Celebrity Directory`}
                      >
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        <span>{celebName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Change Photo Modal */}
      {isPhotoModalOpen && selectedManagerForPhoto && (
        <ChangeManagerPhotoModal
          manager={selectedManagerForPhoto}
          isOpen={isPhotoModalOpen}
          onClose={() => {
            setIsPhotoModalOpen(false);
            setSelectedManagerForPhoto(null);
          }}
          onSavePhoto={(id, newPhotoUrl) => {
            if (updateManagerPhoto) {
              updateManagerPhoto(id, newPhotoUrl);
            }
            if (addToast) {
              addToast('Profile photo updated successfully!', 'success');
            }
          }}
        />
      )}
    </div>
  );
}
