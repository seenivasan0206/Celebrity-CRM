import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, X, Check, Upload, Link as LinkIcon, Sparkles, RefreshCw } from 'lucide-react';

const CURATED_EXECUTIVE_PHOTOS = [
  { id: 1, label: 'Executive Male (Navy Suit)', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
  { id: 2, label: 'Managing Director (Blazer)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { id: 3, label: 'Creative VP (Studio Portrait)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 4, label: 'Senior Agent (Charcoal)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
  { id: 5, label: 'Head of Endorsements', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 6, label: 'Pan-India Casting Lead', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 7, label: 'Talent Acquisition VP', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80' },
  { id: 8, label: 'Celebrity Publicist', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80' }
];

export default function ChangeManagerPhotoModal({ manager, isOpen, onClose, onSavePhoto }) {
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'upload' | 'url'
  const [selectedPhoto, setSelectedPhoto] = useState(manager?.photo || CURATED_EXECUTIVE_PHOTOS[0].url);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen || !manager) return null;

  const handleFileUpload = (e) => {
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      setSelectedPhoto(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleSave = () => {
    onSavePhoto(manager.id, selectedPhoto);
    onClose();
  };

  const handleResetDefault = () => {
    const defaultPhoto = CURATED_EXECUTIVE_PHOTOS[0].url;
    setSelectedPhoto(defaultPhoto);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card-alt)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--c-primary-dim)', color: 'var(--primary)' }}
            >
              <Camera size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                Change Profile Photo
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                Updating portrait for <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{manager.name}</span> ({manager.agency})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-dim)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div 
          className="p-5 border-b flex items-center gap-4"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
        >
          <div 
            className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0"
            style={{ borderColor: 'var(--primary)', background: 'var(--bg-card-alt)' }}
          >
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--primary)' }}>
              <Sparkles size={12} /> Live Preview
            </span>
            <p className="text-sm font-bold mt-0.5 truncate" style={{ color: 'var(--text-main)' }}>{manager.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{manager.role || manager.title}</p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>This portrait will appear on all agency liaison cards.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div 
          className="flex border-b px-5 pt-3 gap-3"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card-alt)' }}
        >
          <button
            onClick={() => setActiveTab('curated')}
            className="pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
            style={{
              borderColor: activeTab === 'curated' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'curated' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <Sparkles size={14} /> Curated Headshots
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className="pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
            style={{
              borderColor: activeTab === 'upload' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'upload' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <Upload size={14} /> Upload Device File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className="pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
            style={{
              borderColor: activeTab === 'url' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'url' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <LinkIcon size={14} /> Image URL
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'curated' && (
            <div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                Select one of the curated professional headshots optimized for entertainment executives:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CURATED_EXECUTIVE_PHOTOS.map((item) => {
                  const isSelected = selectedPhoto === item.url;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPhoto(item.url)}
                      className="group relative rounded-xl overflow-hidden border transition-all text-left aspect-square"
                      style={{
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                        background: 'var(--bg-card-alt)'
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                      {isSelected && (
                        <div 
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                          style={{ background: 'var(--primary)', color: '#ffffff' }}
                        >
                          <Check size={14} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/75 p-1.5">
                        <span className="text-[10px] text-white font-medium block truncate leading-tight">
                          {item.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center"
                style={{
                  borderColor: 'var(--border-medium)',
                  background: 'var(--bg-card-alt)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'var(--c-primary-dim)', color: 'var(--primary)' }}
                >
                  <Upload size={24} />
                </div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Click to browse your photos</h4>
                <p className="text-xs mt-1 max-w-xs" style={{ color: 'var(--text-muted)' }}>
                  Upload high-res PNG, JPG, or WEBP portrait from your computer (up to 5MB).
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ marginTop: '16px', fontSize: '0.78rem', padding: '6px 14px' }}
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold block" style={{ color: 'var(--text-main)' }}>
                Direct Image Link (HTTPS)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="zenve-input flex-1"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!customUrl.trim()}
                  className="btn-primary"
                  style={{ padding: '6px 16px', fontSize: '0.78rem' }}
                >
                  Apply
                </button>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                Paste any direct image URL. It will instantly preview in the box above.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div 
          className="p-5 border-t flex items-center justify-between gap-3"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card-alt)' }}
        >
          <button
            type="button"
            onClick={handleResetDefault}
            className="btn-secondary"
            style={{ fontSize: '0.76rem', padding: '6px 12px' }}
          >
            <RefreshCw size={13} /> Reset Photo
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ fontSize: '0.76rem', padding: '6px 14px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              style={{ fontSize: '0.76rem', padding: '6px 16px' }}
            >
              <Check size={14} /> Save New Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
