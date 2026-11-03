import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Crown, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopCelebrities() {
  const { celebrities = [], campaigns = [], shoots = [], openModal } = useCrm();

  // Compute live campaign counts per celebrity
  const celebCounts = {};
  (campaigns || []).forEach((cmp) => {
    let name = (cmp.celebrity || cmp.celebrityName || '').toLowerCase().trim();
    if (!name && cmp.description && cmp.description.includes('-')) {
      name = cmp.description.split('-')[0].trim().toLowerCase();
    }
    if (name) {
      celebCounts[name] = (celebCounts[name] || 0) + 1;
    }
  });

  // Compute live shoots count per celebrity
  const shootCounts = {};
  (shoots || []).forEach((s) => {
    const name = (s.celebrity || s.celebrityName || '').toLowerCase().trim();
    if (name) {
      shootCounts[name] = (shootCounts[name] || 0) + 1;
    }
  });

  const sorted = [...celebrities]
    .map((celeb) => {
      const cName = (celeb.name || '').toLowerCase().trim();
      const cCount = celebCounts[cName] || (celeb.campaignsCount > 0 ? celeb.campaignsCount : 0);
      const sCount = shootCounts[cName] || 0;
      const totalScore = cCount * 2 + sCount;
      return {
        ...celeb,
        campaignsCount: cCount,
        shootsCount: sCount,
        score: totalScore
      };
    })
    .sort((a, b) => b.score - a.score || b.campaignsCount - a.campaignsCount);

  return (
    <div className="crm-card" style={{ flex: 1.1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Crown size={16} color="var(--primary)" />
          <span>Top Celebrities by Activity</span>
        </div>
        <Link to="/celebrities" style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600 }}>
          View All
        </Link>
      </div>

      <div className="top-celebrities-list">
        {sorted.slice(0, 4).map((celeb, idx) => {
          let label = `${celeb.campaignsCount} campaigns`;
          if (celeb.campaignsCount > 0 && celeb.shootsCount > 0) {
            label = `${celeb.campaignsCount} campaign • ${celeb.shootsCount} shoot${celeb.shootsCount > 1 ? 's' : ''}`;
          } else if (celeb.campaignsCount === 0 && celeb.shootsCount > 0) {
            label = `${celeb.shootsCount} scheduled shoot${celeb.shootsCount > 1 ? 's' : ''}`;
          } else if (celeb.campaignsCount === 0 && celeb.shootsCount === 0) {
            label = 'Available for booking';
          }

          return (
            <div key={celeb.id} className="top-celeb-item">
              <span className={`rank-badge ${idx === 0 ? 'top-rank' : ''}`}>
                {idx + 1}
              </span>
              <img
                src={celeb.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={celeb.name}
                className="top-celeb-avatar"
              />
              <div className="top-celeb-info">
                <span className="top-celeb-name">{celeb.name}</span>
                <span className="top-celeb-campaigns">{label}</span>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '3px 7px', fontSize: '0.68rem' }}
                title={`Book shoot for ${celeb.name}`}
                onClick={() => openModal('scheduleShoot', { celebrity: celeb.name })}
              >
                <CalendarPlus size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
