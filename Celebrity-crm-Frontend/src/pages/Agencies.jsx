import React, { useState, useMemo } from 'react';
import { useCrm } from '../context/CrmContext';
import {
  Building2,
  Plus,
  MapPin,
  Users,
  Globe,
  Phone,
  Mail,
  Search,
  X,
  ShieldCheck,
  Check,
  ExternalLink,
  Copy,
  Sparkles,
  Percent,
  Briefcase,
  Send,
  Star,
  ArrowUpDown
} from 'lucide-react';

const DEFAULT_AGENCY_IMAGES = {
  'elite talent management': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  'global talent & media': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  'apex studio representations': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
  'zenve talent network': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
  'zenve global entertainment': 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=600&q=80'
};

const COVER_PRESETS = [
  { label: 'Mumbai Highrise', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chennai Studio', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Hyderabad Hub', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80' },
  { label: 'Bangalore Tech Park', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80' }
];

export default function Agencies() {
  const { agencies, addAgency, addToast, addActivity } = useCrm();
  const agenciesList = agencies || [];

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailsAgency, setDetailsAgency] = useState(null);
  const [connectAgency, setConnectAgency] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // New Agency Form state
  const [formData, setFormData] = useState({
    name: '',
    headquarters: '',
    specialty: '',
    commission: '12',
    website: '',
    email: '',
    phone: '',
    status: 'Verified Partner',
    image: COVER_PRESETS[0].url
  });

  // Connect / Inquiry Form state
  const [connectSubject, setConnectSubject] = useState('Brand Endorsement Inquiry');
  const [connectMessage, setConnectMessage] = useState('');

  // Handle Copy to clipboard
  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    addToast(`Copied "${text}" to clipboard`, 'info');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // KPIs
  const totalAgencies = agenciesList.length;
  const activePartners = agenciesList.filter(
    (a) =>
      (a.status || '').toLowerCase().includes('verified') ||
      (a.status || '').toLowerCase().includes('partner') ||
      (a.status || '').toLowerCase().includes('active')
  ).length;

  const avgFee = useMemo(() => {
    if (agenciesList.length === 0) return '11.0%';
    const total = agenciesList.reduce((acc, a) => {
      const num = a.commissionNum || parseFloat(String(a.commission || '10').replace(/[^0-9.]/g, '')) || 10;
      return acc + num;
    }, 0);
    return `${(total / agenciesList.length).toFixed(1)}%`;
  }, [agenciesList]);

  const totalRosterStars = useMemo(() => {
    return agenciesList.reduce((acc, a) => acc + (Number(a.rosterCount) || 15), 0);
  }, [agenciesList]);

  // City list for pills
  const cities = ['All', 'Mumbai', 'Chennai', 'Hyderabad', 'Bangalore'];

  // Filtered & Sorted list
  const filteredAgencies = useMemo(() => {
    return agenciesList
      .filter((agency) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (agency.name || '').toLowerCase().includes(q) ||
          (agency.headquarters || '').toLowerCase().includes(q) ||
          (agency.specialty || '').toLowerCase().includes(q) ||
          (agency.email || '').toLowerCase().includes(q);

        const matchesCity =
          selectedCity === 'All' ||
          (agency.headquarters || '').toLowerCase().includes(selectedCity.toLowerCase());

        const matchesTier =
          selectedTier === 'All' ||
          (selectedTier === 'Verified' && (agency.status || '').toLowerCase().includes('verified'));

        return matchesSearch && matchesCity && matchesTier;
      })
      .sort((a, b) => {
        if (sortBy === 'roster-desc') {
          return (Number(b.rosterCount) || 0) - (Number(a.rosterCount) || 0);
        }
        if (sortBy === 'fee-asc') {
          const feeA = a.commissionNum || parseFloat(String(a.commission || '0').replace(/[^0-9.]/g, '')) || 0;
          const feeB = b.commissionNum || parseFloat(String(b.commission || '0').replace(/[^0-9.]/g, '')) || 0;
          return feeA - feeB;
        }
        if (sortBy === 'fee-desc') {
          const feeA = a.commissionNum || parseFloat(String(a.commission || '0').replace(/[^0-9.]/g, '')) || 0;
          const feeB = b.commissionNum || parseFloat(String(b.commission || '0').replace(/[^0-9.]/g, '')) || 0;
          return feeB - feeA;
        }
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        return a.id - b.id;
      });
  }, [agenciesList, searchQuery, selectedCity, selectedTier, sortBy]);

  // Submission handler for Add Agency
  const handleAddAgencySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please enter an agency name', 'warning');
      return;
    }

    await addAgency({
      name: formData.name.trim(),
      headquarters: formData.headquarters.trim() || 'Mumbai, India',
      specialty: formData.specialty.trim() || 'A-List Talent Representation & Commercial Production',
      commission: `${formData.commission || '12'}%`,
      website: formData.website.trim() || 'www.agencytalent.com',
      email: formData.email.trim() || 'partners@agencytalent.com',
      phone: formData.phone.trim() || '+91 22 2640 0000',
      status: formData.status || 'Verified Partner',
      image: formData.image || COVER_PRESETS[0].url
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      headquarters: '',
      specialty: '',
      commission: '12',
      website: '',
      email: '',
      phone: '',
      status: 'Verified Partner',
      image: COVER_PRESETS[0].url
    });
  };

  // Submission handler for Connect Agency
  const handleSendConnect = (e) => {
    e.preventDefault();
    if (!connectAgency) return;

    if (addActivity) {
      addActivity({
        type: 'agency',
        title: `Agency Inquiry Sent: ${connectAgency.name}`,
        desc: `Subject: ${connectSubject} | Liaison: ${connectAgency.email || 'Partner Desk'}`,
        time: 'Just now'
      });
    }

    addToast(`Inquiry sent to ${connectAgency.name}! Their team will reply to your registered liaison address.`, 'success');
    setConnectAgency(null);
    setConnectMessage('');
  };

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header-row">
        <div>
          <h2>Partner Talent Agencies ({agenciesList.length})</h2>
          <p>Affiliated production agencies, talent casting liaisons, and pan-India representation agreements</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} /> Partner Agency
        </button>
      </div>

      {/* KPI METRIC CARDS STRIP */}
      <div className="agencies-kpis-grid">
        <div className="agency-kpi-card">
          <div className="agency-kpi-icon-wrap" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
            <Building2 size={22} />
          </div>
          <div className="agency-kpi-info">
            <span className="agency-kpi-label">Partner Agencies</span>
            <div className="agency-kpi-val">{totalAgencies}</div>
            <span className="agency-kpi-sub">Affiliated Representation</span>
          </div>
        </div>

        <div className="agency-kpi-card">
          <div className="agency-kpi-icon-wrap" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
            <ShieldCheck size={22} />
          </div>
          <div className="agency-kpi-info">
            <span className="agency-kpi-label">Active Network</span>
            <div className="agency-kpi-val">{activePartners}</div>
            <span className="agency-kpi-sub">100% Operational Tiers</span>
          </div>
        </div>

        <div className="agency-kpi-card">
          <div className="agency-kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
            <Percent size={22} />
          </div>
          <div className="agency-kpi-info">
            <span className="agency-kpi-label">Avg. Agency Fee</span>
            <div className="agency-kpi-val">{avgFee}</div>
            <span className="agency-kpi-sub">Standard Industry Range</span>
          </div>
        </div>

        <div className="agency-kpi-card">
          <div className="agency-kpi-icon-wrap" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#EAB308' }}>
            <Users size={22} />
          </div>
          <div className="agency-kpi-info">
            <span className="agency-kpi-label">Roster Talent Reach</span>
            <div className="agency-kpi-val">{totalRosterStars}+ Stars</div>
            <span className="agency-kpi-sub">Across 4 Major Metros</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className="filter-toolbar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div className="filter-search-box" style={{ maxWidth: '340px' }}>
            <Search size={15} className="icon" />
            <input
              type="text"
              placeholder="Search agencies, locations, specialties..."
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
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                className={`filter-pill ${selectedCity === city ? 'active' : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
            <button
              type="button"
              className={`filter-pill ${selectedTier === 'Verified' ? 'active' : ''}`}
              onClick={() => setSelectedTier(selectedTier === 'Verified' ? 'All' : 'Verified')}
            >
              Verified Only
            </button>
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
            <option value="roster-desc">Largest Roster</option>
            <option value="fee-asc">Agency Fee: Low to High</option>
            <option value="fee-desc">Agency Fee: High to Low</option>
            <option value="name-asc">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      {/* AGENCIES GRID */}
      {filteredAgencies.length === 0 ? (
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
          <Building2 size={40} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
            No agencies found matching your filters
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Try clearing your search terms or city filters to view all partner agencies.
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCity('All');
              setSelectedTier('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="agencies-grid">
          {filteredAgencies.map((agency) => {
            const nameKey = (agency.name || '').toLowerCase().trim();
            const fallbackCover =
              DEFAULT_AGENCY_IMAGES[nameKey] ||
              agency.image ||
              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';

            const initials = (agency.name || 'AG')
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            const isVerified = (agency.status || '').toLowerCase().includes('verified');
            const isPremium = (agency.status || '').toLowerCase().includes('premium');
            const tierBadgeClass = isVerified ? 'verified' : isPremium ? 'premium' : 'direct';

            const cityTag = agency.headquarters
              ? agency.headquarters.split(',').pop().trim()
              : 'Pan-India';

            return (
              <div key={agency.id} className="agency-card">
                {/* Cover Image Banner */}
                <div className="agency-cover-wrap">
                  <img
                    src={fallbackCover}
                    alt={agency.name}
                    className="agency-cover-img"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      if (!e.target.dataset.fallbackTried) {
                        e.target.dataset.fallbackTried = 'true';
                        e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                      }
                    }}
                    loading="lazy"
                  />
                  <div className="agency-cover-overlay">
                    <span className={`agency-tier-badge ${tierBadgeClass}`}>
                      <ShieldCheck size={12} /> {agency.status || 'Verified Partner'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--text-main)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {cityTag}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="agency-card-body">
                  {/* Floating Logo Badge */}
                  <div className="agency-avatar-float" title={agency.name}>
                    <div className="agency-avatar-initials">
                      {initials}
                    </div>
                  </div>

                  {/* Title & Verified Indicator */}
                  <div className="agency-title-row">
                    <h3 onClick={() => setDetailsAgency(agency)} title={agency.name}>
                      {agency.name}
                    </h3>
                  </div>

                  {/* Specialty Tagline */}
                  <p className="agency-specialty-pill" title={agency.specialty}>
                    {agency.specialty || 'Talent Representation & Commercial Production'}
                  </p>

                  {/* Headquarters Location */}
                  <div className="agency-location-tag">
                    <MapPin size={13} color="var(--primary)" />
                    <span>{agency.headquarters || 'Mumbai, India'}</span>
                  </div>

                  {/* Stats Strip */}
                  <div className="agency-stats-strip">
                    <div className="agency-stat-col">
                      <strong>{agency.rosterCount || 15}</strong>
                      <span>Roster Stars</span>
                    </div>
                    <div className="agency-stat-col">
                      <strong style={{ color: 'var(--primary)' }}>
                        {agency.commission || '12%'}
                      </strong>
                      <span>Agency Fee</span>
                    </div>
                    <div className="agency-stat-col">
                      <strong style={{ color: 'var(--accent)' }}>Active</strong>
                      <span>Network</span>
                    </div>
                  </div>

                  {/* Contact List */}
                  <div className="agency-contact-list">
                    <a
                      href={agency.website?.startsWith('http') ? agency.website : `https://${agency.website || 'www.zenvetalent.com'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="agency-contact-item"
                      title="Visit official website"
                    >
                      <Globe size={13} color="var(--primary)" />
                      <span>{agency.website || 'www.zenvetalent.com'}</span>
                    </a>

                    <div className="agency-contact-item" style={{ cursor: 'pointer' }} onClick={() => handleCopy(agency.email, `mail-${agency.id}`)} title="Click to copy email">
                      <Mail size={13} color="var(--primary)" />
                      <span>{agency.email || 'partners@agency.com'}</span>
                      {copiedKey === `mail-${agency.id}` ? (
                        <Check size={11} color="var(--accent)" style={{ marginLeft: 'auto' }} />
                      ) : (
                        <Copy size={11} color="var(--text-dim)" style={{ marginLeft: 'auto', opacity: 0.6 }} />
                      )}
                    </div>

                    <a
                      href={`tel:${agency.phone || '+91 22 2640 0000'}`}
                      className="agency-contact-item"
                      title="Direct phone liaison"
                    >
                      <Phone size={13} color="var(--accent)" />
                      <span>{agency.phone || '+91 22 2640 0000'}</span>
                    </a>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="agency-card-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '7px 12px', fontSize: '0.78rem' }}
                      onClick={() => setDetailsAgency(agency)}
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '7px 12px', fontSize: '0.78rem' }}
                      onClick={() => setConnectAgency(agency)}
                    >
                      Connect Agency
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD PARTNER AGENCY MODAL
          ======================================================== */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3>Onboard Partner Agency</h3>
                  <p>Register an affiliated talent agency or production liaison</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAgencySubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Agency Name *</label>
                  <input
                    type="text"
                    className="zenve-input"
                    placeholder="e.g. Paramount Talent Representation"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">Headquarters / City *</label>
                    <input
                      type="text"
                      className="zenve-input"
                      placeholder="e.g. Bandra West, Mumbai"
                      required
                      value={formData.headquarters}
                      onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agency Commission Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="50"
                      className="zenve-input"
                      placeholder="12"
                      value={formData.commission}
                      onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Specialty / Focus Area</label>
                  <input
                    type="text"
                    className="zenve-input"
                    placeholder="e.g. Pan-India Film Stars & Worldwide Endorsements"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">Official Website</label>
                    <input
                      type="text"
                      className="zenve-input"
                      placeholder="e.g. www.paramounttalent.in"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Partnership Tier</label>
                    <select
                      className="zenve-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Verified Partner">Verified Partner</option>
                      <option value="Premium Partner">Premium Partner</option>
                      <option value="Direct Network">Direct Network</option>
                    </select>
                  </div>
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">Official Liaison Email</label>
                    <input
                      type="email"
                      className="zenve-input"
                      placeholder="partners@agency.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Office Phone Number</label>
                    <input
                      type="tel"
                      className="zenve-input"
                      placeholder="+91 22 2640 8899"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Cover Photo Preset selector */}
                <div className="form-group">
                  <label className="form-label">Headquarters Cover Architecture</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {COVER_PRESETS.map((preset) => (
                      <div
                        key={preset.label}
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        style={{
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: formData.image === preset.url ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
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
                            background: 'rgba(0,0,0,0.7)',
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

              <div className="modal-footer" style={{ padding: '16px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={15} /> Add Agency Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: AGENCY DETAILS & PROFILE MODAL
          ======================================================== */}
      {detailsAgency && (
        <div className="modal-overlay" onClick={() => setDetailsAgency(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            {/* Modal Cover Image */}
            <div style={{ position: 'relative', height: '140px', width: '100%' }}>
              <img
                src={detailsAgency.image || DEFAULT_AGENCY_IMAGES[(detailsAgency.name || '').toLowerCase().trim()] || COVER_PRESETS[0].url}
                alt={detailsAgency.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(11,15,23,0.3) 0%, rgba(11,15,23,0.85) 100%)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '16px'
                }}
              >
                <span className="agency-tier-badge verified">
                  <ShieldCheck size={13} /> {detailsAgency.status || 'Verified Partner'}
                </span>
                <button
                  type="button"
                  onClick={() => setDetailsAgency(null)}
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
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

            {/* Modal Content Body */}
            <div className="modal-body" style={{ marginTop: '-36px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    background: 'var(--bg-card)',
                    border: '3px solid var(--bg-card)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    fontSize: '1.4rem'
                  }}
                >
                  {(detailsAgency.name || 'AG')
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div style={{ flex: 1, paddingBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {detailsAgency.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <MapPin size={13} color="var(--primary)" />
                    <span>{detailsAgency.headquarters}</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics Strip */}
              <div className="agency-stats-strip" style={{ margin: '14px 0' }}>
                <div className="agency-stat-col">
                  <strong>{detailsAgency.rosterCount || 15} Artists</strong>
                  <span>Active Roster</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--primary)' }}>{detailsAgency.commission || '12%'}</strong>
                  <span>Commission Fee</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--accent)' }}>Active</strong>
                  <span>Partnership Tier</span>
                </div>
              </div>

              {/* About & Specialty */}
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Representation Scope & Specialty
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {detailsAgency.specialty}
                </p>
              </div>

              {/* Direct Liaison Dossier */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Official Representation Contacts
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <Globe size={15} color="var(--primary)" />
                      <span>{detailsAgency.website}</span>
                    </div>
                    <a
                      href={detailsAgency.website?.startsWith('http') ? detailsAgency.website : `https://${detailsAgency.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                    >
                      Open <ExternalLink size={11} style={{ marginLeft: '3px' }} />
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <Mail size={15} color="var(--primary)" />
                      <span>{detailsAgency.email}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      onClick={() => handleCopy(detailsAgency.email, 'modal-email')}
                    >
                      {copiedKey === 'modal-email' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <Phone size={15} color="var(--accent)" />
                      <span>{detailsAgency.phone}</span>
                    </div>
                    <a
                      href={`tel:${detailsAgency.phone}`}
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                    >
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDetailsAgency(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const target = detailsAgency;
                  setDetailsAgency(null);
                  setConnectAgency(target);
                }}
              >
                <Send size={14} /> Connect Agency
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CONNECT / INQUIRY MODAL
          ======================================================== */}
      {connectAgency && (
        <div className="modal-overlay" onClick={() => setConnectAgency(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge">
                  <Send size={18} />
                </div>
                <div>
                  <h3>Connect with {connectAgency.name}</h3>
                  <p>Send an official casting or brand endorsement inquiry</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setConnectAgency(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendConnect}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Inquiry Purpose *</label>
                  <select
                    className="zenve-select"
                    value={connectSubject}
                    onChange={(e) => setConnectSubject(e.target.value)}
                  >
                    <option value="Brand Endorsement Inquiry">Brand Endorsement Inquiry</option>
                    <option value="Celebrity Casting Call">Celebrity Casting Call / Audition</option>
                    <option value="Contract Representation Renewal">Contract Representation Renewal</option>
                    <option value="Co-Production Partnership">Co-Production Partnership</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Requirement Details</label>
                  <textarea
                    className="zenve-input"
                    rows={4}
                    style={{ resize: 'vertical' }}
                    placeholder={`Hello ${connectAgency.name} team,\n\nWe would like to discuss representation options and upcoming campaign casting opportunities for our brand clients.`}
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                  />
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="var(--accent)" />
                  <span>Transmitted securely to authorized liaison: {connectAgency.email}</span>
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setConnectAgency(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Send size={14} /> Send Official Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
