import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Calendar, CheckCircle2, Trash2, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShootsTable() {
  const { shoots, updateShootStatus, deleteShoot, openModal, searchQuery } = useCrm();

  const filteredShoots = shoots.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.celebrity.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge badge-emerald">Confirmed</span>;
      case 'Scheduled':
        return <span className="badge badge-indigo">Scheduled</span>;
      case 'Planned':
        return <span className="badge badge-amber">Planned</span>;
      default:
        return <span className="badge badge-cyan">{status}</span>;
    }
  };

  return (
    <div className="crm-card shoots-table-card" style={{ flex: 2 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Calendar size={18} color="var(--primary)" />
          <span>Upcoming Shoots</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.74rem' }}
            onClick={() => openModal('scheduleShoot')}
          >
            <Plus size={13} /> Book
          </button>
          <Link to="/shoots" style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>
            View All ({shoots.length})
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="zenve-table" style={{ whiteSpace: 'nowrap' }}>
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap' }}>Date</th>
              <th style={{ whiteSpace: 'nowrap' }}>Title</th>
              <th style={{ whiteSpace: 'nowrap' }}>Celebrity</th>
              <th style={{ whiteSpace: 'nowrap' }}>Location</th>
              <th style={{ whiteSpace: 'nowrap' }}>Status</th>
              <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShoots.slice(0, 5).map((shoot) => (
              <tr key={shoot.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                  {shoot.date}
                </td>
                <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{shoot.title}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div className="table-celebrity-cell" style={{ whiteSpace: 'nowrap' }}>
                    <img src={shoot.celebrityAvatar} alt={shoot.celebrity} />
                    <span style={{ whiteSpace: 'nowrap' }}>{shoot.celebrity}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{shoot.location}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{getStatusBadge(shoot.status)}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', whiteSpace: 'nowrap' }}>
                    {shoot.status !== 'Confirmed' ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                        title="Confirm shoot"
                        onClick={() => updateShootStatus(shoot.id, 'Confirmed')}
                      >
                        <CheckCircle2 size={13} color="#10B981" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                        title="Reschedule shoot"
                        onClick={() => updateShootStatus(shoot.id, 'Scheduled')}
                      >
                        <Clock size={13} color="#6366F1" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.74rem', color: 'var(--accent-rose)', whiteSpace: 'nowrap' }}
                      title="Cancel shoot"
                      onClick={() => deleteShoot(shoot.id)}
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
  );
}
