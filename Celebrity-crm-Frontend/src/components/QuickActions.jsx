import React from 'react';
import { useCrm } from '../context/CrmContext';
import { UserPlus, Megaphone, FileText, CalendarPlus, Zap } from 'lucide-react';

export default function QuickActions() {
  const { openModal } = useCrm();

  return (
    <div className="crm-card" style={{ flex: 1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Zap size={18} color="var(--primary)" />
          <span>Quick Actions</span>
        </div>
      </div>

      <div className="quick-actions-panel">
        <button
          type="button"
          className="quick-action-button"
          onClick={() => openModal('addCelebrity')}
        >
          <div className="quick-action-icon">
            <UserPlus size={18} />
          </div>
          <span>Add Celebrity</span>
        </button>

        <button
          type="button"
          className="quick-action-button"
          onClick={() => openModal('createCampaign')}
        >
          <div className="quick-action-icon">
            <Megaphone size={18} />
          </div>
          <span>Create Campaign</span>
        </button>

        <button
          type="button"
          className="quick-action-button"
          onClick={() => openModal('createContract')}
        >
          <div className="quick-action-icon">
            <FileText size={18} />
          </div>
          <span>Create Contract</span>
        </button>

        <button
          type="button"
          className="quick-action-button"
          onClick={() => openModal('scheduleShoot')}
        >
          <div className="quick-action-icon">
            <CalendarPlus size={18} />
          </div>
          <span>Schedule Shoot</span>
        </button>
      </div>
    </div>
  );
}
