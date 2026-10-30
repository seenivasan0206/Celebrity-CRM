import React from 'react';
import { useCrm } from '../context/CrmContext';
import { UserCheck, Mail, Phone, Building, Star, Plus } from 'lucide-react';

export default function Managers() {
  const { managers, addToast } = useCrm();

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Talent Managers & Agency Liaisons</h2>
          <p>Key agency executives, artist reps, and endorsement agents</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => addToast('Manager invitation link generated & copied to clipboard!', 'info')}
        >
          <Plus size={16} /> Invite Manager
        </button>
      </div>

      <div className="managers-grid">
        {managers.map((mgr) => (
          <div key={mgr.id} className="manager-card">
            <div className="manager-header">
              <div className="manager-avatar-initial">
                {mgr.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="manager-meta">
                <h3>{mgr.name}</h3>
                <span>{mgr.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  <Building size={12} /> {mgr.agency}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="var(--primary)" />
                <span>{mgr.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="var(--primary)" />
                <span>{mgr.phone}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Represented Talents
              </span>
              <div className="manager-celeb-chips">
                {mgr.assignedCelebrities.map((celebName) => (
                  <span key={celebName} className="celeb-chip">
                    <Star size={10} color="#F59E0B" style={{ display: 'inline', marginRight: '4px' }} />
                    {celebName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

