import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import {
  Megaphone,
  Calendar,
  TrendingUp,
  Plus,
  CheckCircle,
  Trash2,
  Star,
  Clock,
  Check,
  Search,
  DollarSign,
  Camera,
  Building2,
  X,
  Target,
  Edit2
} from 'lucide-react';

export default function Campaigns() {
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const {
    campaigns,
    openModal,
    updateCampaignStatus,
    updateCampaignDeadline,
    deleteCampaign,
    celebrities,
    addToast
  } = useCrm();

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Lookup map for celebrity portraits / avatars
  const celebrityMap = useMemo(() => {
    const map = {};
    (celebrities || []).forEach((c) => {
      if (c?.name) {
        map[c.name.toLowerCase().trim()] = c;
      }
    });
    return map;
  }, [celebrities]);

  // Aggregate KPI metrics
  const totalCampaigns = (campaigns || []).length;
  const ongoingCount = (campaigns || []).filter((c) => c.status === 'Ongoing').length;
  const completedCount = (campaigns || []).filter((c) => c.status === 'Completed').length;
  const plannedCount = (campaigns || []).filter((c) => c.status === 'Planned').length;

  const totalPortfolioValue = useMemo(() => {
    let sum = 0;
    (campaigns || []).forEach((c) => {
      if (!c.budget) return;
      const numStr = String(c.budget).replace(/[^0-9.]/g, '');
      const val = parseFloat(numStr) || 0;
      sum += val;
    });
    if (sum >= 1000000) {
      return `$${(sum / 1000000).toFixed(2)}M`;
    }
    if (sum >= 1000) {
      return `$${(sum / 1000).toFixed(0)}K`;
    }
    return `$${sum.toLocaleString()}`;
  }, [campaigns]);

  const avgDeliverableProgress = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return 0;
    const total = campaigns.reduce((acc, c) => acc + (Number(c.progress) || 0), 0);
    return Math.round(total / campaigns.length);
  }, [campaigns]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return (campaigns || []).filter((c) => {
      const matchesFilter =
        selectedFilter === 'All'
          ? true
          : (c.status || '').toLowerCase() === selectedFilter.toLowerCase();

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (c.title || '').toLowerCase().includes(q) ||
        (c.brand || '').toLowerCase().includes(q) ||
        (c.celebrity || '').toLowerCase().includes(q) ||
        (c.reach || '').toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [campaigns, selectedFilter, search]);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'ongoing') {
      return (
        <span className="campaign-status-badge campaign-status-ongoing">
          <span className="campaign-pulsing-dot" /> Ongoing
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="campaign-status-badge campaign-status-completed">
          <Check size={12} strokeWidth={2.5} /> Completed
        </span>
      );
    }
    return (
      <span className="campaign-status-badge campaign-status-planned">
        <Clock size={12} strokeWidth={2} /> Planned
      </span>
    );
  };

  const getProgressGradient = (progress) => {
    const p = Number(progress) || 0;
    if (p >= 100) return 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)';
    if (p >= 50) return 'linear-gradient(90deg, #6366F1 0%, #06B6D4 100%)';
    return 'linear-gradient(90deg, #F59E0B 0%, #F43F5E 100%)';
  };

  const handleEditTargetDate = (camp) => {
    const currentVal = camp.deadline || '';
    const newDate = window.prompt(
      `Update Target Date for "${camp.title}":\n(e.g., 25 Feb 2026 or 2026-03-31)`,
      currentVal
    );
    if (newDate !== null) {
      const trimmed = newDate.trim();
      if (trimmed && trimmed !== currentVal) {
        if (updateCampaignDeadline) {
          updateCampaignDeadline(camp.id, trimmed);
        }
      }
    }
  };

  return (
    <div className="campaigns-page-container">
      {/* Dynamic Scoped CSS */}
      <style>{`
        .campaigns-page-container {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* KPI Banner */
        .campaigns-kpi-banner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .campaigns-kpi-banner {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .campaigns-kpi-banner {
            grid-template-columns: 1fr;
          }
        }

        .campaign-kpi-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .campaign-kpi-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-medium);
          box-shadow: var(--shadow-md);
        }

        .campaign-kpi-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .campaign-kpi-meta {
          display: flex;
          flex-direction: column;
        }

        .campaign-kpi-label {
          font-size: 0.70rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
        }

        .campaign-kpi-value {
          font-size: 1.38rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.2;
          margin-top: 2px;
          font-family: var(--font-display);
        }

        /* Toolbar & Filters */
        .campaigns-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .campaigns-filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .campaign-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 15px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .campaign-filter-btn:hover {
          border-color: var(--border-medium);
          color: var(--text-main);
          background: var(--bg-card-hover);
        }

        .campaign-filter-btn.active {
          background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
        }

        .campaign-filter-count {
          font-size: 0.70rem;
          padding: 1px 7px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.18);
        }

        .campaign-filter-btn:not(.active) .campaign-filter-count {
          background: var(--bg-card-alt);
          color: var(--text-dim);
        }

        /* Search Box */
        .campaigns-search-box {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 270px;
          flex: 1;
          max-width: 380px;
        }

        .campaigns-search-input {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 8px 34px 8px 36px;
          font-size: 0.83rem;
          color: var(--text-main);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .campaigns-search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .campaigns-search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-dim);
          pointer-events: none;
        }

        .campaigns-search-clear {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .campaigns-search-clear:hover {
          color: var(--text-main);
        }

        /* 3-Column Desktop, 2-Column Tablet, 1-Column Mobile Grid */
        .campaigns-modern-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        @media (max-width: 1140px) {
          .campaigns-modern-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .campaigns-modern-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Campaign Card */
        .campaign-modern-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-shadow: var(--shadow-card);
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.22s ease, 
                      box-shadow 0.22s ease;
          position: relative;
        }

        .campaign-modern-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-medium);
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(99, 102, 241, 0.18);
        }

        /* Card Top Header */
        .campaign-card-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .campaign-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${isLight ? '#4f46e5' : '#818cf8'};
          background: ${isLight ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.14)'};
          padding: 3px 9px;
          border-radius: 6px;
          border: 1px solid ${isLight ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.3)'};
        }

        .campaign-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Status Badges */
        .campaign-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          font-size: 0.74rem;
          font-weight: 600;
          border-radius: 9999px;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .campaign-pulsing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #06b6d4;
          box-shadow: 0 0 8px #06b6d4;
          display: inline-block;
          animation: campaignDotPulse 1.8s infinite;
        }

        @keyframes campaignDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }

        .campaign-status-ongoing {
          background: ${isLight ? '#ecfeff' : 'rgba(6, 182, 212, 0.12)'};
          color: ${isLight ? '#0891b2' : '#22d3ee'};
          border: 1px solid ${isLight ? '#a5f3fc' : 'rgba(6, 182, 212, 0.3)'};
        }

        .campaign-status-completed {
          background: ${isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)'};
          color: ${isLight ? '#059669' : '#34d399'};
          border: 1px solid ${isLight ? '#a7f3d0' : 'rgba(16, 185, 129, 0.3)'};
        }

        .campaign-status-planned {
          background: ${isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)'};
          color: ${isLight ? '#d97706' : '#fbbf24'};
          border: 1px solid ${isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.3)'};
        }

        .campaign-delete-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 5px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .campaign-delete-btn:hover {
          color: #f43f5e;
          background: rgba(244, 63, 94, 0.12);
        }

        /* Campaign Title */
        .campaign-title-text {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.35;
          margin: 10px 0 14px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: 2.7em;
        }

        /* Star Info Strip */
        .campaign-star-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-card-alt);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 8px 12px;
          margin-bottom: 16px;
        }

        .campaign-star-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .campaign-star-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--border-medium);
          flex-shrink: 0;
        }

        .campaign-star-avatar-fallback {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366F1, #06B6D4);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .campaign-star-name-wrap {
          display: flex;
          flex-direction: column;
        }

        .campaign-star-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
        }

        .campaign-star-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }

        .campaign-star-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #f59e0b;
        }

        /* Deliverables Progress Section */
        .campaign-progress-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .campaign-progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.74rem;
        }

        .campaign-progress-label {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-dim);
        }

        .campaign-progress-pct {
          font-weight: 700;
          font-size: 0.80rem;
          color: var(--text-main);
          padding: 2px 7px;
          border-radius: 6px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border-subtle);
        }

        .campaign-progress-track {
          height: 7px;
          width: 100%;
          background: var(--bg-card-alt);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
        }

        .campaign-progress-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Details Dual-Metric Grid */
        .campaign-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 16px;
        }

        .campaign-detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .campaign-detail-item.editable-date {
          cursor: pointer;
          border-radius: 8px;
          padding: 3px 6px;
          margin: -3px -6px;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .campaign-detail-item.editable-date:hover {
          background: rgba(245, 158, 11, 0.1);
          transform: translateY(-1px);
        }

        .campaign-detail-edit-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.62rem;
          color: #f59e0b;
          font-weight: 600;
          margin-left: 5px;
          opacity: 0.85;
        }

        .campaign-detail-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .campaign-detail-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .campaign-detail-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
        }

        .campaign-detail-val {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Footer */
        .campaign-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
          margin-top: auto;
          gap: 12px;
          flex-wrap: wrap;
        }

        .campaign-budget-meta {
          display: flex;
          flex-direction: column;
        }

        .campaign-budget-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
        }

        .campaign-budget-amount {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .campaign-card-btns {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .campaign-btn-complete {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 11px;
          font-size: 0.76rem;
          font-weight: 600;
          border-radius: 10px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border-medium);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .campaign-btn-complete:hover {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.35);
        }

        .campaign-btn-book {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-size: 0.76rem;
          font-weight: 600;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
          color: #ffffff;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          transition: all 0.15s ease;
        }

        .campaign-btn-book:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.45);
          filter: brightness(1.08);
        }

        .campaign-btn-book:active {
          transform: translateY(0);
        }

        /* Empty State */
        .campaigns-empty-state {
          text-align: center;
          padding: 56px 20px;
          background: var(--bg-card);
          border: 1px dashed var(--border-medium);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
      `}</style>

      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <h2>Brand Campaigns & Endorsements ({totalCampaigns})</h2>
          <p>Track active commercial contracts, milestones, and deliverable execution</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openModal && openModal('createCampaign')}
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Top Executive KPI Metrics Banner */}
      <div className="campaigns-kpi-banner">
        <div className="campaign-kpi-card">
          <div
            className="campaign-kpi-icon-wrap"
            style={{
              background: isLight ? '#eef2ff' : 'rgba(99, 102, 241, 0.12)',
              color: '#6366f1'
            }}
          >
            <Megaphone size={21} />
          </div>
          <div className="campaign-kpi-meta">
            <span className="campaign-kpi-label">Total Campaigns</span>
            <span className="campaign-kpi-value">{totalCampaigns}</span>
          </div>
        </div>

        <div className="campaign-kpi-card">
          <div
            className="campaign-kpi-icon-wrap"
            style={{
              background: isLight ? '#ecfeff' : 'rgba(6, 182, 212, 0.12)',
              color: '#06b6d4'
            }}
          >
            <TrendingUp size={21} />
          </div>
          <div className="campaign-kpi-meta">
            <span className="campaign-kpi-label">Active / Ongoing</span>
            <span className="campaign-kpi-value">{ongoingCount}</span>
          </div>
        </div>

        <div className="campaign-kpi-card">
          <div
            className="campaign-kpi-icon-wrap"
            style={{
              background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
              color: '#10b981'
            }}
          >
            <DollarSign size={21} />
          </div>
          <div className="campaign-kpi-meta">
            <span className="campaign-kpi-label">Portfolio Value</span>
            <span className="campaign-kpi-value">{totalPortfolioValue}</span>
          </div>
        </div>

        <div className="campaign-kpi-card">
          <div
            className="campaign-kpi-icon-wrap"
            style={{
              background: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)',
              color: '#f59e0b'
            }}
          >
            <Target size={21} />
          </div>
          <div className="campaign-kpi-meta">
            <span className="campaign-kpi-label">Avg Deliverables</span>
            <span className="campaign-kpi-value">{avgDeliverableProgress}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="campaigns-toolbar">
        <div className="campaigns-filter-group">
          {[
            { label: 'All', count: totalCampaigns },
            { label: 'Ongoing', count: ongoingCount },
            { label: 'Completed', count: completedCount },
            { label: 'Planned', count: plannedCount }
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={`campaign-filter-btn ${selectedFilter === tab.label ? 'active' : ''}`}
              onClick={() => setSelectedFilter(tab.label)}
            >
              <span>{tab.label === 'All' ? 'All Campaigns' : tab.label}</span>
              <span className="campaign-filter-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="campaigns-search-box">
          <Search size={15} className="campaigns-search-icon" />
          <input
            type="text"
            className="campaigns-search-input"
            placeholder="Filter by title, brand, or star..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="campaigns-search-clear"
              onClick={() => setSearch('')}
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Campaigns 3-Column Responsive Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="campaigns-empty-state">
          <Megaphone size={38} color="var(--text-dim)" style={{ opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            No campaigns found
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', maxWidth: '340px' }}>
            {search
              ? `No campaign matching "${search}". Try adjusting your keywords or filter.`
              : 'There are no campaigns matching the selected status.'}
          </p>
          {(search || selectedFilter !== 'All') && (
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
              onClick={() => {
                setSearch('');
                setSelectedFilter('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="campaigns-modern-grid">
          {filteredCampaigns.map((camp) => {
            const celebObj = celebrityMap[(camp.celebrity || '').toLowerCase().trim()];
            const celebAvatar = celebObj?.avatar;
            const celebInitials = (camp.celebrity || 'Star')
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div key={camp.id} className="campaign-modern-card">
                {/* Top Section: Brand Badge, Status & Delete Action */}
                <div>
                  <div className="campaign-card-top-row">
                    <span className="campaign-brand-badge" title="Brand / Client">
                      <Building2 size={12} />
                      {camp.brand || 'Client Brand'}
                    </span>
                    <div className="campaign-card-actions">
                      {getStatusBadge(camp.status)}
                      <button
                        type="button"
                        className="campaign-delete-btn"
                        title="Delete Campaign"
                        onClick={() => {
                          if (deleteCampaign) {
                            deleteCampaign(camp.id);
                            if (addToast) {
                              addToast(`Campaign "${camp.title}" removed`, 'info');
                            }
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Campaign Title */}
                  <h3 className="campaign-title-text" title={camp.title}>
                    {camp.title}
                  </h3>

                  {/* Star / Celebrity Representation Strip */}
                  <div className="campaign-star-pill">
                    <div className="campaign-star-meta">
                      {celebAvatar ? (
                        <img
                          src={celebAvatar}
                          alt={camp.celebrity}
                          className="campaign-star-avatar"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="campaign-star-avatar-fallback">{celebInitials}</div>
                      )}
                      <div className="campaign-star-name-wrap">
                        <span className="campaign-star-label">Lead Celebrity</span>
                        <span className="campaign-star-name">{camp.celebrity}</span>
                      </div>
                    </div>
                    <span className="campaign-star-tag">
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> Endorsement
                    </span>
                  </div>

                  {/* Deliverables Progress Section */}
                  <div className="campaign-progress-section">
                    <div className="campaign-progress-header">
                      <span className="campaign-progress-label">Deliverables Progress</span>
                      <span className="campaign-progress-pct">{camp.progress || 0}%</span>
                    </div>
                    <div className="campaign-progress-track">
                      <div
                        className="campaign-progress-fill"
                        style={{
                          width: `${Math.min(100, Math.max(0, camp.progress || 0))}%`,
                          background: getProgressGradient(camp.progress)
                        }}
                      />
                    </div>
                  </div>

                  {/* Campaign Details Dual-Metric Grid (Estimated Reach & Target Date) */}
                  <div className="campaign-details-grid">
                    <div className="campaign-detail-item">
                      <div
                        className="campaign-detail-icon"
                        style={{
                          background: isLight ? '#ecfeff' : 'rgba(6, 182, 212, 0.12)',
                          color: '#06b6d4'
                        }}
                      >
                        <TrendingUp size={15} />
                      </div>
                      <div className="campaign-detail-text">
                        <span className="campaign-detail-label">Est. Reach</span>
                        <span className="campaign-detail-val" title={camp.reach || 'N/A'}>
                          {camp.reach || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div
                      className="campaign-detail-item editable-date"
                      onClick={() => handleEditTargetDate(camp)}
                      title="Click to change target date"
                    >
                      <div
                        className="campaign-detail-icon"
                        style={{
                          background: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)',
                          color: '#f59e0b'
                        }}
                      >
                        <Calendar size={15} />
                      </div>
                      <div className="campaign-detail-text">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="campaign-detail-label">Target Date</span>
                          <span className="campaign-detail-edit-badge" title="Click to edit">
                            <Edit2 size={10} /> Edit
                          </span>
                        </div>
                        <span className="campaign-detail-val" title={camp.deadline || 'N/A'}>
                          {camp.deadline || 'TBD'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Budget & Action Buttons Footer */}
                <div className="campaign-card-footer">
                  <div className="campaign-budget-meta">
                    <span className="campaign-budget-label">Campaign Budget</span>
                    <span className="campaign-budget-amount">{camp.budget || '$0'}</span>
                  </div>

                  <div className="campaign-card-btns">
                    {camp.status !== 'Completed' && (
                      <button
                        type="button"
                        className="campaign-btn-complete"
                        onClick={() => {
                          if (updateCampaignStatus) {
                            updateCampaignStatus(camp.id, 'Completed');
                            if (addToast) {
                              addToast(`Campaign "${camp.title}" marked as Completed!`, 'success');
                            }
                          }
                        }}
                        title="Mark campaign as completed"
                      >
                        <CheckCircle size={13} color="#10b981" /> Complete
                      </button>
                    )}
                    <button
                      type="button"
                      className="campaign-btn-book"
                      onClick={() =>
                        openModal && openModal('scheduleShoot', { celebrity: camp.celebrity })
                      }
                      title="Schedule shoot session"
                    >
                      <Camera size={13} /> Book Shoot
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
