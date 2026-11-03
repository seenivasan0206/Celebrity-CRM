import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';
import {
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  User,
  RefreshCw,
  Trash2,
  Video,
  X,
  Calendar,
  Building,
  Film
} from 'lucide-react';

export default function Shoots() {
  const { shoots, updateShootStatus, deleteShoot, openModal } = useCrm();
  const [selectedShoot, setSelectedShoot] = useState(null);

  // Lock body scroll and prevent background shifting when modal is open
  useEffect(() => {
    if (selectedShoot) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [selectedShoot]);

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
                        <Clock size={11} /> {shoot.time || '09:00 AM - 05:00 PM'}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                    onClick={() => setSelectedShoot(shoot)}
                    title="Click to view production call sheet"
                  >
                    {shoot.title}
                  </td>
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
                      shoot.status === 'Confirmed' ? 'badge-accent' :
                      shoot.status === 'Scheduled' ? 'badge-primary' : 'badge-secondary'
                    }`} style={{ whiteSpace: 'nowrap' }}>
                      {shoot.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                        title="View Call Sheet Details"
                        onClick={() => setSelectedShoot(shoot)}
                      >
                        Call Sheet
                      </button>
                      {shoot.status !== 'Confirmed' ? (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                          title="Confirm shoot"
                          onClick={() => updateShootStatus && updateShootStatus(shoot.id, 'Confirmed')}
                        >
                          <CheckCircle2 size={13} color="var(--accent)" /> Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                          title="Revert to scheduled"
                          onClick={() => updateShootStatus && updateShootStatus(shoot.id, 'Scheduled')}
                        >
                          <RefreshCw size={13} color="var(--primary)" /> Reschedule
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', color: '#EF4444', whiteSpace: 'nowrap' }}
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

      {/* ========================================================
          PRODUCTION CALL SHEET & SHOOT DETAILS POP-UP MODAL
          ======================================================== */}
      {selectedShoot && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedShoot(null)}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', overscrollBehavior: 'contain' }}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge">
                  <Video size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{selectedShoot.title}</h3>
                  <p style={{ margin: '2px 0 0' }}>Production Call Sheet & Stage Logistics</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedShoot(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Talent Identification Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card-alt)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <img
                  src={selectedShoot.celebrityAvatar}
                  alt={selectedShoot.celebrity}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Assigned Celebrity Star
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {selectedShoot.celebrity}
                  </div>
                </div>
                <span className={`badge ${
                  selectedShoot.status === 'Confirmed' ? 'badge-accent' :
                  selectedShoot.status === 'Scheduled' ? 'badge-primary' : 'badge-secondary'
                }`}>
                  {selectedShoot.status}
                </span>
              </div>

              {/* Call Times & Location Grid */}
              <div className="agency-stats-strip">
                <div className="agency-stat-col">
                  <strong>{selectedShoot.date}</strong>
                  <span>Shoot Date</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--primary)' }}>
                    {selectedShoot.time || '09:00 AM - 05:00 PM'}
                  </strong>
                  <span>Call Hours</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--accent)' }}>
                    {selectedShoot.location}
                  </strong>
                  <span>Location Stage</span>
                </div>
              </div>

              {/* Director & Production Crew Card */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Direction & Stage Crew
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Lead Director / DP:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                      {selectedShoot.director || 'Gautham Menon'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Production Hub:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                      {selectedShoot.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  Current Call Sheet Status
                </span>
                <button
                  type="button"
                  className={selectedShoot.status === 'Confirmed' ? 'btn-secondary' : 'btn-primary'}
                  style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                  onClick={() => {
                    const nextStatus = selectedShoot.status === 'Confirmed' ? 'Scheduled' : 'Confirmed';
                    updateShootStatus && updateShootStatus(selectedShoot.id, nextStatus);
                    setSelectedShoot((prev) => ({ ...prev, status: nextStatus }));
                  }}
                >
                  {selectedShoot.status === 'Confirmed' ? (
                    <>
                      <RefreshCw size={13} /> Revert to Scheduled
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={13} /> Confirm Call Sheet
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ color: '#EF4444' }}
                onClick={() => {
                  deleteShoot && deleteShoot(selectedShoot.id);
                  setSelectedShoot(null);
                }}
              >
                <Trash2 size={13} /> Cancel Shoot
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSelectedShoot(null)}
              >
                Close Call Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
