import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Calendar, MoreVertical, CheckCircle, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShootsTable() {
  const { shoots, updateShootStatus, deleteShoot, searchQuery } = useCrm();
  const [openMenuId, setOpenMenuId] = useState(null);

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
        <Link to="/shoots" style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>
          View All ({shoots.length})
        </Link>
      </div>

      <div className="table-responsive">
        <table className="zenve-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Celebrity</th>
              <th>Location</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShoots.slice(0, 5).map((shoot) => (
              <tr key={shoot.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                  {shoot.date}
                </td>
                <td style={{ fontWeight: 500 }}>{shoot.title}</td>
                <td>
                  <div className="table-celebrity-cell">
                    <img src={shoot.celebrityAvatar} alt={shoot.celebrity} />
                    <span>{shoot.celebrity}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{shoot.location}</td>
                <td>{getStatusBadge(shoot.status)}</td>
                <td style={{ position: 'relative', textAlign: 'center' }}>
                  <button
                    className="action-dots-btn"
                    onClick={() => setOpenMenuId(openMenuId === shoot.id ? null : shoot.id)}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenuId === shoot.id && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '40px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 20,
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        minWidth: '140px'
                      }}
                    >
                      <button
                        className="popover-item"
                        onClick={() => {
                          updateShootStatus(shoot.id, 'Confirmed');
                          setOpenMenuId(null);
                        }}
                      >
                        <CheckCircle size={14} color="#10B981" /> Confirm
                      </button>
                      <button
                        className="popover-item"
                        onClick={() => {
                          updateShootStatus(shoot.id, 'Scheduled');
                          setOpenMenuId(null);
                        }}
                      >
                        <Clock size={14} color="#6366F1" /> Reschedule
                      </button>
                      <button
                        className="popover-item danger"
                        onClick={() => {
                          deleteShoot(shoot.id);
                          setOpenMenuId(null);
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

