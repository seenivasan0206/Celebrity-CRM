import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Upload, Link as LinkIcon, Camera, Check, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

export const CURATED_EXECUTIVE_PHOTOS = [
  {
    id: 'male-1',
    label: 'Executive Partner (Navy Suit)',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'female-1',
    label: 'Brand Director (Modern)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'male-2',
    label: 'Talent Producer (Studio)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'female-2',
    label: 'Casting Relations Head',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'male-3',
    label: 'Creative Director',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'female-3',
    label: 'Senior Artist Rep',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'male-4',
    label: 'VP of Representations',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'female-4',
    label: 'Managing Director',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80'
  }
];

export default function ChangeManagerPhotoModal({ manager, isOpen, onClose, onSavePhoto }) {
  if (!isOpen || !manager) return null;

  const { theme } = useAuth();
  const isLight = theme === 'light';

  const currentPhoto = manager.photo || manager.avatar || CURATED_EXECUTIVE_PHOTOS[0].url;
  const [selectedPhoto, setSelectedPhoto] = useState(currentPhoto);
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'upload' | 'url'
  const fileInputRef = useRef(null);

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
          setSelectedPhoto(event.target.result);
        }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#111827] border-slate-700/80 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/60'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-indigo-50 border border-indigo-100 text-indigo-600' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'}`}>
              <Camera size={20} />
            </div>
            <div>
              <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Change Profile Photo
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Updating portrait for <span className="text-indigo-600 font-semibold">{manager.name}</span> ({manager.agency})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className={`p-5 border-b flex items-center gap-4 ${isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-900/40 border-slate-800/80'}`}>
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500/80 shadow-lg shadow-indigo-950/20 bg-slate-800 flex-shrink-0">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
              <Sparkles size={12} /> Live Preview
            </span>
            <p className={`text-sm font-bold mt-0.5 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{manager.name}</p>
            <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{manager.role || manager.title}</p>
            <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>This portrait will appear on all agency liaison cards.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b px-5 pt-3 gap-3 ${isLight ? 'border-slate-200 bg-slate-50/30' : 'border-slate-800 bg-slate-900/30'}`}>
          <button
            onClick={() => setActiveTab('curated')}
            className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'curated'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={14} /> Curated Headshots
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload size={14} /> Upload Device File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon size={14} /> Image URL
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'curated' && (
            <div>
              <p className={`text-xs mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Select one of the curated professional headshots optimized for luxury entertainment executives:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CURATED_EXECUTIVE_PHOTOS.map((item) => {
                  const isSelected = selectedPhoto === item.url;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPhoto(item.url)}
                      className={`group relative rounded-xl overflow-hidden border transition-all text-left aspect-square ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-600 shadow-md shadow-indigo-600/30'
                          : isLight
                            ? 'border-slate-200 hover:border-slate-300 bg-slate-50'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                          <Check size={14} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-1.5">
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
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  isLight
                    ? 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-slate-100/60'
                    : 'border-slate-700 hover:border-indigo-500 bg-slate-900/30 hover:bg-slate-900/60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  <Upload size={24} />
                </div>
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Click to browse your photos</h4>
                <p className={`text-xs mt-1 max-w-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Upload high-res PNG, JPG, or WEBP portrait from your computer (up to 5MB).
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Direct Image Link (HTTPS)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className={`flex-1 border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' 
                      : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!customUrl.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Paste any direct image URL. It will instantly preview in the box above.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-5 border-t flex items-center justify-between gap-3 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/60'}`}>
          <button
            type="button"
            onClick={handleResetDefault}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <RefreshCw size={13} /> Reset Photo
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isLight 
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/30"
            >
              <Check size={14} /> Save New Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
