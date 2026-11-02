import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  UserPlus,
  Mail,
  Phone,
  User,
  Building2,
  Briefcase,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Camera,
  Check
} from 'lucide-react';

const PRESET_PORTRAITS = [
  { id: 1, url: '/images/managers/1.jpg', label: 'Navy Suit' },
  { id: 2, url: '/images/managers/2.jpg', label: 'Executive' },
  { id: 3, url: '/images/managers/3.jpg', label: 'Modern Studio' },
  { id: 4, url: '/images/managers/4.jpg', label: 'Casting Head' },
  { id: 5, url: '/images/managers/5.jpg', label: 'Alliances' },
  { id: 6, url: '/images/managers/6.jpg', label: 'Global Rep' }
];

const DEFAULT_AGENCIES = [
  'Elite Talent Management',
  'Global Talent & Media',
  'Apex Studio Representations',
  'Zenve Talent Network'
];

export default function InviteManagerModal({
  isOpen,
  onClose,
  onAddManager,
  currentAgency = 'Elite Talent Management',
  existingAgencies = []
}) {
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agency, setAgency] = useState('Elite Talent Management');
  const [role, setRole] = useState('Senior VP of Talent');
  const [photo, setPhoto] = useState('/images/managers/1.jpg');
  const [customUrl, setCustomUrl] = useState('');
  const [photoTab, setPhotoTab] = useState('presets'); // 'presets' | 'upload' | 'url'
  const fileInputRef = useRef(null);

  // Combine default and existing agencies uniquely
  const agencyOptions = Array.from(
    new Set([
      ...DEFAULT_AGENCIES,
      ...existingAgencies.filter((a) => a && a !== 'All')
    ])
  );

  useEffect(() => {
    if (isOpen) {
      if (currentAgency && currentAgency !== 'All') {
        setAgency(currentAgency);
      } else {
        setAgency('Elite Talent Management');
      }
    }
  }, [isOpen, currentAgency]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      setPhoto(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newManager = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      agency: agency.trim() || 'Elite Talent Management',
      role: role.trim() || 'Senior VP of Talent',
      title: role.trim() || 'Senior VP of Talent',
      photo: photo || '/images/managers/1.jpg',
      avatar: photo || '/images/managers/1.jpg',
      representedTalents: []
    };

    onAddManager(newManager);

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setAgency('Elite Talent Management');
    setRole('Senior VP of Talent');
    setPhoto('/images/managers/1.jpg');
    setCustomUrl('');
    setPhotoTab('presets');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div
              className="modal-icon-badge"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}
            >
              <UserPlus size={20} />
            </div>
            <div>
              <h3>Invite Talent Manager</h3>
              <p>Add an agency executive or artist representative to Zenve CRM</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body" style={{ overflowY: 'auto', gap: '16px' }}>
            {/* Portrait Preview & Source Selector */}
            <div
              style={{
                background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '2px solid #6366F1',
                    background: '#1e293b',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                  }}
                >
                  <img
                    src={photo}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/images/managers/1.jpg';
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#6366F1',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Camera size={13} /> Manager Portrait
                  </span>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Select a preset headshot, upload a picture file, or enter an image URL.
                  </p>
                </div>
              </div>

              {/* Source Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.06)',
                  padding: '3px',
                  borderRadius: '9px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setPhotoTab('presets')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '7px',
                    border: 'none',
                    cursor: 'pointer',
                    background: photoTab === 'presets' ? '#6366F1' : 'transparent',
                    color: photoTab === 'presets' ? '#ffffff' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <Sparkles size={12} /> Presets
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('upload')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '7px',
                    border: 'none',
                    cursor: 'pointer',
                    background: photoTab === 'upload' ? '#6366F1' : 'transparent',
                    color: photoTab === 'upload' ? '#ffffff' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <Upload size={12} /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('url')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '7px',
                    border: 'none',
                    cursor: 'pointer',
                    background: photoTab === 'url' ? '#6366F1' : 'transparent',
                    color: photoTab === 'url' ? '#ffffff' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <LinkIcon size={12} /> URL
                </button>
              </div>

              {/* Tab 1: Presets Grid */}
              {photoTab === 'presets' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '8px',
                    paddingTop: '4px'
                  }}
                >
                  {PRESET_PORTRAITS.map((p) => {
                    const isSelected = photo === p.url;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPhoto(p.url)}
                        title={p.label}
                        style={{
                          position: 'relative',
                          aspectRatio: '1',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: isSelected ? '2px solid #6366F1' : `1px solid ${isLight ? '#cbd5e1' : '#334155'}`,
                          padding: 0,
                          cursor: 'pointer',
                          background: 'transparent',
                          transform: isSelected ? 'scale(1.05)' : 'none',
                          boxShadow: isSelected ? '0 0 0 2px rgba(99, 102, 241, 0.4)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(99, 102, 241, 0.35)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <div
                              style={{
                                background: '#6366F1',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff'
                              }}
                            >
                              <Check size={11} strokeWidth={3} />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Upload File */}
              {photoTab === 'upload' && (
                <div style={{ paddingTop: '4px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '10px',
                      border: `2px dashed ${isLight ? '#cbd5e1' : '#475569'}`,
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#6366F1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : '#475569';
                    }}
                  >
                    <Upload size={20} color="#6366F1" />
                    <span style={{ fontWeight: 600 }}>Click to select photo from device</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>JPG, PNG, WEBP up to 5MB</span>
                  </button>
                </div>
              )}

              {/* Tab 3: URL */}
              {photoTab === 'url' && (
                <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="zenve-input"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Field: Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="zenve-input"
                placeholder="e.g. Ramesh Varma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            {/* Fields: Email & Phone (Grid 2) */}
            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Work Email *</label>
                <input
                  type="email"
                  required
                  className="zenve-input"
                  placeholder="ramesh@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Direct Phone *</label>
                <input
                  type="tel"
                  required
                  className="zenve-input"
                  placeholder="+91 98400 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Fields: Agency & Role (Grid 2) */}
            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Agency Organization *</label>
                <select
                  className="zenve-select"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                >
                  {agencyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Designation / Role</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. Senior VP of Talent"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={16} /> Invite Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
