import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Sparkles, Plus, Users, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CastingCalls() {
  const { addToast } = useCrm();
  const navigate = useNavigate();

  const castingCalls = [
    {
      id: 1,
      role: 'Lead Antagonist (Action Thriller)',
      production: 'Red Giant & Sun Pictures Co-Production',
      location: 'Chennai & Hyderabad',
      ageGroup: '30 - 45 Years',
      auditionsCount: 142,
      deadline: '15 Dec 2025',
      status: 'Open for Auditions'
    },
    {
      id: 2,
      role: 'Female Parallel Lead (Rom-Com)',
      production: 'Lyca Productions Feature Film',
      location: 'Bangalore & Chennai',
      ageGroup: '22 - 28 Years',
      auditionsCount: 89,
      deadline: '30 Nov 2025',
      status: 'Screen Tests Ongoing'
    },
    {
      id: 3,
      role: 'Youth Protagonist (Sports Drama)',
      production: 'Excel Entertainment Pan-India',
      location: 'Mumbai & Chennai',
      ageGroup: '20 - 26 Years',
      auditionsCount: 215,
      deadline: '20 Jan 2026',
      status: 'Open for Auditions'
    }
  ];

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Casting Calls & Auditions ({castingCalls.length})</h2>
          <p>Audition notices, open character calls, and talent selection pipelines</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => addToast('New casting call draft opened', 'info')}
        >
          <Plus size={16} /> Post Casting Call
        </button>
      </div>

      <div className="campaigns-grid">
        {castingCalls.map((call) => (
          <div key={call.id} className="campaign-card">
            <div className="campaign-card-header">
              <div>
                <span className="campaign-brand-tag" style={{ color: '#EAB308' }}>Open Role</span>
                <h3>{call.role}</h3>
              </div>
              <span className="badge badge-amber">{call.status}</span>
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Production: <strong style={{ color: 'var(--text-main)' }}>{call.production}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="var(--primary)" />
                <span>Location: {call.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={14} color="#06B6D4" />
                <span>Criteria: {call.ageGroup}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="#F59E0B" />
                <span>Audition Deadline: {call.deadline}</span>
              </div>
            </div>

            <div className="campaign-footer">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                {call.auditionsCount} Applications Received
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                onClick={() => navigate('/applications')}
              >
                Review Tapes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

