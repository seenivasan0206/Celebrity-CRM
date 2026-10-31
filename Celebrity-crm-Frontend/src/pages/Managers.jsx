import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Mail, Phone, Building, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Managers() {
  const { managers, addToast, setSearchQuery } = useCrm();
  const navigate = useNavigate();

  const handleInviteManager = () => {
    navigator.clipboard?.writeText?.('https://zenvecrm.io/invite/join-agency-team');
    if (addToast) {
      addToast('Manager invitation link generated & copied to clipboard!', 'info');
    }
  };

  const handleCelebrityClick = (celebName) => {
    if (setSearchQuery) {
      setSearchQuery(celebName);
    }
    navigate('/celebrities');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Talent Managers & Agency Liaisons ({(managers || []).length})</h2>
          <p>Key agency executives, artist reps, and endorsement agents</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={handleInviteManager}
        >
          <Plus size={16} /> Invite Manager
        </button>
      </div>

      <div className="managers-grid">
        {(managers || []).map((mgr) => {
          const initials = (mgr.name || 'M')
            .split(' ')
            .map((n) => n[0])
            .join('');
          const talents = mgr.assignedCelebrities || mgr.representedTalents || [];

          return (
            <div key={mgr.id} className="manager-card">
              <div className="manager-header">
                {mgr.photo || mgr.avatar ? (
                  <img
                    src={mgr.photo || mgr.avatar}
                    alt={mgr.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '2px solid var(--border-medium)'
                    }}
                  />
                ) : (
                  <div className="manager-avatar-initial">{initials}</div>
                )}
                <div className="manager-meta">
                  <h3>{mgr.name}</h3>
                  <span>{mgr.title || mgr.role || 'Executive Talent Manager'}</span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: 'var(--text-dim)',
                      marginTop: '2px'
                    }}
                  >
                    <Building size={12} /> {mgr.agency}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}
              >
                <a
                  href={`mailto:${mgr.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                  title="Send email to manager"
                >
                  <Mail size={14} color="var(--primary)" />
                  <span>{mgr.email}</span>
                </a>
                <a
                  href={`tel:${mgr.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                  title="Call manager"
                >
                  <Phone size={14} color="var(--accent-emerald)" />
                  <span>{mgr.phone}</span>
                </a>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '6px'
                  }}
                >
                  Represented Talents
                </span>
                <div className="manager-celeb-chips">
                  {talents.map((celebName) => (
                    <button
                      key={celebName}
                      type="button"
                      className="celeb-chip"
                      onClick={() => handleCelebrityClick(celebName)}
                      style={{ cursor: 'pointer', background: 'var(--bg-card-alt)' }}
                      title={`View ${celebName} profile`}
                    >
                      <Star
                        size={10}
                        color="#F59E0B"
                        style={{ display: 'inline', marginRight: '4px' }}
                      />
                      {celebName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
