import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import { useNavigate } from 'react-router-dom';
import ChangeManagerPhotoModal from '../components/ChangeManagerPhotoModal';
import InviteManagerModal from '../components/InviteManagerModal';
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
  X,
  Eye,
  Lock
} from 'lucide-react';

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
  if (mgr?.photo && (mgr.photo.startsWith('data:') || mgr.photo.startsWith('blob:') || mgr.photo.startsWith('http') || mgr.photo.startsWith('/images/'))) {
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

function ManagerAvatar({ mgr, onAvatarClick, canEdit }) {
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
      title={canEdit ? 'Click to manage profile photo' : 'Click to view manager dossier'}
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
            background: 'var(--c-primary-dim)',
            color: 'var(--primary)',
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
        {canEdit ? (
          <>
            <Camera size={16} />
            <span>Change</span>
          </>
        ) : (
          <>
            <Eye size={16} />
            <span>View</span>
          </>
        )}
      </div>
      <span className="manager-online-dot" title="Active Liaison" />
    </div>
  );
}

export default function Managers() {
  const { user, theme } = useAuth();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  const userRole = (user?.role || '').toUpperCase();
  const isAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';

  const {
    managers,
    addToast,
    setSearchQuery: setGlobalSearchQuery,
    updateManagerPhoto,
    deleteManager,
    addManager
  } = useCrm();

  const [selectedAgency, setSelectedAgency] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedManagerForPhoto, setSelectedManagerForPhoto] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const agencies = useMemo(() => {
    const list = Array.from(new Set((managers || []).map((m) => m.agency).filter(Boolean)));
    return ['All', ...list];
  }, [managers]);

  const totalTalentsCount = useMemo(() => {
    const unique = new Set();
    (managers || []).forEach((m) => {
      const list = m.representedTalents || m.assignedCelebrities || [];
      list.forEach((t) => unique.add(t));
    });
    return unique.size;
  }, [managers]);

  const filteredManagers = useMemo(() => {
    return (managers || []).filter((mgr) => {
      const matchesAgency = selectedAgency === 'All' || mgr.agency === selectedAgency;
      if (!matchesAgency) return false;

      if (!search.trim()) return true;

      const q = search.toLowerCase().trim();
      const inName = (mgr.name || '').toLowerCase().includes(q);
      const inAgency = (mgr.agency || '').toLowerCase().includes(q);
      const inRole = (mgr.role || mgr.title || '').toLowerCase().includes(q);
      const inEmail = (mgr.email || '').toLowerCase().includes(q);
      const inPhone = (mgr.phone || '').toLowerCase().includes(q);
      const inTalents = (mgr.representedTalents || mgr.assignedCelebrities || []).some((t) =>
        t.toLowerCase().includes(q)
      );

      return inName || inAgency || inRole || inEmail || inPhone || inTalents;
    });
  }, [managers, selectedAgency, search]);

  const handleInviteLiaison = () => {
    setIsInviteModalOpen(true);
  };

  const handleAddNewManager = (newManager) => {
    if (addManager) {
      addManager(newManager);
    } else {
      localStorage.setItem('zenve_managers', JSON.stringify([newManager, ...(managers || [])]));
      if (addToast) addToast(`Manager ${newManager.name} added successfully!`, 'success');
    }
    setSelectedAgency('All');
    setSearch('');
  };

  const handleCopyEmail = (e, mgr) => {
    e.stopPropagation();
    if (!mgr?.email) return;
    navigator.clipboard?.writeText(mgr.email);
    setCopiedId(mgr.id);
    if (addToast) {
      addToast(`Copied ${mgr.email} to clipboard`, 'success');
    }
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleCelebrityClick = (celebName) => {
    if (setGlobalSearchQuery) {
      setGlobalSearchQuery(celebName);
    }
    navigate('/celebrities');
  };

  return (
    <div className="managers-page-wrapper">
      <style>{`
        .managers-page-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

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
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .manager-kpi-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-medium);
          box-shadow: var(--shadow-md);
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
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .manager-filter-pill-btn:hover {
          border-color: var(--border-medium);
          color: var(--text-main);
          background: var(--bg-card-alt);
        }

        .manager-filter-pill-btn.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
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
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 8px 34px 8px 36px;
          font-size: 0.83rem;
          color: var(--text-main);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .managers-search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--c-primary-dim);
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
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-shadow: var(--shadow-sm);
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          position: relative;
        }

        .manager-profile-card:hover {
          transform: translateY(-3px);
          border-color: var(--border-medium);
          box-shadow: var(--shadow-md);
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
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          border: 1px solid var(--border-color);
          background: var(--bg-card-alt);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .manager-photo-wrap:hover {
          transform: scale(1.02);
          box-shadow: var(--shadow-md);
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
          background: var(--accent);
          border: 2px solid var(--bg-card);
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
          font-size: 1.05rem;
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
          background: var(--c-accent-dim);
          color: var(--accent);
          border: 1px solid var(--border-color);
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
          background: var(--bg-card-alt);
          border: 1px solid var(--border-color);
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
          background: var(--c-primary-dim);
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
          background: var(--bg-card-alt);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .manager-celeb-chip:hover {
          background: var(--c-primary-dim);
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        /* Empty State */
        .managers-empty-state {
          text-align: center;
          padding: 56px 20px;
          background: var(--bg-card);
          border: 1px dashed var(--border-color);
          border-radius: 16px;
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
        {isAdmin ? (
          <button
            type="button"
            className="btn-primary"
            onClick={handleInviteLiaison}
          >
            <UserPlus size={16} /> Invite Manager
          </button>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              fontSize: '0.74rem',
              color: 'var(--text-muted)'
            }}
          >
            <Lock size={12} color="var(--primary)" />
            <span>Directory Managed by Admin</span>
          </div>
        )}
      </div>

      {/* KPI Metrics Banner */}
      <div className="managers-kpi-banner">
        <div className="manager-kpi-card">
          <div
            className="manager-kpi-icon"
            style={{
              background: 'var(--c-primary-dim)',
              color: 'var(--primary)'
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
              background: 'var(--c-secondary-dim)',
              color: 'var(--secondary)'
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
              background: 'var(--c-accent-dim)',
              color: 'var(--accent)'
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
              background: 'var(--c-primary-dim)',
              color: 'var(--primary)'
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
            const isSelf = Boolean(
              (user?.email && mgr?.email && user.email.toLowerCase() === mgr.email.toLowerCase()) ||
              (user?.name && mgr?.name && user.name.toLowerCase() === mgr.name.toLowerCase()) ||
              (user?.username && mgr?.email && mgr.email.toLowerCase().includes(user.username.toLowerCase()))
            );
            const canEdit = isAdmin || isSelf;

            return (
              <div key={mgr.id} className="manager-profile-card">
                {/* Top Section: Photo & Identity Meta */}
                <div>
                  <div className="manager-card-top">
                    <ManagerAvatar
                      mgr={mgr}
                      canEdit={canEdit}
                      onAvatarClick={() => {
                        setSelectedManagerForPhoto(mgr);
                        setIsPhotoModalOpen(true);
                      }}
                    />

                    <div className="manager-info-meta">
                      <div className="manager-name-row">
                        <h3 className="manager-name-text" style={{ cursor: "pointer" }} title={`View ${mgr.name}'s profile`} onClick={() => { setSelectedManagerForPhoto(mgr); setIsPhotoModalOpen(true); }}>
                          {mgr.name}
                        </h3>
                        <span className="manager-status-badge">
                          <ShieldCheck size={11} /> ACTIVE
                        </span>
                        {isSelf && (
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              color: 'var(--primary)',
                              background: 'var(--primary-subtle)',
                              padding: '1px 6px',
                              borderRadius: '9999px'
                            }}
                          >
                            You
                          </span>
                        )}
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
                          <Check size={13} color="var(--accent)" />
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
                        <Phone size={13} color="var(--accent)" />
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
                        <Star size={11} fill="var(--primary)" color="var(--primary)" />
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

      {/* Invite / Add Manager Modal */}
      <InviteManagerModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onAddManager={handleAddNewManager}
        currentAgency={selectedAgency}
        existingAgencies={agencies}
      />

      {/* Change Photo / Dossier Modal */}
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
              updateManagerPhoto(id, newPhotoUrl, user);
            }
          }}
          onDeleteManager={(id) => {
            if (deleteManager) {
              deleteManager(id, user);
            }
          }}
        />
      )}
    </div>
  );
}
