import React, { useState, useEffect, useMemo } from 'react';
import { useCrm } from '../context/CrmContext';
import {
  Tv,
  Plus,
  Calendar,
  Film,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  Search,
  DollarSign,
  Clapperboard,
  ArrowUpDown,
  ExternalLink,
  Users,
  Clock,
  Layers,
  ChevronRight,
  Send,
  Video
} from 'lucide-react';
import api from '../services/api';

const KNOWN_STAR_AVATARS = {
  'vijay': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'nayanthara': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'suriya': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'ajith kumar': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'trisha': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'dhanush': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'anirudh ravichander': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'samantha': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
};

const GENRE_POSTERS = {
  thriller: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  period: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  scifi: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  action: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  drama: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'
};

const POSTER_PRESETS = [
  { key: 'thriller', label: 'Neo-Noir Thriller', url: GENRE_POSTERS.thriller },
  { key: 'period', label: 'Historical Saga', url: GENRE_POSTERS.period },
  { key: 'scifi', label: 'Sci-Fi Action', url: GENRE_POSTERS.scifi },
  { key: 'drama', label: 'Cinema Drama', url: GENRE_POSTERS.drama }
];

const PLATFORMS = [
  { name: 'Netflix India', key: 'netflix', badgeClass: 'netflix' },
  { name: 'Prime Video Originals', key: 'prime', badgeClass: 'prime' },
  { name: 'Sony LIV', key: 'sonyliv', badgeClass: 'sonyliv' },
  { name: 'Disney+ Hotstar', key: 'hotstar', badgeClass: 'hotstar' },
  { name: 'Zee5 Global', key: 'zee5', badgeClass: 'zee5' },
  { name: 'Apple TV+', key: 'appletv', badgeClass: 'appletv' }
];

const STAGES = [
  { key: 'Pre-Production', label: 'Pre-Prod', pct: 25 },
  { key: 'Production Phase', label: 'Filming', pct: 55 },
  { key: 'Post-Production', label: 'Post-Prod', pct: 85 },
  { key: 'Streaming Live', label: 'Streaming', pct: 100 }
];

// 100% Real-time dynamic backend OTT projects

