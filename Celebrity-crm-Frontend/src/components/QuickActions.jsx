import React from 'react';
import { useCrm } from '../context/CrmContext';
import { UserPlus, Megaphone, FileText, CalendarPlus, Zap } from 'lucide-react';

export default function QuickActions() {
  const { setActiveModal } = useCrm();

  return (
    <div className="crm-card" style={{ flex: 1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Zap size={18} color="#06B6D4" />
          <span>Quick Actions</span>
        </div>
      </div>

      <div className="quick-actions-panel">
        <button
          className="quick-action-button"
          style={{ '--action-color': '#6366F1' }}
          onClick={() => setActiveModal('addCelebrity')}
        >
          <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)' }}>
            <UserPlus size={18} />
          </div>
          <span>Add Celebrity</span>
        </button>

        <button
          className="quick-action-button"
          style={{ '--action-color': '#10B981' }}
          onClick={() => setActiveModal('createCampaign')}
        >
          <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
            <Megaphone size={18} />
          </div>
          <span>Create Campaign</span>
        </button>

        <button
          className="quick-action-button"
          style={{ '--action-color': '#F59E0B' }}
          onClick={() => setActiveModal('createContract')}
        >
          <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
            <FileText size={18} />
          </div>
          <span>Create Contract</span>
        </button>

        <button
          className="quick-action-button"
          style={{ '--action-color': '#EC4899' }}
          onClick={() => setActiveModal('scheduleShoot')}
        >
          <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)' }}>
            <CalendarPlus size={18} />
          </div>
          <span>Schedule Shoot</span>
        </button>
      </div>
    </div>
  );
}

