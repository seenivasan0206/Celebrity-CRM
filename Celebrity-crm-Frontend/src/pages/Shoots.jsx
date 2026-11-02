import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Plus, MapPin, Clock, CheckCircle2, User, RefreshCw, Trash2 } from 'lucide-react';

export default function Shoots() {
  const { shoots, updateShootStatus, deleteShoot, openModal } = useCrm();

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Production Shoots Schedule ({(shoots || []).length})</h2>
          <p>Real-time location, talent call times, and director assignments</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openModal && openModal('scheduleShoot')}
        >
          <Plus size={16} /> Schedule New Shoot
        </button>
      </div>

      <div className="crm-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="zenve-table" style={{ whiteSpace: 'nowrap' }}>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>Date & Time</th>
                <th style={{ whiteSpace: 'nowrap' }}>Shoot Title</th>
                <th style={{ whiteSpace: 'nowrap' }}>Celebrity Talent</th>
                <th style={{ whiteSpace: 'nowrap' }}>Location / Stage</th>
                <th style={{ whiteSpace: 'nowrap' }}>Director / DP</th>
                <th style={{ whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(shoots || []).map((shoot) => (
                <tr key={shoot.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{shoot.date}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> {shoot.time || 'All Day'}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{shoot.title}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="table-celebrity-cell" style={{ whiteSpace: 'nowrap' }}>
                      <img src={shoot.celebrityAvatar} alt={shoot.celebrity} />
                      <span style={{ whiteSpace: 'nowrap' }}>{shoot.celebrity}</span>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                      <MapPin size={13} color="var(--primary)" />
                      <span>{shoot.location}</span>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                      <User size={13} color="var(--text-dim)" />
                      <span>{shoot.director || 'Crew Lead'}</span>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className={`badge ${
                      shoot.status === 'Confirmed' ? 'badge-emerald' :
                      shoot.status === 'Scheduled' ? 'badge-indigo' : 'badge-amber'
                    }`} style={{ whiteSpace: 'nowrap' }}>
                      {shoot.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', whiteSpace: 'nowrap' }}>
                      {shoot.status !== 'Confirmed' ? (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                          title="Confirm shoot"
                          onClick={() => updateShootStatus && updateShootStatus(shoot.id, 'Confirmed')}
                        >
                          <CheckCircle2 size={13} color="#10B981" /> Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                          title="Revert to scheduled"
                          onClick={() => updateShootStatus && updateShootStatus(shoot.id, 'Scheduled')}
                        >
                          <RefreshCw size={13} color="#6366F1" /> Reschedule
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', color: 'var(--accent-rose)', whiteSpace: 'nowrap' }}
                        title="Cancel shoot"
                        onClick={() => deleteShoot && deleteShoot(shoot.id)}
                      >
                        <Trash2 size={13} />
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
