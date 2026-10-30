import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Clock, FileText, Megaphone, UserPlus, Camera, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentActivity() {
  const { activities } = useCrm();

  const getIcon = (type) => {
    switch (type) {
      case 'contract':
        return <FileText size={15} />;
      case 'campaign':
        return <Megaphone size={15} />;
      case 'casting':
        return <UserPlus size={15} />;
      case 'shoot':
        return <Camera size={15} />;
      case 'profile':
        return <User size={15} />;
      case 'payment':
        return <CreditCard size={15} />;
      default:
        return <Clock size={15} />;
    }
  };

  return (
    <div className="crm-card" style={{ flex: 1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Clock size={18} color="var(--primary)" />
          <span>Recent Activity</span>
        </div>
        <Link to="/reports" style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>
          View All
        </Link>
      </div>

      <div className="activity-list-wrap">
        {activities.slice(0, 5).map((act) => (
          <div key={act.id} className="activity-item">
            <div className="activity-icon-badge" style={{ background: act.iconColor || 'var(--primary)' }}>
              {getIcon(act.type)}
            </div>
            <div className="activity-details">
              <span className="activity-title">{act.title}</span>
              <span className="activity-desc">{act.desc}</span>
              <span className="activity-time-stamp">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

