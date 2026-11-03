import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';
import {
  Megaphone,
  Calendar,
  TrendingUp,
  Plus,
  Edit2,
  Check,
  X,
  DollarSign,
  User,
  ShieldCheck,
  Trash2,
  Video
} from 'lucide-react';

export default function Campaigns() {
  const {
    campaigns,
    openModal,
    setActiveModal,
    updateCampaignDeadline,
    updateCampaignStatus,
    deleteCampaign,
    addToast
  } = useCrm();

  const [editingId, setEditingId] = useState(null);
  const [tempDate, setTempDate] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Lock body scroll and prevent background shifting when modal is open
  useEffect(() => {
    if (selectedCampaign) {
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
  }, [selectedCampaign]);

  // Helper to parse '15 Jan 2026' into 'YYYY-MM-DD' for date picker
  const toDateInputValue = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return '';
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Helper to format 'YYYY-MM-DD' into '15 Jan 2026'
  const formatTargetDate = (isoOrDateStr) => {
    if (!isoOrDateStr) return 'TBD';
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrDateStr)) {
      const [y, m, d] = isoOrDateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return isoOrDateStr;
  };

  const handleStartEdit = (camp) => {
    setEditingId(camp.id);
    const converted = toDateInputValue(camp.deadline);
    if (converted) {
      setTempDate(converted);
    } else {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      setTempDate(`${y}-${m}-${d}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempDate('');
  };

  const handleSaveDate = (campId) => {
    if (!tempDate) return;
    const formatted = formatTargetDate(tempDate);
    if (updateCampaignDeadline) {
      updateCampaignDeadline(campId, formatted);
    }
    if (selectedCampaign && selectedCampaign.id === campId) {
      setSelectedCampaign((prev) => ({ ...prev, deadline: formatted }));
    }
    if (addToast) {
      addToast(`Target date updated to "${formatted}"`, 'success');
    }
    setEditingId(null);
  };

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
          onClick={() => {
            if (openModal) openModal('createCampaign');
            else if (setActiveModal) setActiveModal('createCampaign');
          }}
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
                <h3
                  onClick={() => setSelectedCampaign(camp)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view campaign dossier"
                >
                  {camp.title}
                </h3>
              </div>
              <span className={`badge ${camp.status === 'Completed' ? 'badge-accent' : 'badge-primary'}`}>
                {camp.status}
              </span>
            </div>

            <div className="campaign-talent-pill">
              <span style={{ color: 'var(--text-dim)' }}>Star:</span>
              <span style={{ fontWeight: 600 }}>{camp.celebrity}</span>
            </div>

            <div className="campaign-progress-bar-wrap">
              <div className="progress-header">
                <span>Deliverables Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{camp.progress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${camp.progress}%`,
                    background: camp.progress === 100 ? 'var(--accent)' : 'var(--primary)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} color="var(--primary)" />
                <span>Estimated Reach: <strong>{camp.reach || '12.5M Impressions'}</strong></span>
              </div>

              {/* Target Date with Inline Edit Option */}
              {editingId === camp.id ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                    background: 'var(--bg-card-alt)',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)'
                  }}
                >
                  <Calendar size={14} color="var(--primary)" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-main)' }}>Target:</span>
                  <input
                    type="date"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveDate(camp.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    style={{
                      padding: '3px 6px',
                      fontSize: '0.74rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-medium)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveDate(camp.id)}
                    title="Save Target Date"
                    className="btn-primary"
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      borderRadius: '4px'
                    }}
                  >
                    <Check size={12} /> Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    title="Cancel"
                    className="btn-secondary"
                    style={{
                      padding: '3px 7px',
                      fontSize: '0.72rem',
                      borderRadius: '4px'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>Target: <strong>{camp.deadline || 'TBD'}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(camp)}
                    title="Edit Target Date"
                    className="btn-secondary"
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.72rem'
                    }}
                  >
                    <Edit2 size={11} /> Edit
                  </button>
                </div>
              )}
            </div>

            <div className="campaign-footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Campaign Budget</span>
                <span className="campaign-budget">{camp.budget}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.76rem' }}
                  onClick={() => setSelectedCampaign(camp)}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                  onClick={() => {
                    if (openModal) openModal('scheduleShoot', { celebrity: camp.celebrity });
                    else if (setActiveModal) setActiveModal('scheduleShoot');
                  }}
                >
                  Book Shoot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          CAMPAIGN DETAILS & PROGRESS DOSSIER POP-UP MODAL
          ======================================================== */}
      {selectedCampaign && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCampaign(null)}
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
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{selectedCampaign.title}</h3>
                  <p style={{ margin: '2px 0 0' }}>Brand Client: {selectedCampaign.brand}</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedCampaign(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* 3-Stat Metric Strip */}
              <div className="agency-stats-strip">
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--accent)' }}>{selectedCampaign.budget}</strong>
                  <span>Campaign Budget</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--primary)' }}>{selectedCampaign.celebrity}</strong>
                  <span>Celebrity Star</span>
                </div>
                <div className="agency-stat-col">
                  <strong>{selectedCampaign.deadline || '2026-12-31'}</strong>
                  <span>Target Date</span>
                </div>
              </div>

              {/* Progress Stepper Card */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                    Deliverables Milestone Execution
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent)' }}>
                    {selectedCampaign.progress}% Done
                  </span>
                </div>
                <div className="progress-track" style={{ height: '7px', marginBottom: '12px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${selectedCampaign.progress}%`,
                      background: selectedCampaign.progress === 100 ? 'var(--accent)' : 'var(--primary)'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <TrendingUp size={14} color="var(--primary)" />
                    <span>Projected Exposure: <strong>{selectedCampaign.reach || '14.2M Impressions'}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Status:</span>
                    <select
                      className="zenve-select"
                      style={{ padding: '3px 8px', fontSize: '0.74rem', width: 'auto' }}
                      value={selectedCampaign.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        updateCampaignStatus && updateCampaignStatus(selectedCampaign.id, newStatus);
                        setSelectedCampaign((prev) => ({ ...prev, status: newStatus }));
                      }}
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Planned">Planned</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Endorsement Scope */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Campaign Deliverables Scope
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <li>Main TV Commercial (TVC) & Pan-India OTT Broadcast Stills</li>
                  <li>Social Media Brand Ambassador Posts & Product Launch Keynotes</li>
                  <li>VIP Launch Appearance with Press Conference Attendance</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ color: '#EF4444' }}
                onClick={() => {
                  deleteCampaign && deleteCampaign(selectedCampaign.id);
                  setSelectedCampaign(null);
                }}
              >
                <Trash2 size={13} /> Remove Campaign
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedCampaign(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const celeb = selectedCampaign.celebrity;
                    setSelectedCampaign(null);
                    if (openModal) openModal('scheduleShoot', { celebrity: celeb });
                  }}
                >
                  <Video size={13} /> Schedule Shoot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
