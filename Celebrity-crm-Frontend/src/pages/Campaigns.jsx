import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Megaphone, Calendar, TrendingUp, Plus, Edit2, Check, X } from 'lucide-react';

export default function Campaigns() {
  const { campaigns, setActiveModal, updateCampaignDeadline, addToast } = useCrm();

  const [editingId, setEditingId] = useState(null);
  const [tempDate, setTempDate] = useState('');

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
    } else {
      try {
        const saved = localStorage.getItem('zenve_campaigns');
        if (saved) {
          const list = JSON.parse(saved);
          const updated = list.map((c) => (c.id === campId ? { ...c, deadline: formatted } : c));
          localStorage.setItem('zenve_campaigns', JSON.stringify(updated));
        }
      } catch (err) {
        console.error(err);
      }
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
          <h2>Brand Campaigns & Endorsements</h2>
          <p>Track active commercial contracts, milestones, and deliverable execution</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setActiveModal && setActiveModal('createCampaign')}
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
                <h3>{camp.title}</h3>
              </div>
              <span className={`badge ${camp.status === 'Completed' ? 'badge-emerald' : 'badge-indigo'}`}>
                {camp.status}
              </span>
            </div>

            <div className="campaign-talent-pill">
              <span style={{ color: 'var(--text-dim)' }}>Star:</span>
              <span>{camp.celebrity}</span>
            </div>

            <div className="campaign-progress-bar-wrap">
              <div className="progress-header">
                <span>Deliverables Progress</span>
                <span>{camp.progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${camp.progress}%` }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} color="#06B6D4" />
                <span>Estimated Reach: <strong>{camp.reach}</strong></span>
              </div>

              {/* Target Date with Inline Edit Option */}
              {editingId === camp.id ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                    background: 'rgba(245, 158, 11, 0.08)',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <Calendar size={14} color="#F59E0B" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F59E0B' }}>Target:</span>
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
                      borderRadius: '6px',
                      border: '1px solid #F59E0B',
                      background: 'var(--bg-secondary, #1e293b)',
                      color: 'var(--text-main, #ffffff)',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveDate(camp.id)}
                    title="Save Target Date"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      background: '#10B981',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Check size={12} /> Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    title="Cancel"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: 'var(--text-dim, #94a3b8)',
                      borderRadius: '6px',
                      padding: '4px 7px',
                      cursor: 'pointer',
                      fontSize: '0.72rem'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="#F59E0B" />
                    <span>Target: <strong>{camp.deadline || 'TBD'}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(camp)}
                    title="Edit Target Date"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#F59E0B',
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F59E0B';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)';
                      e.currentTarget.style.color = '#F59E0B';
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
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                onClick={() => setActiveModal && setActiveModal('scheduleShoot')}
              >
                Book Shoot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
