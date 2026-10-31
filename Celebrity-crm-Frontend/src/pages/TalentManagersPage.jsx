import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import TalentManagerCard, { DEFAULT_MANAGER_PHOTOS } from '../components/TalentManagerCard';
import { 
  Users, 
  Building2, 
  Star, 
  Search, 
  UserPlus, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function TalentManagersPage() {
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const { managers, searchQuery: globalSearchQuery, setSearchQuery: setGlobalSearchQuery, addToast, updateManagerPhoto } = useCrm();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('All');

  // Defensive hydration in case old localStorage was saved without photos
  useEffect(() => {
    managers.forEach((m) => {
      if (!m.photo) {
        const fallback =
          DEFAULT_MANAGER_PHOTOS[m.id] ||
          DEFAULT_MANAGER_PHOTOS[(m.name || '').toLowerCase().trim()] ||
          DEFAULT_MANAGER_PHOTOS[1];
        if (fallback && updateManagerPhoto) {
          updateManagerPhoto(m.id, fallback);
        }
      }
    });
  }, [managers, updateManagerPhoto]);

  // Combined search query from either local filter input or global header search
  const effectiveQuery = (localSearch || globalSearchQuery || '').toLowerCase().trim();

  // Extract distinct agencies for the agency filter tabs
  const agencies = useMemo(() => {
    const list = Array.from(new Set(managers.map((m) => m.agency).filter(Boolean)));
    return ['All', ...list];
  }, [managers]);

  // Total represented talents count across all managers
  const totalTalentsCount = useMemo(() => {
    const uniqueTalents = new Set();
    managers.forEach((m) => {
      const talents = m.representedTalents || m.assignedCelebrities || [];
      talents.forEach((t) => uniqueTalents.add(t));
    });
    return uniqueTalents.size;
  }, [managers]);

  // Filter managers based on query and agency selection
  const filteredManagers = useMemo(() => {
    return managers.filter((m) => {
      const name = (m.name || '').toLowerCase();
      const role = (m.role || m.title || '').toLowerCase();
      const agency = (m.agency || '').toLowerCase();
      const talents = (m.representedTalents || m.assignedCelebrities || []).map((t) => t.toLowerCase());

      const matchesAgency = selectedAgency === 'All' || m.agency === selectedAgency;

      const matchesSearch =
        !effectiveQuery ||
        name.includes(effectiveQuery) ||
        role.includes(effectiveQuery) ||
        agency.includes(effectiveQuery) ||
        talents.some((t) => t.includes(effectiveQuery));

      return matchesAgency && matchesSearch;
    });
  }, [managers, selectedAgency, effectiveQuery]);

  const handleInviteLiaison = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('https://zenvecrm.io/portal/liaison-invite?ref=exec-vip');
    }
    if (addToast) {
      addToast('Agency liaison invite link copied to clipboard!', 'info');
    } else {
      alert('Agency liaison invite link copied to clipboard!');
    }
  };

  return (
    <div 
      className={`flex-1 min-h-[calc(100vh-70px)] p-6 md:p-8 lg:p-10 transition-colors duration-200 ${
        isLight ? 'bg-[#f4f6fb] text-slate-800' : 'bg-[#0b0f19] text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ========================================================
            PAGE HEADER & ACTIONS
            ======================================================== */}
        <div 
          className={`flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div>
            <div 
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                isLight 
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' 
                  : 'bg-indigo-950/60 border border-indigo-800/40 text-indigo-400'
              }`}
            >
              <Sparkles size={12} className={isLight ? 'text-indigo-600' : 'text-indigo-400'} />
              <span>Executive Directory</span>
            </div>
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Talent Managers & Agency Liaisons
            </h1>
            <p 
              className={`text-sm sm:text-base mt-1.5 font-normal ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Key agency executives, artist reps, and endorsement agents
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleInviteLiaison}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 transition-all shadow-lg shadow-indigo-600/25 border border-indigo-500/30"
            >
              <UserPlus size={16} />
              <span>Invite Liaison</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            METRICS QUICK SUMMARY BAR
            ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div 
            className={`rounded-2xl p-4 flex items-center gap-3.5 transition-all ${
              isLight 
                ? 'bg-white border border-slate-200/90 shadow-sm shadow-slate-200/40 text-slate-900' 
                : 'bg-[#111827] border border-slate-800 shadow-sm text-white'
            }`}
          >
            <div 
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isLight 
                  ? 'bg-indigo-50 border border-indigo-100 text-indigo-600' 
                  : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
              }`}
            >
              <Users size={20} />
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Active Liaisons
              </p>
              <h4 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {managers.length}
              </h4>
            </div>
          </div>

          <div 
            className={`rounded-2xl p-4 flex items-center gap-3.5 transition-all ${
              isLight 
                ? 'bg-white border border-slate-200/90 shadow-sm shadow-slate-200/40 text-slate-900' 
                : 'bg-[#111827] border border-slate-800 shadow-sm text-white'
            }`}
          >
            <div 
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isLight 
                  ? 'bg-cyan-50 border border-cyan-100 text-cyan-600' 
                  : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
              }`}
            >
              <Building2 size={20} />
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Partner Agencies
              </p>
              <h4 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {agencies.length - 1}
              </h4>
            </div>
          </div>

          <div 
            className={`rounded-2xl p-4 flex items-center gap-3.5 transition-all ${
              isLight 
                ? 'bg-white border border-slate-200/90 shadow-sm shadow-slate-200/40 text-slate-900' 
                : 'bg-[#111827] border border-slate-800 shadow-sm text-white'
            }`}
          >
            <div 
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isLight 
                  ? 'bg-amber-50 border border-amber-100 text-amber-600' 
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
              }`}
            >
              <Star size={20} />
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Represented Talents
              </p>
              <h4 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {totalTalentsCount}
              </h4>
            </div>
          </div>

          <div 
            className={`rounded-2xl p-4 flex items-center gap-3.5 transition-all ${
              isLight 
                ? 'bg-white border border-slate-200/90 shadow-sm shadow-slate-200/40 text-slate-900' 
                : 'bg-[#111827] border border-slate-800 shadow-sm text-white'
            }`}
          >
            <div 
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isLight 
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' 
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              }`}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                SLA Response
              </p>
              <h4 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                &lt; 2 hrs
              </h4>
            </div>
          </div>
        </div>

        {/* ========================================================
            SEARCH & FILTER CONTROLS
            ======================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Agency Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {agencies.map((agency) => {
              const isSelected = selectedAgency === agency;
              return (
                <button
                  key={agency}
                  onClick={() => setSelectedAgency(agency)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                      : isLight
                        ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90 shadow-xs'
                        : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {agency === 'All' ? 'All Agencies' : agency}
                </button>
              );
            })}
          </div>

          {/* Quick Filter Box */}
          <div className="relative w-full lg:w-72">
            <Search 
              size={16} 
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-slate-400' : 'text-slate-500'
              }`} 
            />
            <input
              type="text"
              placeholder="Filter by name, talent, agency..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                isLight
                  ? 'bg-white border border-slate-200/90 text-slate-900 placeholder-slate-400 shadow-xs'
                  : 'bg-[#111827] border border-slate-800 text-slate-200 placeholder-slate-500'
              }`}
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                  isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ========================================================
            MANAGERS PROFILE CARDS (RESPONSIVE GRID)
            Mobile: 1 col | Tablet: 2 cols | Desktop: 2-3 cols
            ======================================================== */}
        {filteredManagers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredManagers.map((manager) => (
              <TalentManagerCard key={manager.id || manager.email} manager={manager} />
            ))}
          </div>
        ) : (
          /* Empty Search Filter State */
          <div 
            className={`border rounded-2xl p-12 text-center max-w-lg mx-auto ${
              isLight 
                ? 'bg-white border-slate-200/90 shadow-md text-slate-900' 
                : 'bg-[#111827] border-slate-800 text-white'
            }`}
          >
            <div 
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              <Search size={28} />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              No talent managers match your search
            </h3>
            <p className={`text-sm mt-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Try adjusting your search criteria or reset filters to see all available liaisons.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSelectedAgency('All');
                  if (setGlobalSearchQuery) setGlobalSearchQuery('');
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    : 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700'
                }`}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
