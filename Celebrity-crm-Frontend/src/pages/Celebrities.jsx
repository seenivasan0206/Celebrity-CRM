import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  Flame,
  MapPin,
  Calendar,
  Megaphone,
  Trash2,
  X,
  ExternalLink,
  Copy,
  Check,
  Star,
  ShieldCheck
} from 'lucide-react';

export default function Celebrities() {
  const { celebrities, openModal, deleteCelebrity, searchQuery, setSearchQuery, addToast } = useCrm();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedCeleb, setSelectedCeleb] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Lock body scroll and prevent background shifting when modal is open
  useEffect(() => {
    if (selectedCeleb) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [selectedCeleb]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    addToast(`Copied "${text}" to clipboard`, 'info');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const filtered = (celebrities || []).filter((c) => {
    const matchesSearch =
      (c.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (c.category || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (c.location || '').toLowerCase().includes((searchQuery || '').toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Actors') return (c.category || '').includes('Actor');
    if (selectedFilter === 'Actresses') return (c.category || '').includes('Actress');
    if (selectedFilter === 'Music') return (c.category || '').includes('Music');
    return true;
  });

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Celebrity Roster ({(celebrities || []).length})</h2>
          <p>Manage talents, public profile metrics, contracts, and representation</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openModal && openModal('addCelebrity')}
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
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery && setSearchQuery('')}
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
              <img
                src={celeb.avatar}
                alt={celeb.name}
                className="celeb-card-avatar"
                onClick={() => setSelectedCeleb(celeb)}
                style={{ cursor: 'pointer' }}
                title="Click to view talent dossier"
              />
              <div className="celeb-card-meta">
                <h3
                  onClick={() => setSelectedCeleb(celeb)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view talent dossier"
                >
                  {celeb.name}
                </h3>
                <span>{celeb.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <MapPin size={12} /> {celeb.location}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span className={`badge ${celeb.status === 'Active' ? 'badge-accent' : 'badge-secondary'}`}>
                  {celeb.status}
                </span>
                <button
                  type="button"
                  title="Remove from roster"
                  onClick={() => deleteCelebrity && deleteCelebrity(celeb.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="celeb-stats-strip">
              <div className="celeb-stat-unit">
                <strong>{celeb.campaignsCount || 0}</strong>
                <span>Campaigns</span>
              </div>
              <div className="celeb-stat-unit">
                <strong>{celeb.followers}</strong>
                <span>Reach</span>
              </div>
              <div className="celeb-stat-unit">
                <strong style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                  <Flame size={12} fill="var(--accent)" /> {celeb.rating}%
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
                <Phone size={13} color="var(--accent)" />
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
                  onClick={() => openModal && openModal('createCampaign', { celebrity: celeb.name })}
                >
                  <Megaphone size={12} /> Campaign
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                  title={`Book Shoot for ${celeb.name}`}
                  onClick={() => openModal && openModal('scheduleShoot', { celebrity: celeb.name })}
                >
                  <Calendar size={12} /> Shoot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          CELEBRITY PROFILE & TALENT DOSSIER POP-UP MODAL
          ======================================================== */}
      {selectedCeleb && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCeleb(null)}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', overscrollBehavior: 'contain' }}
          >
            {/* Header Banner */}
            <div style={{ position: 'relative', height: '140px', background: 'var(--bg-card-alt)', overflow: 'hidden' }}>
              <img
                src={selectedCeleb.avatar}
                alt={selectedCeleb.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px)', opacity: 0.5, transform: 'scale(1.2)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(11, 15, 23, 0.3) 0%, rgba(11, 15, 23, 0.85) 100%)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '16px'
                }}
              >
                <span className="badge-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={12} /> {selectedCeleb.status} Talent
                </span>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedCeleb(null)}
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ marginTop: '-42px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '8px' }}>
                <img
                  src={selectedCeleb.avatar}
                  alt={selectedCeleb.name}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    border: '3px solid var(--bg-card)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <div style={{ flex: 1, paddingBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {selectedCeleb.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span>{selectedCeleb.category}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={12} color="var(--primary)" /> {selectedCeleb.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="agency-stats-strip" style={{ margin: '12px 0' }}>
                <div className="agency-stat-col">
                  <strong>{selectedCeleb.followers}</strong>
                  <span>Audience Reach</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--accent)' }}>{selectedCeleb.rating}%</strong>
                  <span>Power Index</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--primary)' }}>{selectedCeleb.campaignsCount || 0}</strong>
                  <span>Active Campaigns</span>
                </div>
              </div>

              {/* Commercial Value Card */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Annual Representation & Endorsement Value
                  </span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)', marginTop: '2px' }}>
                    {selectedCeleb.activeContract}
                  </div>
                </div>
                <span className="badge-primary">Standard Benchmark</span>
              </div>

              {/* Contact Dossier */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Management & Representation Liaison
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <Mail size={14} color="var(--primary)" />
                      <span>{selectedCeleb.email || 'mgmt@representation.com'}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      onClick={() => handleCopy(selectedCeleb.email || 'mgmt@representation.com', 'celeb-mail')}
                    >
                      {copiedKey === 'celeb-mail' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <Phone size={14} color="var(--accent)" />
                      <span>{selectedCeleb.phone || '+91 98400 00000'}</span>
                    </div>
                    <a
                      href={`tel:${selectedCeleb.phone || '+919840000000'}`}
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                    >
                      Call Manager
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="modal-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedCeleb(null)}
              >
                Close
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    const c = selectedCeleb;
                    setSelectedCeleb(null);
                    openModal('createCampaign', { celebrity: c.name });
                  }}
                >
                  <Megaphone size={13} /> Launch Campaign
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const c = selectedCeleb;
                    setSelectedCeleb(null);
                    openModal('scheduleShoot', { celebrity: c.name });
                  }}
                >
                  <Calendar size={13} /> Schedule Shoot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
