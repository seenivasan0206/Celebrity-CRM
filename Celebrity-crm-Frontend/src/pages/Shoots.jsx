import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Camera, Plus, MapPin, Clock, CheckCircle2, User } from 'lucide-react';

export default function Shoots() {
  const { shoots, updateShootStatus, deleteShoot, setActiveModal } = useCrm();

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Production Shoots Schedule</h2>
          <p>Real-time location, talent call times, and director assignments</p>
        </div>
        <button className="btn-primary" onClick={() => setActiveModal('scheduleShoot')}>
          <Plus size={16} /> Schedule New Shoot
        </button>
      </div>

      <div className="crm-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="zenve-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Shoot Title</th>
                <th>Celebrity Talent</th>
                <th>Location / Stage</th>
                <th>Director / DP</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shoots.map((shoot) => (
                <tr key={shoot.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{shoot.date}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> {shoot.time || 'All Day'}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{shoot.title}</td>
                  <td>
                    <div className="table-celebrity-cell">
                      <img src={shoot.celebrityAvatar} alt={shoot.celebrity} />
                      <span>{shoot.celebrity}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--primary)" />
                      <span>{shoot.location}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} color="var(--text-dim)" />
                      <span>{shoot.director || 'Crew Lead'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      shoot.status === 'Confirmed' ? 'badge-emerald' :
                      shoot.status === 'Scheduled' ? 'badge-indigo' : 'badge-amber'
                    }`}>
                      {shoot.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {shoot.status !== 'Confirmed' && (
                        <button
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                          onClick={() => updateShootStatus(shoot.id, 'Confirmed')}
                        >
                          <CheckCircle2 size={13} color="#10B981" /> Confirm
                        </button>
                      )}
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', color: 'var(--accent-rose)' }}
                        onClick={() => deleteShoot(shoot.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

