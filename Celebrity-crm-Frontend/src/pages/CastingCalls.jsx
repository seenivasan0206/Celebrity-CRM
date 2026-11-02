import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import { useNavigate } from 'react-router-dom';
import {
  Film,
  Sparkles,
  Plus,
  Users,
  Calendar,
  MapPin,
  Search,
  Video,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  Check,
  Building2,
  DollarSign,
  TrendingUp,
  Filter
} from 'lucide-react';

const defaultCastingCalls = [
  {
    id: 1,
    role: 'Lead Antagonist (Action Thriller)',
    production: 'Red Giant & Sun Pictures Co-Production',
    location: 'Chennai & Hyderabad',
    ageGroup: '30 - 45 Years',
    auditionsCount: 142,
    deadline: '15 Dec 2025',
    status: 'Open for Auditions',
    compensation: '₹40L - ₹65L',
    characterArchetype: 'Ruthless Syndicate Boss',
    submissionsReviewPct: 65,
    gender: 'Male / Any',
    urgency: 'High Priority'
  },
  {
    id: 2,
    role: 'Female Parallel Lead (Rom-Com)',
    production: 'Lyca Productions Feature Film',
    location: 'Bangalore & Chennai',
    ageGroup: '22 - 28 Years',
    auditionsCount: 89,
    deadline: '30 Nov 2025',
    status: 'Screen Tests Ongoing',
    compensation: '₹25L - ₹40L',
    characterArchetype: 'Architect & Free-spirited Traveler',
    submissionsReviewPct: 82,
    gender: 'Female',
    urgency: 'Screen Testing'
  },
  {
    id: 3,
    role: 'Youth Protagonist (Sports Drama)',
    production: 'Excel Entertainment Pan-India',
    location: 'Mumbai & Chennai',
    ageGroup: '20 - 26 Years',
    auditionsCount: 215,
    deadline: '20 Jan 2026',
    status: 'Open for Auditions',
    compensation: '₹30L - ₹50L',
    characterArchetype: 'Underdog National Boxer',
    submissionsReviewPct: 45,
    gender: 'Male',
    urgency: 'Open Call'
  },
  {
    id: 4,
    role: 'Stern Police Commissioner (Neo-Noir Crime)',
    production: 'Hombale Films Pan-India',
    location: 'Bangalore & Kochi',
    ageGroup: '40 - 55 Years',
    auditionsCount: 114,
    deadline: '10 Dec 2025',
    status: 'Screen Tests Ongoing',
    compensation: '₹35L - ₹55L',
    characterArchetype: 'Uncompromising Veteran Cop',
    submissionsReviewPct: 90,
    gender: 'Male / Female',
    urgency: 'Shortlisting'
  },
  {
    id: 5,
    role: 'Classical Fusion Lead Vocalist',
    production: 'Madras Talkies Musical Feature',
    location: 'Chennai & Tirupati',
    ageGroup: '19 - 30 Years',
    auditionsCount: 178,
    deadline: '05 Jan 2026',
    status: 'Open for Auditions',
    compensation: '₹20L - ₹30L',
    characterArchetype: 'Carnatic Prodigy with Modern Twist',
    submissionsReviewPct: 58,
    gender: 'Any',
    urgency: 'Vocal Auditions'
  },
  {
    id: 6,
    role: 'Corporate Tech Mogul (Cyber Thriller)',
    production: 'Mythri Movie Makers & Netflix',
    location: 'Hyderabad & Singapore',
    ageGroup: '35 - 50 Years',
    auditionsCount: 190,
    deadline: '15 Nov 2025',
    status: 'Closed / Cast',
    compensation: '₹50L - ₹80L',
    characterArchetype: 'Visionary AI Founder',
    submissionsReviewPct: 100,
    gender: 'Any',
    urgency: 'Role Filled'
  }
];

