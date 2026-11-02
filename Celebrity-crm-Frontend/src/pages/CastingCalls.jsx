import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
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
  Trash2,
  X,
  Building2,
  DollarSign
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
    role: 'Tech Billionaire Villain (Cyber Action)',
    production: 'Mythri Movie Makers Sci-Fi Thriller',
    location: 'Hyderabad & Dubai',
    ageGroup: '35 - 50 Years',
    auditionsCount: 96,
    deadline: '28 Feb 2026',
    status: 'Open for Auditions',
    compensation: '₹50L - ₹80L',
    characterArchetype: 'Cold & Visionary Tech Mogul',
    submissionsReviewPct: 35,
    gender: 'Male / Any',
    urgency: 'Auditions Open'
  }
];

export default function CastingCalls() {
  const { addToast } = useCrm();
  const navigate = useNavigate();

  const normalizeCall = (c) => ({
    id: c.id,
    role: c.roleName || c.role || 'Key Role',
    production: c.projectTitle || c.production || 'Production House',
    location: c.location || 'Pan-India',
    ageGroup: c.ageGroup || (c.characterAgeMin && c.characterAgeMax ? `${c.characterAgeMin} - ${c.characterAgeMax} Years` : '20 - 45 Years'),
    auditionsCount: c.applicationsCount !== undefined ? c.applicationsCount : (c.auditionsCount || 0),
    deadline: c.deadline || 'Ongoing',
    status: c.status === 'OPEN' ? 'Open for Auditions' :
            c.status === 'SCREEN_TESTS' ? 'Screen Tests Ongoing' :
            c.status === 'CLOSED' ? 'Closed / Cast' : (c.status || 'Open for Auditions'),
    rawStatus: c.status,
    compensation: c.compensation || '₹25L - ₹45L',
    characterArchetype: c.roleDescription || c.characterArchetype || 'Key Character',
    submissionsReviewPct: c.submissionsReviewPct || (c.applicationsCount ? Math.min(100, c.applicationsCount * 25) : 50),
    gender: c.gender || 'Any'
  });

  const [castingCalls, setCastingCalls] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_casting_calls');
      return saved ? JSON.parse(saved) : defaultCastingCalls;
    } catch {
      return defaultCastingCalls;
    }
  });

  const [loading, setLoading] = useState(true);
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

  // Fetch live notices from Spring Boot backend
  useEffect(() => {
    let isMounted = true;
    const fetchCalls = async () => {
      try {
        const live = await api.casting.getCalls();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          const normalized = live.map(normalizeCall);
          setCastingCalls(normalized);
          localStorage.setItem('zenve_casting_calls', JSON.stringify(normalized));
        }
      } catch (err) {
        console.warn('Backend unavailable, using cached calls:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCalls();
    return () => { isMounted = false; };
  }, []);

  const saveToStorage = (updated) => {
    setCastingCalls(updated);
    try {
      localStorage.setItem('zenve_casting_calls', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusCycle = async (id, e) => {
    e.stopPropagation();
    const targetCall = castingCalls.find((c) => c.id === id);
    if (!targetCall) return;

    let nextDisplay = 'Open for Auditions';
    let nextBackend = 'OPEN';
    if (targetCall.status === 'Open for Auditions' || targetCall.rawStatus === 'OPEN') {
      nextDisplay = 'Screen Tests Ongoing';
      nextBackend = 'SCREEN_TESTS';
    } else if (targetCall.status === 'Screen Tests Ongoing' || targetCall.rawStatus === 'SCREEN_TESTS') {
      nextDisplay = 'Closed / Cast';
      nextBackend = 'CLOSED';
    } else {
      nextDisplay = 'Open for Auditions';
      nextBackend = 'OPEN';
    }

    const updated = castingCalls.map((c) => {
      if (c.id === id) {
        return { ...c, status: nextDisplay, rawStatus: nextBackend };
      }
      return c;
    });
    saveToStorage(updated);

    try {
      await api.casting.updateCallStatus(id, nextBackend);
      if (addToast) {
        addToast(`Status updated to "${nextDisplay}"`, 'info');
      }
    } catch (err) {
      console.warn('Backend status update failed:', err.message);
      if (addToast) {
        addToast(`Status updated (${nextDisplay})`, 'info');
      }
    }
  };

  const handleDeleteCall = async (id, e) => {
    e.stopPropagation();
    const updated = castingCalls.filter((c) => c.id !== id);
    saveToStorage(updated);

    try {
      await api.casting.deleteCall(id);
      if (addToast) {
        addToast('Notice removed successfully', 'info');
      }
    } catch (err) {
      console.warn('Backend delete failed:', err.message);
      if (addToast) {
        addToast('Notice removed locally', 'info');
      }
    }
  };

  const filteredCalls = useMemo(() => {
    return castingCalls.filter((call) => {
      if (selectedFilter === 'Open' && call.status !== 'Open for Auditions') return false;
      if (selectedFilter === 'Screen Tests' && call.status !== 'Screen Tests Ongoing') return false;
      if (selectedFilter === 'Closed' && call.status !== 'Closed / Cast') return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        call.role.toLowerCase().includes(q) ||
        call.production.toLowerCase().includes(q) ||
        call.location.toLowerCase().includes(q) ||
        call.characterArchetype.toLowerCase().includes(q)
      );
    });
  }, [castingCalls, selectedFilter, search]);

  const totalCalls = castingCalls.length;
  const openCalls = castingCalls.filter((c) => c.status === 'Open for Auditions').length;
  const screenTests = castingCalls.filter((c) => c.status === 'Screen Tests Ongoing').length;
  const totalAuditionsReceived = castingCalls.reduce((acc, c) => acc + (c.auditionsCount || 0), 0);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newCall.role.trim() || !newCall.production.trim()) return;

    const payload = {
      projectTitle: newCall.production.trim(),
      roleName: newCall.role.trim(),
      roleDescription: newCall.characterArchetype.trim() || 'Key Character',
      location: newCall.location.trim() || 'Pan-India',
      ageGroup: newCall.ageGroup.trim() || '20 - 35 Years',
      deadline: newCall.deadline || '2026-03-31',
      status: 'OPEN',
      compensation: newCall.compensation.trim() || 'Industry Standard',
      gender: 'Any'
    };

    try {
      const createdBackend = await api.casting.createCall(payload);
      const normalized = normalizeCall(createdBackend);
      const updated = [normalized, ...castingCalls.filter(c => c.id !== normalized.id)];
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
        addToast(`Casting call "${normalized.role}" published successfully!`, 'success');
      }
    } catch (err) {
      console.warn('Backend call failed, creating locally:', err.message);
      const fallbackCreated = {
        id: Date.now(),
        role: newCall.role.trim(),
        production: newCall.production.trim(),
        location: newCall.location.trim() || 'Pan-India',
        ageGroup: newCall.ageGroup.trim() || '20 - 35 Years',
        auditionsCount: 1,
        deadline: newCall.deadline || '2026-03-31',
        status: 'Open for Auditions',
        compensation: newCall.compensation.trim() || 'Industry Standard',
        characterArchetype: newCall.characterArchetype.trim() || 'Key Character',
        submissionsReviewPct: 10,
        gender: 'Any',
        urgency: 'New Notice'
      };
      const updated = [fallbackCreated, ...castingCalls];
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
        addToast(`Casting call "${fallbackCreated.role}" published!`, 'success');
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Open for Auditions') {
      return (
        <span className="badge badge-accent">
          Open for Auditions
        </span>
      );
    }
    if (status === 'Screen Tests Ongoing') {
      return (
        <span className="badge badge-primary">
          Screen Tests
        </span>
      );
    }
    return (
      <span className="badge badge-secondary">
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
          gap: 20px;
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
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.18s ease, border-color 0.18s ease;
        }

        .casting-kpi-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-medium);
        }

        .casting-kpi-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--bg-card-alt);
          border: 1px solid var(--border-subtle);
          color: var(--primary);
        }

        .casting-kpi-meta {
          display: flex;
          flex-direction: column;
        }

        .casting-kpi-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
        }

        .casting-kpi-value {
          font-size: 1.35rem;
          font-weight: 700;
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
          gap: 12px;
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
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .casting-filter-pill-btn:hover {
          border-color: var(--border-medium);
          color: var(--text-main);
        }

        .casting-filter-pill-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #ffffff;
        }

        .casting-search-box {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 250px;
        }

        .casting-search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-dim);
          pointer-events: none;
        }

        .casting-search-input {
          width: 100%;
          padding: 8px 30px 8px 34px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-main);
          outline: none;
          transition: all 0.15s ease;
        }

        .casting-search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-subtle);
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
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 18px;
        }

        .casting-call-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-shadow: var(--shadow-card);
          transition: transform 0.18s ease, border-color 0.18s ease;
          position: relative;
        }

        .casting-call-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-medium);
        }

        .casting-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .casting-production-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .casting-role-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin-top: 3px;
          line-height: 1.3;
        }

        .casting-archetype-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border-subtle);
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-top: 6px;
        }

        /* Details List */
        .casting-details-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin: 14px 0;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background: var(--bg-card-alt);
          border: 1px solid var(--border-subtle);
          font-size: 0.76rem;
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
          gap: 6px;
          color: var(--text-dim);
        }

        .casting-detail-val {
          font-weight: 600;
          color: var(--text-main);
        }

        /* Progress Bar Section */
        .casting-progress-section {
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .casting-progress-labels {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-dim);
        }

        .casting-progress-track {
          height: 5px;
          width: 100%;
          border-radius: var(--radius-full);
          background: var(--bg-card-alt);
          overflow: hidden;
        }

        .casting-progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          background: var(--primary);
          transition: width 0.3s ease;
        }

        /* Card Footer */
        .casting-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
          gap: 10px;
        }

        .casting-count-badge {
          display: flex;
          flex-direction: column;
        }

        .casting-count-number {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
          font-family: var(--font-display);
        }

        .casting-count-desc {
          font-size: 0.66rem;
          font-weight: 600;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .casting-actions-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .casting-btn-review {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: var(--radius-md);
          font-size: 0.76rem;
          font-weight: 600;
          background: var(--primary);
          color: #ffffff;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: var(--shadow-sm);
        }

        .casting-btn-review:hover {
          background: var(--primary-hover);
        }

        .casting-btn-delete {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .casting-btn-delete:hover {
          color: var(--text-main);
          background: var(--bg-hover);
        }

        /* Modal Styles */
        .casting-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 15, 23, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1000;
        }

        .casting-modal-dialog {
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 500px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .casting-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .casting-modal-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }

        .casting-modal-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 75vh;
          overflow-y: auto;
        }

        .casting-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .casting-form-label {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .casting-form-input {
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 0.84rem;
          background: var(--bg-card-alt);
          border: 1px solid var(--border-subtle);
          color: var(--text-main);
          outline: none;
          transition: all 0.15s ease;
        }

        .casting-form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-subtle);
        }

        .casting-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding: 14px 20px;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-card-alt);
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
          <div className="casting-kpi-icon">
            <Film size={20} />
          </div>
          <div className="casting-kpi-meta">
            <span className="casting-kpi-label">Active Notices</span>
            <span className="casting-kpi-value">{totalCalls}</span>
          </div>
        </div>

        <div className="casting-kpi-card">
          <div className="casting-kpi-icon">
            <Sparkles size={20} />
          </div>
          <div className="casting-kpi-meta">
            <span className="casting-kpi-label">Open for Auditions</span>
            <span className="casting-kpi-value">{openCalls}</span>
          </div>
        </div>

        <div className="casting-kpi-card">
          <div className="casting-kpi-icon">
            <Video size={20} />
          </div>
          <div className="casting-kpi-meta">
            <span className="casting-kpi-label">Screen Tests Ongoing</span>
            <span className="casting-kpi-value">{screenTests}</span>
          </div>
        </div>

        <div className="casting-kpi-card">
          <div className="casting-kpi-icon">
            <Users size={20} />
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
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: selectedFilter === filter ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-card-alt)'
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
          <p style={{ fontSize: '0.82rem' }}>Try clearing your search or switching filter tabs.</p>
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
                    title="Click to cycle status"
                    style={{ cursor: 'pointer' }}
                  >
                    {getStatusBadge(call.status)}
                  </div>
                </div>

                {/* Role Title */}
                <h3 className="casting-role-title">{call.role}</h3>

                {/* Character Archetype */}
                {call.characterArchetype && (
                  <div className="casting-archetype-pill">
                    <Sparkles size={12} color="var(--primary)" />
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
                      <Users size={13} color="var(--secondary)" />
                      <span>Age Group</span>
                    </div>
                    <span className="casting-detail-val">{call.ageGroup}</span>
                  </div>

                  {call.compensation && (
                    <div className="casting-detail-row">
                      <div className="casting-detail-left">
                        <DollarSign size={13} color="var(--accent)" />
                        <span>Compensation</span>
                      </div>
                      <span className="casting-detail-val" style={{ color: 'var(--accent)' }}>
                        {call.compensation}
                      </span>
                    </div>
                  )}

                  <div className="casting-detail-row">
                    <div className="casting-detail-left">
                      <Calendar size={13} color="var(--secondary)" />
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
                    title="Review audition tapes"
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
                <Film size={18} color="var(--primary)" />
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
