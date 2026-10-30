import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Megaphone, Calendar, TrendingUp, Plus } from 'lucide-react';

export default function Campaigns() {
  const { campaigns, setActiveModal } = useCrm();

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Brand Campaigns & Endorsements</h2>
          <p>Track active commercial contracts, milestones, and deliverable execution</p>
        </div>
        <button className="btn-primary" onClick={() => setActiveModal('createCampaign')}>
          <Plus size={16} /> New Campaign
        </button>
      </div>

      <div className="campaigns-grid">
        {campaigns.map((camp) => (
          <div key={camp.id} className="campaign-card">
            <div className="campaign-card-header">
              <div>
                <span className="campaign-brand-tag">{camp.brand}</span>
                <h3>{camp.title}</h3>
              </div>
              <span className={`badge ${camp.status === 'Completed' ? 'badge-emerald' : 'badge-indigo'}`}>
                {camp.status}
              </span>
            </div>

            <div className="campaign-talent-pill">
              <span style={{ color: 'var(--text-dim)' }}>Star:</span>
              <span>{camp.celebrity}</span>
            </div>

            <div className="campaign-progress-bar-wrap">
              <div className="progress-header">
                <span>Deliverables Progress</span>
                <span>{camp.progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${camp.progress}%` }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} color="#06B6D4" />
                <span>Estimated Reach: <strong>{camp.reach}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="#F59E0B" />
                <span>Target: <strong>{camp.deadline}</strong></span>
              </div>
            </div>

            <div className="campaign-footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Campaign Budget</span>
                <span className="campaign-budget">{camp.budget}</span>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                onClick={() => setActiveModal('scheduleShoot')}
              >
                Book Shoot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

