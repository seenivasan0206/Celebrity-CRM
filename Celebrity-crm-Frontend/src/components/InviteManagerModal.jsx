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
  const [photoSourceTab, setPhotoSourceTab] = useState('presets'); // 'presets' | 'upload' | 'url'
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
    setPhotoSourceTab('presets');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#111827] border-slate-700/80 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isLight
                  ? 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                  : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
              }`}
            >
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Invite Talent Manager
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Add an agency executive or artist representative to Zenve CRM
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Portrait Preview and Selector Section */}
            <div
              className={`p-4 rounded-xl border flex flex-col gap-3.5 ${
                isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/70 shadow-md bg-slate-800 flex-shrink-0">
                  <img
                    src={photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/managers/1.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <Camera size={13} /> Manager Portrait
                  </label>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Choose a preset headshot, upload a photo file, or enter a URL.
                  </p>
                </div>
              </div>

              {/* Source Tabs */}
              <div
                className={`flex rounded-lg p-1 text-xs font-medium border ${
                  isLight ? 'bg-slate-200/60 border-slate-200' : 'bg-slate-800/80 border-slate-700/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPhotoSourceTab('presets')}
                  className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    photoSourceTab === 'presets'
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={12} /> Presets
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoSourceTab('upload')}
                  className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    photoSourceTab === 'upload'
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload size={12} /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoSourceTab('url')}
                  className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    photoSourceTab === 'url'
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon size={12} /> Image URL
                </button>
              </div>

              {/* Tab 1: Presets */}
              {photoSourceTab === 'presets' && (
                <div className="grid grid-cols-6 gap-2 pt-1">
                  {PRESET_PORTRAITS.map((p) => {
                    const isSelected = photo === p.url;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPhoto(p.url)}
                        className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/40 scale-105'
                            : isLight
                            ? 'border-slate-200 hover:border-indigo-400'
                            : 'border-slate-700 hover:border-indigo-500'
                        }`}
                        title={p.label}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <div className="bg-indigo-600 text-white p-0.5 rounded-full shadow">
                              <Check size={11} strokeWidth={3} />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Upload */}
              {photoSourceTab === 'upload' && (
                <div className="pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full py-4 px-3 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 text-xs transition-colors ${
                      isLight
                        ? 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/40 text-slate-600'
                        : 'border-slate-700 hover:border-indigo-500 hover:bg-indigo-950/20 text-slate-300'
                    }`}
                  >
                    <Upload size={18} className="text-indigo-500" />
                    <span className="font-semibold">Click to select photo from computer</span>
                    <span className="text-[11px] opacity-70">JPG, PNG, WEBP up to 5MB</span>
                  </button>
                </div>
              )}

              {/* Tab 3: URL */}
              {photoSourceTab === 'url' && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`flex-1 px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                        : 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Field: Full Name */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Full Name *
              </label>
              <div className="relative">
                <User
                  size={15}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isLight ? 'text-slate-400' : 'text-slate-500'
                  }`}
                />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Varma"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none transition-all ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      : 'bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900/30'
                  }`}
                />
              </div>
            </div>

            {/* Fields: Email and Phone (2-col grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Work Email *
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isLight ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@agency.com"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none transition-all ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                        : 'bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900/30'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Direct Phone *
                </label>
                <div className="relative">
                  <Phone
                    size={15}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isLight ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98400 12345"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none transition-all ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                        : 'bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900/30'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Fields: Agency and Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Agency Organization *
                </label>
                <div className="relative">
                  <Building2
                    size={15}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isLight ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  />
                  <select
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none transition-all appearance-none cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                        : 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900/30'
                    }`}
                  >
                    {agencyOptions.map((opt) => (
                      <option key={opt} value={opt} className={isLight ? 'text-slate-900' : 'bg-slate-900 text-white'}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Designation / Role
                </label>
                <div className="relative">
                  <Briefcase
                    size={15}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isLight ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior VP of Talent"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none transition-all ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                        : 'bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900/30'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`p-4 border-t flex items-center justify-end gap-3 ${
              isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-colors ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <UserPlus size={16} /> Invite Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
