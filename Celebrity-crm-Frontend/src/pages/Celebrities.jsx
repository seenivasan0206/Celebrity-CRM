import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Search, UserPlus, Phone, Mail, Flame, MapPin, Calendar, Megaphone, Trash2, X } from 'lucide-react';

export default function Celebrities() {
  const { celebrities, openModal, deleteCelebrity, searchQuery, setSearchQuery } = useCrm();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filtered = celebrities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      c.category.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      c.location.toLowerCase().includes((searchQuery || '').toLowerCase());

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
          <h2>Celebrity Roster ({celebrities.length})</h2>
          <p>Manage talents, public profile metrics, contracts, and representation</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openModal('addCelebrity')}
        >
          <UserPlus size={16} /> Onboard Celebrity
        </button>
      </div>

      <div className="filter-toolbar">
        <div className="filter-search-box">
          <Search size={16} className="icon" />
          <input
            type="text"
            placeholder="Filter celebrities by name, category, or city..."
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-pills">
          {['All', 'Actors', 'Actresses', 'Music'].map((filter) => (
            <button
              key={filter}
              type="button"
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span className={`badge ${celeb.status === 'Active' ? 'badge-emerald' : 'badge-amber'}`}>
                  {celeb.status}
                </span>
                <button
                  type="button"
                  title="Remove from roster"
                  onClick={() => deleteCelebrity(celeb.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F43F5E')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
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
              <a
                href={`mailto:${celeb.email || 'mgmt@representation.com'}`}
                className="celeb-contact-row"
                style={{ textDecoration: 'none', color: 'inherit' }}
                title="Send email"
              >
                <Mail size={13} color="var(--primary)" />
                <span>{celeb.email || 'mgmt@representation.com'}</span>
              </a>
              <a
                href={`tel:${celeb.phone || '+919840000000'}`}
                className="celeb-contact-row"
                style={{ textDecoration: 'none', color: 'inherit' }}
                title="Call manager"
              >
                <Phone size={13} color="var(--accent-emerald)" />
                <span>{celeb.phone || '+91 98400 00000'}</span>
              </a>
            </div>

            <div className="celeb-card-footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Contract Value</span>
                <span className="contract-value-tag">{celeb.activeContract}</span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                  title={`Launch Campaign with ${celeb.name}`}
                  onClick={() => openModal('createCampaign', { celebrity: celeb.name })}
                >
                  <Megaphone size={12} /> Campaign
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                  title={`Book Shoot for ${celeb.name}`}
                  onClick={() => openModal('scheduleShoot', { celebrity: celeb.name })}
                >
                  <Calendar size={12} /> Shoot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