export default function CastingCalls() {
  const { addToast } = useCrm();
  const { theme } = useAuth();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  const [castingCalls, setCastingCalls] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_casting_calls');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return defaultCastingCalls;
  });

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCall, setNewCall] = useState({
    role: '',
    production: '',
    location: '',
    ageGroup: '20 - 35 Years',
    deadline: '2026-02-28',
    compensation: '₹25L - ₹45L',
    characterArchetype: '',
    status: 'Open for Auditions'
  });

  // KPI Metrics
  const totalCalls = castingCalls.length;
  const openCalls = castingCalls.filter((c) => c.status === 'Open for Auditions').length;
  const screenTests = castingCalls.filter((c) => c.status === 'Screen Tests Ongoing').length;
  const totalAuditionsReceived = useMemo(() => {
    return castingCalls.reduce((acc, c) => acc + (Number(c.auditionsCount) || 0), 0);
  }, [castingCalls]);

  // Filtered Casting Calls
  const filteredCalls = useMemo(() => {
    return castingCalls.filter((call) => {
      const matchesFilter =
        selectedFilter === 'All'
          ? true
          : selectedFilter === 'Open'
          ? call.status === 'Open for Auditions'
          : selectedFilter === 'Screen Tests'
          ? call.status === 'Screen Tests Ongoing'
          : selectedFilter === 'Closed'
          ? call.status === 'Closed / Cast'
          : call.status === selectedFilter;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (call.role || '').toLowerCase().includes(q) ||
        (call.production || '').toLowerCase().includes(q) ||
        (call.location || '').toLowerCase().includes(q) ||
        (call.characterArchetype || '').toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [castingCalls, selectedFilter, search]);

  const saveToStorage = (updated) => {
    setCastingCalls(updated);
    try {
      localStorage.setItem('zenve_casting_calls', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusCycle = (callId, e) => {
    e.stopPropagation();
    const updated = castingCalls.map((c) => {
      if (c.id === callId) {
        let nextStatus = 'Open for Auditions';
        if (c.status === 'Open for Auditions') nextStatus = 'Screen Tests Ongoing';
        else if (c.status === 'Screen Tests Ongoing') nextStatus = 'Closed / Cast';
        else nextStatus = 'Open for Auditions';
        return { ...c, status: nextStatus };
      }
      return c;
    });
    saveToStorage(updated);
    if (addToast) {
      addToast('Casting call status updated', 'info');
    }
  };

  const handleDeleteCall = (callId, e) => {
    e.stopPropagation();
    const updated = castingCalls.filter((c) => c.id !== callId);
    saveToStorage(updated);
    if (addToast) {
      addToast('Casting notice removed', 'info');
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCall.role.trim() || !newCall.production.trim()) {
      alert('Please fill out role title and production company.');
      return;
    }

    const created = {
      id: Date.now(),
      role: newCall.role.trim(),
      production: newCall.production.trim(),
      location: newCall.location.trim() || 'Pan-India',
      ageGroup: newCall.ageGroup.trim() || '20 - 35 Years',
      auditionsCount: 1,
      deadline: newCall.deadline || '2026-03-31',
      status: newCall.status || 'Open for Auditions',
      compensation: newCall.compensation.trim() || 'Industry Standard',
      characterArchetype: newCall.characterArchetype.trim() || 'Key Character',
      submissionsReviewPct: 10,
      gender: 'Any',
      urgency: 'New Notice'
    };

    const updated = [created, ...castingCalls];
    saveToStorage(updated);
    setIsModalOpen(false);
    setNewCall({
      role: '',
      production: '',
      location: '',
      ageGroup: '20 - 35 Years',
      deadline: '2026-02-28',
      compensation: '₹25L - ₹45L',
      characterArchetype: '',
      status: 'Open for Auditions'
    });
    if (addToast) {
      addToast(`Casting call "${created.role}" published successfully!`, 'success');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Open for Auditions') {
      return (
        <span className="casting-badge badge-open" title="Actively receiving candidate tapes">
          <span className="casting-dot dot-green" /> Open for Auditions
        </span>
      );
    }
    if (status === 'Screen Tests Ongoing') {
      return (
        <span className="casting-badge badge-testing" title="Candidates performing camera tests">
          <span className="casting-dot dot-amber" /> Screen Tests
        </span>
      );
    }
    return (
      <span className="casting-badge badge-closed" title="Role officially filled / contract executed">
        <CheckCircle2 size={12} /> Closed / Cast
      </span>
    );
  };

  return (
    <div className="casting-page-wrapper">
      <style>{`
        .casting-page-wrapper {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* Top KPI Banner */
        .casting-kpi-banner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .casting-kpi-banner {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .casting-kpi-banner {
            grid-template-columns: 1fr;
          }
        }

        .casting-kpi-card {
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: ${isLight ? '0 1px 3px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.3)'};
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .casting-kpi-card:hover {
          transform: translateY(-2px);
          border-color: ${isLight ? '#cbd5e1' : '#374151'};
          box-shadow: ${isLight ? '0 6px 16px rgba(0,0,0,0.08)' : '0 8px 20px rgba(0,0,0,0.45)'};
        }

        .casting-kpi-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .casting-kpi-meta {
          display: flex;
          flex-direction: column;
        }

        .casting-kpi-label {
          font-size: 0.70rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
        }

        .casting-kpi-value {
          font-size: 1.38rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.2;
          margin-top: 2px;
          font-family: var(--font-display);
        }

        /* Filter Toolbar */
        .casting-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .casting-filter-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .casting-filter-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 15px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .casting-filter-pill-btn:hover {
          border-color: #f59e0b;
          color: var(--text-main);
        }

        .casting-filter-pill-btn.active {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-color: #f59e0b;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
        }

        .casting-search-box {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 260px;
        }

        .casting-search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-dim);
          pointer-events: none;
        }

        .casting-search-input {
          width: 100%;
          padding: 8px 32px 8px 36px;
          border-radius: 10px;
          font-size: 0.84rem;
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          color: var(--text-main);
          outline: none;
          transition: all 0.2s ease;
        }

        .casting-search-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18);
        }

        .casting-search-clear {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Casting Calls Cards Grid */
        .casting-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }

        .casting-call-card {
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-shadow: ${isLight ? '0 2px 10px rgba(0, 0, 0, 0.05)' : '0 8px 24px rgba(0, 0, 0, 0.4)'};
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          position: relative;
        }

        .casting-call-card:hover {
          transform: translateY(-4px);
          border-color: ${isLight ? '#cbd5e1' : '#374151'};
          box-shadow: ${isLight ? '0 12px 28px rgba(0, 0, 0, 0.1)' : '0 16px 36px rgba(0, 0, 0, 0.55)'};
        }

        /* Top Bar */
        .casting-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .casting-production-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #f59e0b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .casting-role-title {
          font-size: 1.12rem;
          font-weight: 800;
          color: var(--text-main);
          margin-top: 4px;
          line-height: 1.3;
        }

        .casting-archetype-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: ${isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)'};
          border: 1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'};
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-top: 8px;
        }

        /* Badges */
        .casting-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          font-size: 0.70rem;
          font-weight: 700;
          border-radius: 9999px;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          transition: all 0.15s ease;
        }

        .casting-badge:hover {
          opacity: 0.88;
          transform: scale(1.02);
        }

        .badge-open {
          background: ${isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.14)'};
          color: #10b981;
          border: 1px solid ${isLight ? '#a7f3d0' : 'rgba(16, 185, 129, 0.35)'};
        }

        .badge-testing {
          background: ${isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.14)'};
          color: #f59e0b;
          border: 1px solid ${isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.35)'};
        }

        .badge-closed {
          background: ${isLight ? '#f1f5f9' : 'rgba(148, 163, 184, 0.12)'};
          color: #94a3b8;
          border: 1px solid ${isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.25)'};
        }

        .casting-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .dot-green {
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        .dot-amber {
          background: #f59e0b;
          box-shadow: 0 0 6px #f59e0b;
        }

        /* Details List */
        .casting-details-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 16px 0;
          padding: 12px;
          border-radius: 12px;
          background: ${isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .casting-detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .casting-detail-left {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--text-dim);
        }

        .casting-detail-val {
          font-weight: 700;
          color: var(--text-main);
        }

        /* Progress Bar Section */
        .casting-progress-section {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .casting-progress-labels {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-dim);
        }

        .casting-progress-track {
          height: 6px;
          width: 100%;
          border-radius: 9999px;
          background: ${isLight ? '#e2e8f0' : '#1e293b'};
          overflow: hidden;
        }

        .casting-progress-fill {
          height: 100%;
          border-radius: 9999px;
          background: linear-gradient(90deg, #f59e0b 0%, #10b981 100%);
          transition: width 0.4s ease;
        }

        /* Card Footer */
        .casting-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          gap: 10px;
        }

        .casting-count-badge {
          display: flex;
          flex-direction: column;
        }

        .casting-count-number {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          font-family: var(--font-display);
        }

        .casting-count-desc {
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .casting-actions-group {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .casting-btn-review {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.78rem;
          font-weight: 700;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .casting-btn-review:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.45);
        }

        .casting-btn-delete {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .casting-btn-delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Modal Styles */
        .casting-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1000;
          animation: castingModalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes castingModalIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .casting-modal-dialog {
          background: ${isLight ? '#ffffff' : '#111827'};
          border: 1px solid ${isLight ? '#e2e8f0' : '#1f2937'};
          border-radius: 20px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .casting-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid ${isLight ? '#f1f5f9' : '#1f2937'};
        }

        .casting-modal-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .casting-modal-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 75vh;
          overflow-y: auto;
        }

        .casting-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .casting-form-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .casting-form-input {
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 0.85rem;
          background: ${isLight ? '#ffffff' : '#0f172a'};
          border: 1.5px solid ${isLight ? '#cbd5e1' : '#334155'};
          color: var(--text-main);
          outline: none;
          transition: all 0.15s ease;
        }

        .casting-form-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18);
        }

        .casting-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid ${isLight ? '#f1f5f9' : '#1f2937'};
          background: ${isLight ? '#fafafa' : '#0f172a'};
        }
      `}</style>

      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <h2>Casting Calls & Auditions ({totalCalls})</h2>
          <p>Character breakdowns, studio notices, and talent audition pipelines</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Post Casting Call
        </button>
      </div>

      {/* KPI Metrics Banner */}
      <div className="casting-kpi-banner">
        <div className="casting-kpi-card">
          <div
            className="casting-kpi-icon"
            style={{
              background: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)',
              color: '#f59e0b'
            }}
          >
            <Film size={21} />
          </div>
          <div className="casting-kpi-meta">
            <span className="casting-kpi-label">Active Notices</span>
            <span className="casting-kpi-value">{totalCalls}</span>
          </div>
        </div>

        <div className="casting-kpi-card">
          <div
            className="casting-kpi-icon"
            style={{
              background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
              color: '#10b981'
            }}
          >
            <Sparkles size={21} />
          </div>
          <div className="casting-kpi-meta">
            <span className="casting-kpi-label">Open for Auditions</span>
            <span className="casting-kpi-value">{openCalls}</span>
          </div>
        </div>

        <div className="casting-kpi-card">
          <div
            className="casting-kpi-icon"
            style={{
              background: isLight ? '#eff6ff' : 'rgba(59, 130, 246, 0.12)',
              color: '#3b82f6'
            }}
          >
            <Video size={21} />
          </div>
          <div className="casting-kpi-meta">
            <span className="casting-kpi-label">Screen Tests Ongoing</span>
            <span className="casting-kpi-value">{screenTests}</span>
          </div>
        </div>

        <div className="casting-kpi-card">
          <div
            className="casting-kpi-icon"
            style={{
              background: isLight ? '#fdf2f8' : 'rgba(236, 72, 153, 0.12)',
              color: '#ec4899'
            }}
          >
            <Users size={21} />
          </div>
          <div className="casting-kpi-meta">
            <span className="casting-kpi-label">Tapes Received</span>
            <span className="casting-kpi-value">{totalAuditionsReceived}</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="casting-toolbar">
        <div className="casting-filter-pills">
          {['All', 'Open', 'Screen Tests', 'Closed'].map((filter) => {
            const count =
              filter === 'All'
                ? totalCalls
                : filter === 'Open'
                ? openCalls
                : filter === 'Screen Tests'
                ? screenTests
                : castingCalls.filter((c) => c.status === 'Closed / Cast').length;

            return (
              <button
                key={filter}
                type="button"
                className={`casting-filter-pill-btn ${selectedFilter === filter ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter)}
              >
                <span>{filter === 'All' ? 'All Notices' : filter}</span>
                <span
                  style={{
                    fontSize: '0.70rem',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: selectedFilter === filter ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-card-alt)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="casting-search-box">
          <Search size={15} className="casting-search-icon" />
          <input
            type="text"
            className="casting-search-input"
            placeholder="Search by role, studio, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="casting-search-clear"
              onClick={() => setSearch('')}
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Casting Call Cards */}
      {filteredCalls.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-dim)' }}>
          <Film size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
          <h3>No casting calls match your criteria</h3>
          <p style={{ fontSize: '0.84rem' }}>Try clearing your search or switching filter tabs.</p>
        </div>
      ) : (
        <div className="casting-cards-grid">
          {filteredCalls.map((call) => (
            <div key={call.id} className="casting-call-card">
              <div>
                {/* Production Banner & Status Badge */}
                <div className="casting-card-header">
                  <span className="casting-production-tag" title={call.production}>
                    <Building2 size={13} /> {call.production}
                  </span>
                  <div
                    onClick={(e) => handleStatusCycle(call.id, e)}
                    title="Click to cycle status: Open -> Screen Tests -> Closed"
                  >
                    {getStatusBadge(call.status)}
                  </div>
                </div>

                {/* Role Title */}
                <h3 className="casting-role-title">{call.role}</h3>

                {/* Character Archetype */}
                {call.characterArchetype && (
                  <div className="casting-archetype-pill">
                    <Sparkles size={12} color="#f59e0b" />
                    <span>Archetype: <strong>{call.characterArchetype}</strong></span>
                  </div>
                )}

                {/* Detailed Criteria Grid */}
                <div className="casting-details-list">
                  <div className="casting-detail-row">
                    <div className="casting-detail-left">
                      <MapPin size={13} color="var(--primary)" />
                      <span>Location</span>
                    </div>
                    <span className="casting-detail-val">{call.location}</span>
                  </div>

                  <div className="casting-detail-row">
                    <div className="casting-detail-left">
                      <Users size={13} color="#06B6D4" />
                      <span>Age Group</span>
                    </div>
                    <span className="casting-detail-val">{call.ageGroup}</span>
                  </div>

                  {call.compensation && (
                    <div className="casting-detail-row">
                      <div className="casting-detail-left">
                        <DollarSign size={13} color="#10B981" />
                        <span>Compensation</span>
                      </div>
                      <span className="casting-detail-val" style={{ color: '#10B981' }}>
                        {call.compensation}
                      </span>
                    </div>
                  )}

                  <div className="casting-detail-row">
                    <div className="casting-detail-left">
                      <Calendar size={13} color="#F59E0B" />
                      <span>Audition Deadline</span>
                    </div>
                    <span className="casting-detail-val">{call.deadline}</span>
                  </div>
                </div>

                {/* Review Progress Tracker */}
                <div className="casting-progress-section">
                  <div className="casting-progress-labels">
                    <span>Tape Screening Progress</span>
                    <span>{call.submissionsReviewPct || 50}%</span>
                  </div>
                  <div className="casting-progress-track">
                    <div
                      className="casting-progress-fill"
                      style={{ width: `${call.submissionsReviewPct || 50}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="casting-card-footer">
                <div className="casting-count-badge">
                  <span className="casting-count-number">{call.auditionsCount}</span>
                  <span className="casting-count-desc">Tapes Submitted</span>
                </div>

                <div className="casting-actions-group">
                  <button
                    type="button"
                    className="casting-btn-review"
                    onClick={() => navigate('/applications')}
                    title="Review audition tapes and self-audition video reels"
                  >
                    <Video size={13} /> Review Tapes
                  </button>

                  <button
                    type="button"
                    className="casting-btn-delete"
                    onClick={(e) => handleDeleteCall(call.id, e)}
                    title="Delete notice"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Casting Call Modal */}
      {isModalOpen && (
        <div className="casting-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="casting-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="casting-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Film size={20} color="#f59e0b" />
                <h3>Post New Casting Call</h3>
              </div>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="casting-modal-body">
                <div className="casting-form-group">
                  <label className="casting-form-label">Role Title *</label>
                  <input
                    type="text"
                    className="casting-form-input"
                    placeholder="e.g. Lead Antagonist (Action Thriller)"
                    required
                    value={newCall.role}
                    onChange={(e) => setNewCall({ ...newCall, role: e.target.value })}
                  />
                </div>

                <div className="casting-form-group">
                  <label className="casting-form-label">Production House / Studio *</label>
                  <input
                    type="text"
                    className="casting-form-input"
                    placeholder="e.g. Lyca Productions or Sun Pictures"
                    required
                    value={newCall.production}
                    onChange={(e) => setNewCall({ ...newCall, production: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="casting-form-group">
                    <label className="casting-form-label">Location</label>
                    <input
                      type="text"
                      className="casting-form-input"
                      placeholder="e.g. Chennai & Hyderabad"
                      value={newCall.location}
                      onChange={(e) => setNewCall({ ...newCall, location: e.target.value })}
                    />
                  </div>

                  <div className="casting-form-group">
                    <label className="casting-form-label">Age Group Criteria</label>
                    <input
                      type="text"
                      className="casting-form-input"
                      placeholder="e.g. 24 - 32 Years"
                      value={newCall.ageGroup}
                      onChange={(e) => setNewCall({ ...newCall, ageGroup: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="casting-form-group">
                    <label className="casting-form-label">Budget / Compensation</label>
                    <input
                      type="text"
                      className="casting-form-input"
                      placeholder="e.g. ₹30L - ₹50L"
                      value={newCall.compensation}
                      onChange={(e) => setNewCall({ ...newCall, compensation: e.target.value })}
                    />
                  </div>

                  <div className="casting-form-group">
                    <label className="casting-form-label">Audition Cutoff Date</label>
                    <input
                      type="date"
                      className="casting-form-input"
                      value={newCall.deadline}
                      onChange={(e) => setNewCall({ ...newCall, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="casting-form-group">
                  <label className="casting-form-label">Character Archetype / Description</label>
                  <input
                    type="text"
                    className="casting-form-input"
                    placeholder="e.g. Charismatic Tech Innovator with a Hidden Motive"
                    value={newCall.characterArchetype}
                    onChange={(e) => setNewCall({ ...newCall, characterArchetype: e.target.value })}
                  />
                </div>
              </div>

              <div className="casting-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none' }}
                >
                  <Sparkles size={16} /> Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
