import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Megaphone, Calendar, TrendingUp, Plus, CheckCircle, Trash2 } from 'lucide-react';

export default function Campaigns() {
  const { campaigns, openModal, updateCampaignStatus, deleteCampaign } = useCrm();

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Brand Campaigns & Endorsements ({(campaigns || []).length})</h2>
          <p>Track active commercial contracts, milestones, and deliverable execution</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openModal && openModal('createCampaign')}
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      <div className="campaigns-grid">
        {(campaigns || []).map((camp) => (
          <div key={camp.id} className="campaign-card">
            <div className="campaign-card-header">
              <div>
                <span className="campaign-brand-tag">{camp.brand}</span>
                <h3>{camp.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge ${camp.status === 'Completed' ? 'badge-emerald' : 'badge-indigo'}`}>
                  {camp.status}
                </span>
                <button
                  type="button"
                  title="Delete Campaign"
                  onClick={() => deleteCampaign && deleteCampaign(camp.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F43F5E')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
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

              <div style={{ display: 'flex', gap: '8px' }}>
                {camp.status !== 'Completed' && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.76rem' }}
                    onClick={() => updateCampaignStatus && updateCampaignStatus(camp.id, 'Completed')}
                    title="Mark campaign as completed"
                  >
                    <CheckCircle size={13} color="#10B981" /> Complete
                  </button>
                )}
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                  onClick={() => openModal && openModal('scheduleShoot', { celebrity: camp.celebrity })}
                >
                  Book Shoot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
