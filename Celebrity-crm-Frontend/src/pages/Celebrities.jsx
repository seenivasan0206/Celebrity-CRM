import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Search, UserPlus, Phone, Mail, Award, Flame, MapPin } from 'lucide-react';

export default function Celebrities() {
  const { celebrities, setActiveModal, searchQuery, setSearchQuery } = useCrm();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filtered = celebrities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Actors') return c.category.includes('Actor');
    if (selectedFilter === 'Actresses') return c.category.includes('Actress');
    if (selectedFilter === 'Music') return c.category.includes('Music');
    return true;
  });

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Celebrity Roster</h2>
          <p>Manage talents, public profile metrics, contracts, and representation</p>
        </div>
        <button className="btn-primary" onClick={() => setActiveModal('addCelebrity')}>
          <UserPlus size={16} /> Onboard Celebrity
        </button>
      </div>

      <div className="filter-toolbar">
        <div className="filter-search-box">
          <Search size={16} className="icon" />
          <input
            type="text"
            placeholder="Filter celebrities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {['All', 'Actors', 'Actresses', 'Music'].map((filter) => (
            <button
              key={filter}
              className={`filter-pill ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="celebrities-grid">
        {filtered.map((celeb) => (
          <div key={celeb.id} className="celebrity-card">
            <div className="celeb-card-top">
              <img src={celeb.avatar} alt={celeb.name} className="celeb-card-avatar" />
              <div className="celeb-card-meta">
                <h3>{celeb.name}</h3>
                <span>{celeb.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <MapPin size={12} /> {celeb.location}
                </div>
              </div>
              <span className={`badge ${celeb.status === 'Active' ? 'badge-emerald' : 'badge-amber'}`}>
                {celeb.status}
              </span>
            </div>

            <div className="celeb-stats-strip">
              <div className="celeb-stat-unit">
                <strong>{celeb.campaignsCount}</strong>
                <span>Campaigns</span>
              </div>
              <div className="celeb-stat-unit">
                <strong>{celeb.followers}</strong>
                <span>Reach</span>
              </div>
              <div className="celeb-stat-unit">
                <strong style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                  <Flame size={12} fill="#F59E0B" /> {celeb.rating}%
                </strong>
                <span>Index</span>
              </div>
            </div>

            <div className="celeb-contact-info">
              <div className="celeb-contact-row">
                <Mail size={13} color="var(--text-dim)" />
                <span>{celeb.email || 'mgmt@representation.com'}</span>
              </div>
              <div className="celeb-contact-row">
                <Phone size={13} color="var(--text-dim)" />
                <span>{celeb.phone || '+91 98400 00000'}</span>
              </div>
            </div>

            <div className="celeb-card-footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Contract Value</span>
                <span className="contract-value-tag">{celeb.activeContract}</span>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                onClick={() => setActiveModal('scheduleShoot')}
              >
                Schedule Shoot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