export default function OttProjects() {
  const { celebrities, addToast, openModal, addActivity } = useCrm();

  const normalizeProject = (p) => {
    let rawBudget = typeof p.budget === 'number' ? p.budget : parseFloat(String(p.budget || '4000000').replace(/[^0-9.]/g, ''));
    if (isNaN(rawBudget) || rawBudget <= 0) rawBudget = 4000000;

    let displayBudget = `$${(rawBudget / 1000000).toFixed(1)}M`;
    if (rawBudget < 1000000) {
      displayBudget = `$${Number(rawBudget).toLocaleString()}`;
    }

    // Normalize status string
    let normalizedStatus = p.status || 'Pre-Production';
    const sLower = normalizedStatus.toLowerCase();
    if (sLower.includes('post')) normalizedStatus = 'Post-Production';
    else if (sLower.includes('production') && !sLower.includes('pre')) normalizedStatus = 'Production Phase';
    else if (sLower.includes('stream') || sLower.includes('live') || sLower.includes('released')) normalizedStatus = 'Streaming Live';
    else normalizedStatus = 'Pre-Production';

    return {
      id: p.id,
      title: p.title || 'Untitled Series',
      platform: p.platform || 'Netflix India',
      genre: p.genre || 'Action / Drama',
      leadStar: p.leadStar || p.celebrityName || 'Vijay',
      episodes: Number(p.episodes) || 8,
      status: normalizedStatus,
      budget: displayBudget,
      rawBudget: rawBudget,
      expectedRelease: p.expectedRelease || (p.releaseDate ? p.releaseDate : 'Late 2026'),
      director: p.director || 'Director Assigned',
      producer: p.producer || 'Zenve Studios',
      description: p.description || 'Exclusive multi-episode streaming production slate under development with leading talent.',
      poster: p.poster || null
    };
  };

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_ott_projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Form State for New OTT Production
  const [newProject, setNewProject] = useState({
    title: '',
    platform: 'Netflix India',
    genre: 'Crime Thriller',
    leadStar: 'Vijay',
    episodes: 8,
    budget: 4500000,
    expectedRelease: 'Late 2026',
    status: 'Pre-Production',
    director: '',
    producer: '',
    description: '',
    poster: GENRE_POSTERS.thriller
  });

  // Live Backend Fetch
  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const live = await api.ott.getAll();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          const normalized = live.map(normalizeProject);
          setProjects(normalized);
          localStorage.setItem('zenve_ott_projects', JSON.stringify(normalized));
        }
      } catch (err) {
        console.warn('Backend unavailable, using cached OTT projects:', err.message);
      }
    };
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to resolve celebrity avatar
  const getLeadStarAvatar = (starName) => {
    if (!starName) return null;
    const key = starName.toLowerCase().trim();
    if (KNOWN_STAR_AVATARS[key]) return KNOWN_STAR_AVATARS[key];

    // Check CRM roster
    const match = (celebrities || []).find(
      (c) => (c.name || '').toLowerCase().trim() === key
    );
    if (match && match.avatar) return match.avatar;

    return null;
  };

  // Helper to resolve cover image
  const getProjectPoster = (proj) => {
    if (proj.poster) return proj.poster;
    const g = (proj.genre || '').toLowerCase();
    const t = (proj.title || '').toLowerCase();

    if (g.includes('thrill') || g.includes('noir') || t.includes('shadow')) return GENRE_POSTERS.thriller;
    if (g.includes('period') || g.includes('histor') || t.includes('queen')) return GENRE_POSTERS.period;
    if (g.includes('sci-fi') || g.includes('cyber') || t.includes('vortex')) return GENRE_POSTERS.scifi;
    if (g.includes('action') || g.includes('crime')) return GENRE_POSTERS.action;
    return GENRE_POSTERS.drama;
  };

  // Helper for platform badge class
  const getPlatformClass = (platform) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('netflix')) return 'netflix';
    if (p.includes('prime')) return 'prime';
    if (p.includes('sony')) return 'sonyliv';
    if (p.includes('hotstar')) return 'hotstar';
    if (p.includes('zee')) return 'zee5';
    if (p.includes('apple')) return 'appletv';
    return 'default';
  };

  // Helper for stage progress percent
  const getStagePct = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('stream') || s.includes('live')) return 100;
    if (s.includes('post')) return 80;
    if (s.includes('production') && !s.includes('pre')) return 50;
    return 25;
  };

  // Status Cycle Handler
  const handleStatusCycle = async (id, e) => {
    if (e) e.stopPropagation();
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    let nextStatus = 'Pre-Production';
    if (target.status === 'Pre-Production') nextStatus = 'Production Phase';
    else if (target.status === 'Production Phase') nextStatus = 'Post-Production';
    else if (target.status === 'Post-Production') nextStatus = 'Streaming Live';
    else nextStatus = 'Pre-Production';

    const updated = projects.map((p) => (p.id === id ? { ...p, status: nextStatus } : p));
    setProjects(updated);
    localStorage.setItem('zenve_ott_projects', JSON.stringify(updated));

    if (selectedProject && selectedProject.id === id) {
      setSelectedProject((prev) => ({ ...prev, status: nextStatus }));
    }

    try {
      await api.ott.updateStatus(id, nextStatus);
      addToast(`Status advanced to "${nextStatus}" in database!`, 'success');
    } catch (err) {
      console.warn('Backend status update fallback:', err.message);
      addToast(`Status updated to "${nextStatus}"`, 'info');
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async (id, e) => {
    if (e) e.stopPropagation();
    const target = projects.find((p) => p.id === id);
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem('zenve_ott_projects', JSON.stringify(updated));

    if (selectedProject && selectedProject.id === id) {
      setSelectedProject(null);
    }

    try {
      await api.ott.delete(id);
      addToast(`OTT production "${target?.title || 'Series'}" removed from database`, 'info');
    } catch (err) {
      console.warn('Backend delete fallback:', err.message);
      addToast(`Project removed from slate`, 'info');
    }
  };

  // Create Form Submit Handler
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.leadStar.trim()) {
      addToast('Please provide a Series Title and Lead Star', 'warning');
      return;
    }

    const payload = {
      title: newProject.title.trim(),
      platform: newProject.platform,
      genre: newProject.genre.trim() || 'Entertainment',
      leadStar: newProject.leadStar.trim(),
      episodes: Number(newProject.episodes) || 8,
      budget: Number(newProject.budget) || 4500000,
      expectedRelease: newProject.expectedRelease.trim() || 'Late 2026',
      status: newProject.status || 'Pre-Production',
      director: newProject.director.trim() || 'Showrunner TBD',
      producer: newProject.producer.trim() || 'Zenve Studios',
      description: newProject.description.trim() || 'Premium multi-episode streaming series commissioned for production.'
    };

    try {
      const created = await api.ott.create(payload);
      const normalized = normalizeProject(created);
      normalized.poster = newProject.poster;
      const updated = [normalized, ...projects.filter((p) => p.id !== normalized.id)];
      setProjects(updated);
      localStorage.setItem('zenve_ott_projects', JSON.stringify(updated));

      if (addActivity) {
        addActivity({
          type: 'campaign',
          title: `New OTT Production Slate: ${normalized.title}`,
          desc: `${normalized.platform} | Star: ${normalized.leadStar} (${normalized.budget})`,
          time: 'Just now'
        });
      }

      setIsCreateModalOpen(false);
      setNewProject({
        title: '',
        platform: 'Netflix India',
        genre: 'Crime Thriller',
        leadStar: 'Vijay',
        episodes: 8,
        budget: 4500000,
        expectedRelease: 'Late 2026',
        status: 'Pre-Production',
        director: '',
        producer: '',
        description: '',
        poster: GENRE_POSTERS.thriller
      });
      addToast(`OTT Project "${created.title}" successfully onboarded!`, 'success');
    } catch (err) {
      console.warn('Backend create fallback:', err.message);
      const fallback = normalizeProject({
        id: Date.now(),
        ...payload,
        poster: newProject.poster
      });
      const updated = [fallback, ...projects];
      setProjects(updated);
      localStorage.setItem('zenve_ott_projects', JSON.stringify(updated));
      setIsCreateModalOpen(false);
      addToast(`OTT Project "${fallback.title}" created locally`, 'info');
    }
  };

  // KPIs
  const totalProjects = projects.length;

  const totalSlateBudget = useMemo(() => {
    const sum = projects.reduce((acc, p) => {
      const b = p.rawBudget || 4000000;
      // Filter out astronomical outlier test numbers for clean UI
      return acc + (b > 100000000 ? 5000000 : b);
    }, 0);
    return `$${(sum / 1000000).toFixed(1)}M`;
  }, [projects]);

  const uniquePlatformsCount = useMemo(() => {
    return new Set(projects.map((p) => p.platform)).size;
  }, [projects]);

  const activeInProductionCount = useMemo(() => {
    return projects.filter(
      (p) => p.status === 'Production Phase' || p.status === 'Post-Production'
    ).length;
  }, [projects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((proj) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (proj.title || '').toLowerCase().includes(q) ||
          (proj.leadStar || '').toLowerCase().includes(q) ||
          (proj.genre || '').toLowerCase().includes(q) ||
          (proj.director || '').toLowerCase().includes(q) ||
          (proj.platform || '').toLowerCase().includes(q);

        const matchesPlatform =
          selectedPlatform === 'All' ||
          (proj.platform || '').toLowerCase().includes(selectedPlatform.toLowerCase());

        const matchesStatus =
          selectedStatus === 'All' ||
          (proj.status || '').toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesPlatform && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'budget-desc') {
          return (b.rawBudget || 0) - (a.rawBudget || 0);
        }
        if (sortBy === 'budget-asc') {
          return (a.rawBudget || 0) - (b.rawBudget || 0);
        }
        if (sortBy === 'episodes-desc') {
          return (b.episodes || 0) - (a.episodes || 0);
        }
        if (sortBy === 'title-asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return b.id - a.id;
      });
  }, [projects, searchQuery, selectedPlatform, selectedStatus, sortBy]);

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header-row">
        <div>
          <h2>OTT & Web Series Productions ({projects.length})</h2>
          <p>Multi-episode streaming contracts, casting slates, and pan-India platform agreements</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={16} /> New OTT Project
        </button>
      </div>

      {/* TOP KPI METRICS STRIP */}
      <div className="ott-kpis-grid">
        <div className="agency-kpi-card">
          <div className="agency-kpi-icon-wrap" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
            <Tv size={22} />
          </div>
          <div className="agency-kpi-info">
            <span className="agency-kpi-label">OTT Productions</span>
            <div className="agency-kpi-val">{totalProjects}</div>
            <span className="agency-kpi-sub">Active Web Series Slates</span>
          </div>
        </div>

        <div className="agency-kpi-card">
          <div className="agency-kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <DollarSign size={22} />
          </div>
          <div className="agency-kpi-info">
            <span className="agency-kpi-label">Combined Slate Budget</span>
            <div className="agency-kpi-val">{totalSlateBudget}</div>
            <span className="agency-kpi-sub">Commissioned Financing</span>
          </div>
        </div>

        <div className="agency-kpi-card">
          <div className="agency-kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
            <Film size={22} />
          </div>
          <div className="agency-kpi-info">
            <span className="agency-kpi-label">Partner Networks</span>
            <div className="agency-kpi-val">{uniquePlatformsCount} OTTs</div>
            <span className="agency-kpi-sub">Netflix, Prime, Sony LIV</span>
          </div>
        </div>

        <div className="agency-kpi-card">
          <div className="agency-kpi-icon-wrap" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#EAB308' }}>
            <Clapperboard size={22} />
          </div>
          <div className="agency-kpi-info">
            <span className="agency-kpi-label">In Production</span>
            <div className="agency-kpi-val">{activeInProductionCount} Shows</div>
            <span className="agency-kpi-sub">Filming / Post-Production</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className="filter-toolbar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div className="filter-search-box" style={{ maxWidth: '320px' }}>
            <Search size={15} className="icon" />
            <input
              type="text"
              placeholder="Search by series, star, genre, director..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-pills">
            {['All', 'Netflix', 'Prime', 'Sony LIV'].map((pName) => (
              <button
                key={pName}
                type="button"
                className={`filter-pill ${selectedPlatform === pName ? 'active' : ''}`}
                onClick={() => setSelectedPlatform(pName)}
              >
                {pName}
              </button>
            ))}
          </div>

          <div className="filter-pills">
            {['All', 'Pre-Production', 'Production Phase', 'Post-Production'].map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-pill ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st)}
              >
                {st === 'All' ? 'All Stages' : st.replace(' Phase', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={14} color="var(--text-dim)" />
          <select
            className="zenve-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.78rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default Order</option>
            <option value="budget-desc">Budget: High to Low</option>
            <option value="budget-asc">Budget: Low to High</option>
            <option value="episodes-desc">Most Episodes</option>
            <option value="title-asc">Series Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* OTT PRODUCTIONS GRID */}
      {filteredProjects.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 24px',
            textAlign: 'center',
            marginTop: '16px'
          }}
        >
          <Tv size={42} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
            No OTT productions match your criteria
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Try resetting your search query or selecting a different platform filter.
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedPlatform('All');
              setSelectedStatus('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="ott-grid">
          {filteredProjects.map((proj) => {
            const poster = getProjectPoster(proj);
            const pBadgeClass = getPlatformClass(proj.platform);
            const starAvatar = getLeadStarAvatar(proj.leadStar);
            const stagePct = getStagePct(proj.status);

            const starInitials = (proj.leadStar || 'Star')
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div key={proj.id} className="ott-card">
                {/* Cover Image Banner */}
                <div className="ott-cover-wrap" onClick={() => setSelectedProject(proj)} style={{ cursor: 'pointer' }}>
                  <img
                    src={poster}
                    alt={proj.title}
                    className="ott-cover-img"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                  <div className="ott-cover-overlay">
                    <span className={`ott-platform-badge ${pBadgeClass}`}>
                      <Tv size={12} /> {proj.platform}
                    </span>
                    <button
                      type="button"
                      className="ott-status-badge"
                      title="Click to advance production stage"
                      onClick={(e) => handleStatusCycle(proj.id, e)}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background:
                            stagePct === 100
                              ? '#10B981'
                              : stagePct >= 75
                              ? '#3B82F6'
                              : stagePct >= 50
                              ? '#F59E0B'
                              : 'var(--text-dim)'
                        }}
                      />
                      {proj.status}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="ott-card-body">
                  {/* Title */}
                  <div className="ott-title-row">
                    <h3 onClick={() => setSelectedProject(proj)} title={proj.title}>
                      {proj.title}
                    </h3>
                  </div>

                  {/* Genre & Format */}
                  <div className="ott-genre-line">
                    <span>{proj.genre}</span>
                    <span style={{ margin: '0 6px', opacity: 0.5 }}>•</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                      {proj.episodes} Episodes
                    </span>
                  </div>

                  {/* Lead Star Avatar Chip */}
                  <div
                    className="ott-talent-chip"
                    onClick={() => openModal('scheduleShoot', { celebrity: proj.leadStar })}
                    title={`Schedule shoot with ${proj.leadStar}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {starAvatar ? (
                      <img src={starAvatar} alt={proj.leadStar} className="ott-talent-avatar" />
                    ) : (
                      <div className="ott-talent-avatar-fallback">{starInitials}</div>
                    )}
                    <span className="ott-talent-name">{proj.leadStar}</span>
                    <Clapperboard size={12} color="var(--primary)" style={{ marginLeft: '4px' }} />
                  </div>

                  {/* Production Stage Progress Bar */}
                  <div className="ott-progress-wrap">
                    <div className="ott-progress-header">
                      <span>Production Stage</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
                        {proj.status} ({stagePct}%)
                      </span>
                    </div>
                    <div className="ott-progress-track">
                      <div
                        className="ott-progress-fill"
                        style={{
                          width: `${stagePct}%`,
                          background:
                            stagePct === 100
                              ? 'var(--accent)'
                              : stagePct >= 75
                              ? 'var(--primary)'
                              : stagePct >= 50
                              ? '#F59E0B'
                              : 'var(--border-medium)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Meta Grid */}
                  <div className="ott-meta-grid">
                    <div className="ott-meta-item" title={proj.director || 'Showrunner'}>
                      <Film size={13} color="var(--primary)" />
                      <span>{proj.director ? `Dir: ${proj.director}` : 'Studio Slate'}</span>
                    </div>
                    <div className="ott-meta-item" title={proj.expectedRelease}>
                      <Calendar size={13} color="var(--accent)" />
                      <span>Rel: {proj.expectedRelease}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="ott-footer">
                    <div className="ott-budget-block">
                      <span className="ott-budget-lbl">Series Budget</span>
                      <span className="ott-budget-val">{proj.budget}</span>
                    </div>
                    <div className="ott-actions-row">
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                        onClick={() => setSelectedProject(proj)}
                      >
                        View Dossier
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                        onClick={() => openModal('scheduleShoot', { celebrity: proj.leadStar })}
                        title={`Schedule production shoot for ${proj.leadStar}`}
                      >
                        Shoot
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '6px 8px', color: '#EF4444' }}
                        title="Remove project from slate"
                        onClick={(e) => handleDeleteProject(proj.id, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          MODAL 1: LAUNCH NEW OTT PRODUCTION POP-UP
          ======================================================== */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge">
                  <Tv size={20} />
                </div>
                <div>
                  <h3>Launch New OTT Production</h3>
                  <p>Commission a multi-episode web series contract & production slate</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                {/* Platform Selector Banner */}
                <div className="form-group">
                  <label className="form-label">Streaming Platform Network *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {PLATFORMS.map((plat) => (
                      <button
                        key={plat.name}
                        type="button"
                        onClick={() => setNewProject({ ...newProject, platform: plat.name })}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          border:
                            newProject.platform === plat.name
                              ? '2px solid var(--primary)'
                              : '1px solid var(--border-subtle)',
                          background:
                            newProject.platform === plat.name
                              ? 'var(--primary-subtle)'
                              : 'var(--bg-card-alt)',
                          color:
                            newProject.platform === plat.name
                              ? 'var(--primary)'
                              : 'var(--text-main)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          justifyContent: 'center'
                        }}
                      >
                        <Tv size={13} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {plat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Series Title */}
                <div className="form-group">
                  <label className="form-label">Series Title *</label>
                  <input
                    type="text"
                    required
                    className="zenve-input"
                    placeholder="e.g. Shadow Realm: Season 3"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>

                {/* Lead Star & Genre */}
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">Lead Celebrity Star *</label>
                    <input
                      type="text"
                      required
                      className="zenve-input"
                      placeholder="e.g. Vijay, Nayanthara, Dhanush"
                      value={newProject.leadStar}
                      onChange={(e) => setNewProject({ ...newProject, leadStar: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {['Vijay', 'Nayanthara', 'Dhanush', 'Suriya', 'Trisha'].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewProject({ ...newProject, leadStar: star })}
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background:
                              newProject.leadStar === star
                                ? 'var(--primary)'
                                : 'var(--bg-card-alt)',
                            color: newProject.leadStar === star ? '#fff' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer'
                          }}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Genre</label>
                    <input
                      type="text"
                      className="zenve-input"
                      placeholder="e.g. Neo-Noir Thriller"
                      value={newProject.genre}
                      onChange={(e) => setNewProject({ ...newProject, genre: e.target.value })}
                    />
                  </div>
                </div>

                {/* Episodes & Budget */}
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">Episodes Count</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      className="zenve-input"
                      value={newProject.episodes}
                      onChange={(e) => setNewProject({ ...newProject, episodes: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Series Budget (USD)</label>
                    <input
                      type="number"
                      step="100000"
                      min="100000"
                      className="zenve-input"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    />
                  </div>
                </div>

                {/* Director & Production House */}
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">Director / Showrunner</label>
                    <input
                      type="text"
                      className="zenve-input"
                      placeholder="e.g. Vetrimaaran / Lokesh Kanagaraj"
                      value={newProject.director}
                      onChange={(e) => setNewProject({ ...newProject, director: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Production Studio</label>
                    <input
                      type="text"
                      className="zenve-input"
                      placeholder="e.g. Wunderbar Films / Madras Talkies"
                      value={newProject.producer}
                      onChange={(e) => setNewProject({ ...newProject, producer: e.target.value })}
                    />
                  </div>
                </div>

                {/* Status & Release */}
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">Initial Production Stage</label>
                    <select
                      className="zenve-select"
                      value={newProject.status}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    >
                      <option value="Pre-Production">Pre-Production (Writing & Casting)</option>
                      <option value="Production Phase">Production Phase (Principal Filming)</option>
                      <option value="Post-Production">Post-Production (VFX & Dubbing)</option>
                      <option value="Streaming Live">Streaming Live (Released)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Release Window</label>
                    <input
                      type="text"
                      className="zenve-input"
                      placeholder="e.g. Late 2026 / Nov 2026"
                      value={newProject.expectedRelease}
                      onChange={(e) => setNewProject({ ...newProject, expectedRelease: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Series Synopsis / Premise</label>
                  <textarea
                    className="zenve-input"
                    rows={2}
                    placeholder="Enter a brief logline or story overview..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>

                {/* Poster Presets */}
                <div className="form-group">
                  <label className="form-label">Cinematic Cover Style</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {POSTER_PRESETS.map((preset) => (
                      <div
                        key={preset.key}
                        onClick={() => setNewProject({ ...newProject, poster: preset.url })}
                        style={{
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border:
                            newProject.poster === preset.url
                              ? '2px solid var(--primary)'
                              : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          position: 'relative',
                          aspectRatio: '16/9'
                        }}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            insetInline: 0,
                            background: 'rgba(0,0,0,0.75)',
                            fontSize: '0.62rem',
                            color: '#fff',
                            textAlign: 'center',
                            padding: '2px 4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {preset.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Sparkles size={14} /> Launch OTT Production
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: OTT PROJECT DOSSIER & DETAILS POP-UP
          ======================================================== */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            {/* Cinematic Banner Cover */}
            <div style={{ position: 'relative', height: '160px', width: '100%' }}>
              <img
                src={getProjectPoster(selectedProject)}
                alt={selectedProject.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(11,15,23,0.3) 0%, rgba(11,15,23,0.9) 100%)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '16px'
                }}
              >
                <span className={`ott-platform-badge ${getPlatformClass(selectedProject.platform)}`}>
                  <Tv size={13} /> {selectedProject.platform}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="modal-body" style={{ marginTop: '-42px', position: 'relative', zIndex: 2 }}>
              {/* Header Titles */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3px' }}>
                    {selectedProject.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    <span>{selectedProject.genre}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                      {selectedProject.episodes} Episodes
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="ott-status-badge"
                  style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                  onClick={() => handleStatusCycle(selectedProject.id)}
                  title="Click to advance stage"
                >
                  <CheckCircle2 size={13} color="var(--primary)" />
                  <span>{selectedProject.status}</span>
                </button>
              </div>

              {/* 4-Stat Strip */}
              <div className="agency-stats-strip" style={{ margin: '14px 0', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--accent)' }}>{selectedProject.budget}</strong>
                  <span>Total Budget</span>
                </div>
                <div className="agency-stat-col">
                  <strong>{selectedProject.episodes}</strong>
                  <span>Episodes</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--primary)' }}>{selectedProject.leadStar}</strong>
                  <span>Lead Star</span>
                </div>
                <div className="agency-stat-col">
                  <strong>{selectedProject.expectedRelease}</strong>
                  <span>Release Window</span>
                </div>
              </div>

              {/* Production Progress Stepper */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Production Pipeline Milestone
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700 }}>
                    {getStagePct(selectedProject.status)}% Completed
                  </span>
                </div>

                <div className="ott-progress-track" style={{ height: '7px', marginBottom: '10px' }}>
                  <div
                    className="ott-progress-fill"
                    style={{
                      width: `${getStagePct(selectedProject.status)}%`,
                      background: 'var(--primary)'
                    }}
                  />
                </div>

                {/* 4 Milestones */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center', fontSize: '0.7rem' }}>
                  {STAGES.map((st) => {
                    const isPassed = getStagePct(selectedProject.status) >= st.pct;
                    const isCurrent = selectedProject.status.toLowerCase().includes(st.key.toLowerCase());
                    return (
                      <div
                        key={st.key}
                        style={{
                          color: isCurrent ? 'var(--primary)' : isPassed ? 'var(--text-main)' : 'var(--text-dim)',
                          fontWeight: isCurrent || isPassed ? 700 : 500
                        }}
                      >
                        {st.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Synopsis & Logline
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {selectedProject.description}
                </p>
              </div>

              {/* Production Slate Crew */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Director / Showrunner
                  </span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedProject.director || 'Showrunner TBD'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Production House
                  </span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedProject.producer || 'Zenve Studios'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="modal-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ color: '#EF4444' }}
                  onClick={() => handleDeleteProject(selectedProject.id)}
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleStatusCycle(selectedProject.id)}
                >
                  Advance Phase
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const celeb = selectedProject.leadStar;
                    setSelectedProject(null);
                    openModal('scheduleShoot', { celebrity: celeb });
                  }}
                >
                  <Video size={14} /> Schedule Shoot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
