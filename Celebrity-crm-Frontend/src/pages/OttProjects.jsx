import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';
import { Tv, Plus, Calendar, Film, CheckCircle2, Trash2, X, Sparkles } from 'lucide-react';
import api from '../services/api';

const defaultProjects = [
  {
    id: 1,
    title: 'Shadow Realm: Season 2',
    platform: 'Netflix India',
    genre: 'Neo-Noir Thriller',
    leadStar: 'Dhanush',
    episodes: 8,
    status: 'Production Phase',
    budget: '$4,200,000',
    expectedRelease: 'Aug 2026'
  },
  {
    id: 2,
    title: 'The Queen Regnant',
    platform: 'Prime Video Originals',
    genre: 'Historical Period Drama',
    leadStar: 'Nayanthara',
    episodes: 10,
    status: 'Post-Production',
    budget: '$6,500,000',
    expectedRelease: 'Nov 2026'
  },
  {
    id: 3,
    title: 'Vortex Protocol',
    platform: 'Sony LIV',
    genre: 'Sci-Fi Action Series',
    leadStar: 'Suriya',
    episodes: 6,
    status: 'Pre-Production',
    budget: '$3,800,000',
    expectedRelease: 'Early 2027'
  }
];

export default function OttProjects() {
  const { addToast, openModal } = useCrm();

  const normalizeProject = (p) => ({
    id: p.id,
    title: p.title,
    platform: p.platform,
    genre: p.genre || 'Action / Drama',
    leadStar: p.leadStar || p.celebrityName || 'Key Roster Star',
    episodes: p.episodes || 8,
    status: p.status || 'Production Phase',
    budget: typeof p.budget === 'number' ? `$${Number(p.budget).toLocaleString()}` : (p.budget || '$4,000,000'),
    rawBudget: p.budget,
    expectedRelease: p.expectedRelease || (p.releaseDate ? p.releaseDate : 'Late 2026'),
    director: p.director || '',
    producer: p.producer || '',
    description: p.description || ''
  });

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_ott_projects');
      return saved ? JSON.parse(saved) : defaultProjects;
    } catch {
      return defaultProjects;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    platform: 'Netflix India',
    genre: 'Crime Thriller',
    leadStar: '',
    episodes: 8,
    budget: '4500000',
    expectedRelease: 'Late 2026',
    status: 'Pre-Production'
  });

  // Fetch live OTT projects from backend on mount
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
    return () => { isMounted = false; };
  }, []);

  const handleStatusCycle = async (id, e) => {
    e.stopPropagation();
    const target = projects.find(p => p.id === id);
    if (!target) return;

    let nextStatus = 'Pre-Production';
    if (target.status === 'Pre-Production') nextStatus = 'Production Phase';
    else if (target.status === 'Production Phase') nextStatus = 'Post-Production';
    else if (target.status === 'Post-Production') nextStatus = 'Streaming Live';
    else nextStatus = 'Pre-Production';

    const updated = projects.map(p => p.id === id ? { ...p, status: nextStatus } : p);
    setProjects(updated);
    localStorage.setItem('zenve_ott_projects', JSON.stringify(updated));

    try {
      await api.ott.updateStatus(id, nextStatus);
      addToast(`Status updated to "${nextStatus}" in database!`, 'success');
    } catch (err) {
      console.warn('Backend status update failed:', err.message);
      addToast(`Status updated locally (${nextStatus})`, 'info');
    }
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('zenve_ott_projects', JSON.stringify(updated));

    try {
      await api.ott.delete(id);
      addToast('OTT project removed from database', 'info');
    } catch (err) {
      console.warn('Backend delete failed:', err.message);
      addToast('OTT project removed locally', 'info');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.leadStar.trim()) {
      addToast('Please provide Title and Lead Star', 'warning');
      return;
    }

    const payload = {
      title: newProject.title.trim(),
      platform: newProject.platform,
      genre: newProject.genre.trim() || 'Entertainment',
      leadStar: newProject.leadStar.trim(),
      episodes: Number(newProject.episodes) || 8,
      budget: Number(newProject.budget) || 4000000,
      expectedRelease: newProject.expectedRelease.trim() || 'Late 2026',
      status: newProject.status || 'Pre-Production'
    };

    try {
      const created = await api.ott.create(payload);
      const normalized = normalizeProject(created);
      const updated = [normalized, ...projects.filter(p => p.id !== normalized.id)];
      setProjects(updated);
      localStorage.setItem('zenve_ott_projects', JSON.stringify(updated));
      setIsModalOpen(false);
      setNewProject({
        title: '',
        platform: 'Netflix India',
        genre: 'Crime Thriller',
        leadStar: '',
        episodes: 8,
        budget: '4500000',
        expectedRelease: 'Late 2026',
        status: 'Pre-Production'
      });
      addToast(`OTT Project "${created.title}" saved to MySQL database!`, 'success');
    } catch (err) {
      console.error('Backend create failed:', err);
      addToast(err.message || 'Failed to save OTT project to database', 'danger');
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>OTT & Web Series Productions ({projects.length})</h2>
          <p>Multi-episode streaming contracts, casting slates, and platform agreements</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> New OTT Project
        </button>
      </div>

      <div className="campaigns-grid">
        {projects.map((proj) => (
          <div key={proj.id} className="campaign-card">
            <div className="campaign-card-header">
              <div>
                <span className="campaign-brand-tag" style={{ color: 'var(--primary)' }}>{proj.platform}</span>
                <h3>{proj.title}</h3>
              </div>
              <div
                onClick={(e) => handleStatusCycle(proj.id, e)}
                style={{ cursor: 'pointer' }}
                title="Click to cycle status in database"
              >
                <span className="badge-primary">{proj.status}</span>
              </div>
            </div>

            <div className="campaign-talent-pill">
              <span style={{ color: 'var(--text-dim)' }}>Lead Star:</span>
              <span style={{ fontWeight: 600 }}>{proj.leadStar}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={14} color="var(--primary)" />
                <span>Genre: <strong>{proj.genre} ({proj.episodes} Episodes)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="var(--secondary)" />
                <span>Expected Release: <strong>{proj.expectedRelease}</strong></span>
              </div>
            </div>

            <div className="campaign-footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Series Budget</span>
                <span className="campaign-budget" style={{ color: 'var(--accent)' }}>{proj.budget}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                  onClick={() => openModal('scheduleShoot', { celebrity: proj.leadStar })}
                >
                  Schedule Shoot
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 8px', color: 'var(--secondary)' }}
                  title="Remove project"
                  onClick={(e) => handleDeleteProject(proj.id, e)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New OTT Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tv size={18} color="var(--primary)" />
                <h3>Launch New OTT Production</h3>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label>Series Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shadow Realm: Season 3"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Platform *</label>
                    <select
                      value={newProject.platform}
                      onChange={(e) => setNewProject({ ...newProject, platform: e.target.value })}
                    >
                      <option value="Netflix India">Netflix India</option>
                      <option value="Prime Video Originals">Prime Video Originals</option>
                      <option value="Sony LIV">Sony LIV</option>
                      <option value="Disney+ Hotstar">Disney+ Hotstar</option>
                      <option value="Zee5 Global">Zee5 Global</option>
                      <option value="Apple TV+">Apple TV+</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Lead Celebrity Star *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhanush, Nayanthara"
                      value={newProject.leadStar}
                      onChange={(e) => setNewProject({ ...newProject, leadStar: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      placeholder="e.g. Neo-Noir Thriller"
                      value={newProject.genre}
                      onChange={(e) => setNewProject({ ...newProject, genre: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Episodes Count</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={newProject.episodes}
                      onChange={(e) => setNewProject({ ...newProject, episodes: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Budget (USD)</label>
                    <input
                      type="number"
                      step="50000"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Expected Release</label>
                    <input
                      type="text"
                      placeholder="e.g. Nov 2026"
                      value={newProject.expectedRelease}
                      onChange={(e) => setNewProject({ ...newProject, expectedRelease: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
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
                  <Sparkles size={14} /> Create Production
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
