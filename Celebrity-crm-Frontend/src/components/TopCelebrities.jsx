import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Crown, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopCelebrities() {
  const { celebrities, openModal } = useCrm();

  // Sort celebrities by campaigns count descending
  const sorted = [...celebrities].sort((a, b) => (b.campaignsCount || 0) - (a.campaignsCount || 0));

  return (
    <div className="crm-card" style={{ flex: 1.1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Crown size={18} color="var(--primary)" />
          <span>Top Celebrities by Campaigns</span>
        </div>
        <Link to="/celebrities" style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>
          View All
        </Link>
      </div>

      <div className="top-celebrities-list">
        {sorted.slice(0, 5).map((celeb, idx) => (
          <div key={celeb.id} className="top-celeb-item">
            <span className={`rank-badge ${idx === 0 ? 'top-rank' : ''}`}>
              {idx + 1}
            </span>
            <img src={celeb.avatar} alt={celeb.name} className="top-celeb-avatar" />
            <div className="top-celeb-info">
              <span className="top-celeb-name">{celeb.name}</span>
              <span className="top-celeb-campaigns">{celeb.campaignsCount} campaigns</span>
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: '0.7rem' }}
              title={`Book shoot for ${celeb.name}`}
              onClick={() => openModal('scheduleShoot', { celebrity: celeb.name })}
            >
              <CalendarPlus size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
