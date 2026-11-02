import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Tv, Plus, Calendar, Film, CheckCircle2 } from 'lucide-react';

export default function OttProjects() {
  const { addToast, openModal } = useCrm();

  const projects = [
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
          onClick={() => addToast('OTT Project proposal drafting initialized', 'info')}
        >
          <Plus size={16} /> New OTT Project
        </button>
      </div>

      <div className="campaigns-grid">
        {projects.map((proj) => (
          <div key={proj.id} className="campaign-card">
            <div className="campaign-card-header">
              <div>
                <span className="campaign-brand-tag" style={{ color: '#8B5CF6' }}>{proj.platform}</span>
                <h3>{proj.title}</h3>
              </div>
              <span className="badge badge-purple">{proj.status}</span>
            </div>

            <div className="campaign-talent-pill">
              <span style={{ color: 'var(--text-dim)' }}>Lead Star:</span>
              <span>{proj.leadStar}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={14} color="var(--primary)" />
                <span>Genre: <strong>{proj.genre} ({proj.episodes} Episodes)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="#F59E0B" />
                <span>Expected Release: <strong>{proj.expectedRelease}</strong></span>
              </div>
            </div>

            <div className="campaign-footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Series Budget</span>
                <span className="campaign-budget" style={{ color: '#10B981' }}>{proj.budget}</span>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                onClick={() => openModal('scheduleShoot', { celebrity: proj.leadStar })}
              >
                Schedule OTT Shoot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

