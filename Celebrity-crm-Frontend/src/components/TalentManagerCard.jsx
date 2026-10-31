import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import { Mail, Phone, Building2, Star, Check, Copy, ShieldCheck, Camera } from 'lucide-react';
import ChangeManagerPhotoModal from './ChangeManagerPhotoModal';

export const DEFAULT_MANAGER_PHOTOS = {
  1: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  4: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'john doe': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  'sarah jenkins': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'vikram rathore': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'priya sunder': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
};

export default function TalentManagerCard({ manager }) {
  const { theme } = useAuth();
  const { updateManagerPhoto } = useCrm();
  const isLight = theme === 'light';

  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Normalize data keys (supporting role/title and representedTalents/assignedCelebrities)
  const name = manager?.name || 'Talent Liaison';
  const role = manager?.role || manager?.title || 'Senior Talent Manager';
  const agency = manager?.agency || 'Independent Agency';
  const email = manager?.email || '';
  const phone = manager?.phone || '';
  const talents = manager?.representedTalents || manager?.assignedCelebrities || [];
  const status = manager?.status || 'Active';

  // Guaranteed fallback photo if missing from manager object
  const photo =
    manager?.photo ||
    manager?.avatar ||
    DEFAULT_MANAGER_PHOTOS[manager?.id] ||
    DEFAULT_MANAGER_PHOTOS[(name || '').toLowerCase().trim()] ||
    DEFAULT_MANAGER_PHOTOS[1];

  // Initials calculation for graceful fallback
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'TM';

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSaveNewPhoto = (id, newPhoto) => {
    if (updateManagerPhoto) {
      updateManagerPhoto(id, newPhoto);
    }
    setImgError(false);
  };

  return (
    <>
      <div 
        className={`group relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
          isLight
            ? 'bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1'
            : 'bg-[#111827] border border-slate-800 hover:border-slate-750 shadow-2xl shadow-black/50 hover:shadow-2xl hover:-translate-y-1'
        }`}
      >
        {/* Top Details Section */}
        <div>
          {/* Profile Image & Header Row */}
          <div className="flex items-start gap-4">
            {/* Visible Profile Photo with Fallback & Interactive Change Photo Button */}
            <div 
              className="group/avatar relative flex-shrink-0 cursor-pointer" 
              onClick={() => setIsPhotoModalOpen(true)}
              title="Click to view or change portrait photo"
            >
              <div 
                className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 ${
                  isLight
                    ? 'bg-slate-100 border border-slate-200 ring-2 ring-slate-100'
                    : 'bg-slate-800/90 border border-slate-700/80 ring-2 ring-slate-800/60'
                }`}
              >
                {!imgError ? (
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      if (!e.target.dataset.fallbackTried) {
                        e.target.dataset.fallbackTried = 'true';
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e1b4b&color=a5b4fc&size=200&bold=true`;
                      } else {
                        setImgError(true);
                      }
                    }}
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600 text-white font-bold text-lg sm:text-xl flex items-center justify-center tracking-wider rounded-2xl">
                    {initials}
                  </div>
                )}

                {/* Hover Camera Overlay to Change Photo */}
                <div 
                  className="absolute inset-0 bg-black/65 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-2xl"
                  title="Change Profile Photo"
                >
                  <Camera size={18} className="text-white drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5 tracking-tight text-white drop-shadow">
                    Change
                  </span>
                </div>
              </div>

              {/* Online / Active Status Dot */}
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                  isLight ? 'border-white' : 'border-[#111827]'
                } ${
                  status === 'Active' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-500'
                }`}
                title={`${name} is ${status}`}
              />

              {/* Small Camera Badge for Touch Devices */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPhotoModalOpen(true);
                }}
                className={`sm:hidden absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-indigo-600 text-white border-2 flex items-center justify-center shadow ${
                  isLight ? 'border-white' : 'border-[#111827]'
                }`}
                title="Change Photo"
                aria-label="Change Photo"
              >
                <Camera size={10} />
              </button>
            </div>

            {/* Name, Designation & Agency Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 
                  className={`text-lg font-bold tracking-tight transition-colors ${
                    isLight 
                      ? 'text-slate-900 group-hover:text-indigo-600' 
                      : 'text-white group-hover:text-indigo-300'
                  }`}
                >
                  {name}
                </h3>
                <span 
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-md border ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-emerald-950/70 text-emerald-400 border-emerald-800/50'
                  }`}
                >
                  <ShieldCheck size={10} /> Active
                </span>
              </div>

              {/* Designation / Role */}
              <p 
                className={`text-sm font-medium mt-1 leading-snug ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {role}
              </p>

              {/* Agency with Icon */}
              <div 
                className={`flex items-center gap-1.5 text-xs mt-1.5 leading-snug ${
                  isLight ? 'text-slate-500' : 'text-slate-500'
                }`}
              >
                <Building2 size={13} className={isLight ? 'text-slate-400' : 'text-slate-500'} />
                <span>{agency}</span>
              </div>
            </div>
          </div>

          {/* Subtle Horizontal Divider */}
          <div className={`h-px my-5 ${isLight ? 'bg-slate-100' : 'bg-slate-800/80'}`} />

          {/* Contact Details */}
          <div className="space-y-2.5">
            {/* Email row with hover underline & copy action */}
            <div className="flex items-center justify-between gap-2 group/email text-xs sm:text-sm">
              <a
                href={`mailto:${email}`}
                className={`flex items-center gap-2.5 hover:underline transition-colors min-w-0 truncate ${
                  isLight 
                    ? 'text-slate-700 hover:text-indigo-600' 
                    : 'text-slate-300 hover:text-indigo-300'
                }`}
                title={`Send email to ${email}`}
              >
                <Mail size={15} className={isLight ? 'text-indigo-600 flex-shrink-0' : 'text-indigo-400 flex-shrink-0'} />
                <span className="truncate font-mono text-[13px]">{email}</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className={`p-1 rounded-md transition-all flex-shrink-0 ${
                  isLight
                    ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
                title="Copy email to clipboard"
                aria-label="Copy email address"
              >
                {copied ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                    <Check size={13} />
                    <span className="hidden xs:inline">Copied</span>
                  </span>
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>

            {/* Phone row with phone icon */}
            {phone && (
              <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                <Phone size={15} className={isLight ? 'text-cyan-600 flex-shrink-0' : 'text-cyan-400 flex-shrink-0'} />
                <a
                  href={`tel:${phone}`}
                  className={`transition-colors font-mono text-[13px] ${
                    isLight 
                      ? 'text-slate-700 hover:text-cyan-600' 
                      : 'text-slate-300 hover:text-cyan-300'
                  }`}
                  title={`Call ${phone}`}
                >
                  {phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Represented Talents Section */}
        <div className={`mt-6 pt-5 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
          <div className="flex items-center justify-between mb-3">
            <span 
              className={`text-xs font-semibold tracking-wider uppercase ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              REPRESENTED TALENTS
            </span>
            <span className={`text-[11px] font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              {talents.length} {talents.length === 1 ? 'Talent' : 'Talents'}
            </span>
          </div>

          {talents.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {talents.map((talentName) => (
                <span
                  key={talentName}
                  className={`rounded-full px-3 py-1 text-sm inline-flex items-center gap-1.5 shadow-sm transition-colors ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 text-slate-700'
                      : 'bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 text-slate-200'
                  }`}
                >
                  <Star size={12} className={isLight ? 'text-amber-500 fill-amber-500/20' : 'text-amber-400 fill-amber-400/20'} />
                  <span>{talentName}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className={`text-xs italic ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>No assigned talents</p>
          )}
        </div>
      </div>

      {/* Change Photo Modal for this Manager */}
      <ChangeManagerPhotoModal
        manager={{ ...manager, photo }}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSavePhoto={handleSaveNewPhoto}
      />
    </>
  );
}
