import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resolveManagerPhoto } from '../data/managerPhotos';
import {
  Camera,
  X,
  Check,
  Upload,
  Link as LinkIcon,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Star,
  Copy,
  User,
  RotateCcw,
  Lock,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function ChangeManagerPhotoModal({ manager, isOpen, onClose, onSavePhoto, onDeleteManager }) {
  const { user, theme } = useAuth();
  const fileInputRef = useRef(null);

  const defaultPhoto = resolveManagerPhoto(manager);
  const [selectedPhoto, setSelectedPhoto] = useState(defaultPhoto);
  const [customUrl, setCustomUrl] = useState('');
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Role & Ownership Authorization
  const userRole = (user?.role || '').toUpperCase();
  const isAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';
  const isSelf = Boolean(
    (user?.email && manager?.email && user.email.toLowerCase() === manager.email.toLowerCase()) ||
    (user?.name && manager?.name && user.name.toLowerCase() === manager.name.toLowerCase()) ||
    (user?.username && manager?.email && manager.email.toLowerCase().includes(user.username.toLowerCase()))
  );
  const canEdit = isAdmin || isSelf;

  useEffect(() => {
    if (manager) {
      const p = resolveManagerPhoto(manager);
      setSelectedPhoto(p);
      setHasChanged(false);
      setIsUpdatingPhoto(false);
      setCustomUrl('');
      setShowDeleteConfirm(false);
    }
  }, [manager]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen || !manager) return null;

  const talents = manager.representedTalents || manager.assignedCelebrities || [];

  const handleFileUpload = (e) => {
    if (!canEdit) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Data = uploadEvent.target.result;
        setSelectedPhoto(base64Data);
        setHasChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (!canEdit) return;
    if (customUrl.trim()) {
      setSelectedPhoto(customUrl.trim());
      setHasChanged(true);
      setCustomUrl('');
    }
  };

  const handleResetToDefault = () => {
    setSelectedPhoto(defaultPhoto);
    setHasChanged(false);
    setCustomUrl('');
  };

  const handleSave = () => {
    if (!canEdit) {
      alert('Permission Denied: You cannot modify another user\'s profile.');
      return;
    }
    if (onSavePhoto) {
      onSavePhoto(manager.id, selectedPhoto);
    }
    onClose();
  };

  const handleDelete = () => {
    if (!isAdmin) {
      alert('Permission Denied: Only administrators can delete manager accounts.');
      return;
    }
    if (onDeleteManager) {
      onDeleteManager(manager.id);
    }
    onClose();
  };

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    if (manager.email) {
      navigator.clipboard.writeText(manager.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const initials = (manager.name || 'TM')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'TM';

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1000,
        overscrollBehavior: 'contain',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain'
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {canEdit ? 'Manager Profile & Portrait' : 'Manager Profile Dossier'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {canEdit ? (isSelf ? 'Your Account Profile' : 'Administrator Control') : 'Read-Only View • Access Restricted'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: 'var(--text-dim)', cursor: 'pointer', lineHeight: 1 }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Security Banner if user is not authorized to edit */}
          {!canEdit && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.76rem',
                color: 'var(--text-muted)'
              }}
            >
              <Lock size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <strong>View-Only Mode:</strong> Signed in as{' '}
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{user?.name || user?.username || 'User'}</span>{' '}
                ({user?.role || 'Staff'}). Only <strong>{manager.name}</strong> or an Administrator can modify this profile or delete account records.
              </div>
            </div>
          )}

          {/* Manager Hero Profile Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              padding: '16px',
              background: 'var(--bg-card-alt)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {/* Manager Avatar / Portrait */}
            <div style={{ position: 'relative', width: '96px', height: '96px', flexShrink: 0 }}>
              {selectedPhoto ? (
                <img
                  src={selectedPhoto}
                  alt={manager.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    border: '2px solid var(--primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    background: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    border: '2px solid var(--primary)'
                  }}
                >
                  {initials}
                </div>
              )}

              {/* Photo Change Trigger Badge — ONLY shown if canEdit */}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsUpdatingPhoto((prev) => !prev)}
                  title="Change portrait photo"
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    border: '2px solid var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Camera size={14} />
                </button>
              )}
            </div>

            {/* Manager Meta Info */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {manager.name}
                </h4>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    background: 'var(--accent-subtle)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--accent-border)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShieldCheck size={11} /> ACTIVE
                </span>
                {isSelf && (
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      background: 'var(--primary-subtle)',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    You
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)' }}>
                {manager.role || manager.title || 'Senior VP of Talent'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <Building2 size={13} color="var(--text-dim)" />
                <span>{manager.agency || 'Zenve Talent Network'}</span>
              </div>
            </div>
          </div>

          {/* Photo Update Section — ONLY accessible when canEdit */}
          {canEdit && isUpdatingPhoto && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Update Portrait Photo
                </span>
                <button
                  type="button"
                  onClick={() => setIsUpdatingPhoto(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>

              {/* Upload file from computer */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  <Upload size={15} /> Upload Photo from Computer
                </button>
              </div>

              {/* Or paste an image URL */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                  <LinkIcon size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-dim)' }} />
                  <input
                    type="url"
                    placeholder="Or paste direct image URL..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="zenve-input"
                    style={{ paddingLeft: '32px', fontSize: '0.8rem', height: '36px' }}
                  />
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleApplyUrl}
                  disabled={!customUrl.trim()}
                  style={{ padding: '0 14px', fontSize: '0.78rem', height: '36px' }}
                >
                  Apply
                </button>
              </div>

              {hasChanged && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RotateCcw size={12} /> Reset to original
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)' }}>
              Direct Contact
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  background: 'var(--bg-card-alt)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}
              >
                <a
                  href={`mailto:${manager.email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title="Send email"
                >
                  <Mail size={14} color="var(--primary)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{manager.email}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy email"
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                >
                  {copiedEmail ? <Check size={13} color="var(--accent)" /> : <Copy size={13} />}
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '9px 12px',
                  background: 'var(--bg-card-alt)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}
              >
                <a
                  href={`tel:${manager.phone}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title="Call manager"
                >
                  <Phone size={14} color="var(--accent)" />
                  <span>{manager.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Represented Talents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)' }}>
                Represented Talents
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                {talents.length} Assigned Stars
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {talents.length > 0 ? (
                talents.map((celebName) => (
                  <span
                    key={celebName}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      background: 'var(--bg-card-alt)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: 'var(--text-main)'
                    }}
                  >
                    <Star size={11} fill="var(--primary)" color="var(--primary)" />
                    {celebName}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  No talents currently assigned.
                </span>
              )}
            </div>
          </div>

          {/* Admin-only Danger Zone for deleting/deactivating manager */}
          {isAdmin && (
            <div
              style={{
                marginTop: '10px',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.76rem', fontWeight: 700 }}>
                  <AlertTriangle size={14} />
                  <span>Administrator Privilege: Manager Account Management</span>
                </div>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--danger)',
                      color: 'var(--danger)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={12} /> Remove Manager
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={handleDelete}
                      style={{
                        background: 'var(--danger)',
                        border: 'none',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-dim)' }}>
                Only verified system administrators have authorization to remove manager accounts from the directory.
              </span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div
          className="modal-footer"
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card-alt)'
          }}
        >
          <div>
            {canEdit && !isUpdatingPhoto && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsUpdatingPhoto(true)}
                style={{ fontSize: '0.76rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Camera size={13} /> Update Portrait
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ fontSize: '0.76rem', padding: '6px 14px' }}
            >
              Close
            </button>
            {canEdit && hasChanged && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleSave}
                style={{ fontSize: '0.76rem', padding: '6px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={14} /> Save New Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
