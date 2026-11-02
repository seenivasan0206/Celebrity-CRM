import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import {
  initialCelebrities,
  initialShoots,
  initialCampaigns,
  initialContracts,
  initialManagers,
  initialActivities
} from '../data/mockData';

const CrmContext = createContext();

// Helper map to retain curated photo URLs for well-known celebrities
const KNOWN_AVATARS = {
  'vijay': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'nayanthara': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'suriya': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'ajith kumar': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'trisha': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'dhanush': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'anirudh ravichander': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'samantha ruth prabhu': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
};

const DEFAULT_AGENCY_IMAGES = {
  'elite talent management': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
  'global talent & media': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
  'apex studio representations': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80',
  'zenve talent network': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80'
};

const initialAgenciesData = [
  {
    id: 1,
    name: 'Elite Talent Management',
    headquarters: 'Bandra West, Mumbai',
    specialty: 'A-List Film Actors & Global Ambassadorship',
    rosterCount: 14,
    commission: '12%',
    website: 'www.elitetalent.com',
    email: 'partners@elitetalent.com',
    phone: '+91 22 2640 8899',
    status: 'Verified Partner',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Global Talent & Media',
    headquarters: 'Poes Garden, Chennai',
    specialty: 'South Indian Superstars & OTT Exclusives',
    rosterCount: 22,
    commission: '10%',
    website: 'www.globaltalent.in',
    email: 'contact@globaltalent.in',
    phone: '+91 44 2811 5566',
    status: 'Verified Partner',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Apex Studio Representations',
    headquarters: 'Jubilee Hills, Hyderabad',
    specialty: 'Pan-India Action Icons & Commercial Ads',
    rosterCount: 11,
    commission: '15%',
    website: 'www.apexstudio.in',
    email: 'connect@apexstudio.in',
    phone: '+91 40 2355 4433',
    status: 'Premium Partner',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Zenve Talent Network',
    headquarters: 'Koramangala, Bangalore',
    specialty: 'Music Directors, Indie Stars & Tech Brands',
    rosterCount: 18,
    commission: '8%',
    website: 'www.zenvetalent.com',
    email: 'roster@zenvetalent.com',
    phone: '+91 80 4123 7788',
    status: 'Direct Network',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80'
  }
];

const mapBackendCelebrity = (b) => {
  const nameKey = (b.name || '').toLowerCase().trim();
  const isFemale = (b.gender || '').toLowerCase() === 'female' || (b.category || '').toLowerCase().includes('actress');
  const fallbackAvatar = isFemale
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

  let formattedFee = '$250,000 / yr';
  if (b.standardFee) {
    formattedFee = `$${Number(b.standardFee).toLocaleString()} / yr`;
  }

  let formattedFollowers = '5.0M';
  if (b.followersCount) {
    if (b.followersCount >= 1000000) {
      formattedFollowers = `${(b.followersCount / 1000000).toFixed(1)}M`;
    } else if (b.followersCount >= 1000) {
      formattedFollowers = `${(b.followersCount / 1000).toFixed(0)}K`;
    } else {
      formattedFollowers = String(b.followersCount);
    }
  }

  return {
    id: b.id,
    name: b.name,
    stageName: b.stageName,
    category: b.category,
    location: b.bio || 'Chennai',
    avatar: KNOWN_AVATARS[nameKey] || fallbackAvatar,
    email: b.email || 'mgmt@representation.com',
    phone: b.phone || '+91 98400 00000',
    activeContract: formattedFee,
    followers: formattedFollowers,
    campaignsCount: 0,
    status: (b.status || 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive',
    rating: 95
  };
};

const mapBackendCampaign = (b) => {
  let celebName = 'Vijay';
  if (b.description && b.description.includes('-')) {
    celebName = b.description.split('-')[0].trim();
  }

  let budgetStr = '$150,000';
  if (b.budget) {
    budgetStr = `$${Number(b.budget).toLocaleString()}`;
  }

  const statusStr = (b.status || 'ONGOING').toUpperCase();
  const normalizedStatus = statusStr === 'COMPLETED' ? 'Completed' : (statusStr === 'PLANNED' ? 'Planned' : 'Ongoing');

  return {
    id: b.id,
    title: b.name,
    brand: b.brand,
    celebrity: celebName,
    budget: budgetStr,
    deadline: b.endDate || '2026-06-30',
    progress: normalizedStatus === 'Completed' ? 100 : 65,
    reach: '14.2M Impressions',
    status: normalizedStatus
  };
};

const mapBackendShoot = (b) => {
  const celebName = b.celebrityName || 'Vijay';
  const nameKey = celebName.toLowerCase().trim();
  const avatar = KNOWN_AVATARS[nameKey] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

  let formattedDate = b.shootDate;
  if (b.shootDate) {
    try {
      const d = new Date(b.shootDate);
      formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      formattedDate = b.shootDate;
    }
  }

  let timeStr = '09:00 AM - 05:00 PM';
  if (b.startTime) {
    timeStr = `${String(b.startTime).slice(0, 5)} - ${String(b.endTime || '17:00').slice(0, 5)}`;
  }

  let director = 'Gautham Menon';
  if (b.notes && b.notes.toLowerCase().includes('director:')) {
    director = b.notes.split(/director:/i)[1].trim();
  }

  const statusStr = (b.status || 'SCHEDULED').toUpperCase();
  const normalizedStatus = statusStr === 'CONFIRMED' ? 'Confirmed' : (statusStr === 'PLANNED' ? 'Planned' : 'Scheduled');

  return {
    id: b.id,
    title: b.title,
    celebrity: celebName,
    celebrityAvatar: avatar,
    location: b.location || 'Chennai Studio 4',
    date: formattedDate || '28 Nov 2026',
    rawDate: b.shootDate || '2026-11-28',
    time: timeStr,
    director: director,
    status: normalizedStatus
  };
};

const mapBackendContract = (b) => {
  const contractId = b.contractNumber || `CNT-2026-${String(b.id).padStart(3, '0')}`;
  let formattedValue = '$250,000';
  if (b.totalValue) {
    formattedValue = `$${Number(b.totalValue).toLocaleString()}`;
  }

  let duration = '12 Months';
  if (b.startDate && b.endDate) {
    try {
      const d1 = new Date(b.startDate);
      const d2 = new Date(b.endDate);
      const months = Math.round((d2 - d1) / (1000 * 60 * 60 * 24 * 30.4));
      if (months > 0) duration = `${months} Months`;
    } catch {
      duration = '12 Months';
    }
  }

  const statusStr = (b.status || 'ACTIVE').toUpperCase();
  const normalizedStatus = statusStr === 'ACTIVE' ? 'Active' : (statusStr === 'PENDING' ? 'Pending' : 'Under Review');

  return {
    id: contractId,
    dbId: b.id,
    celebrity: b.celebrityName || 'Vijay',
    client: b.clientName || 'Brand Partner',
    value: formattedValue,
    duration: duration,
    category: b.terms?.includes('Ambassador') ? 'Brand Ambassadorship' : 'Endorsement',
    status: normalizedStatus
  };
};

const mapBackendManager = (b) => {
  const nameKey = (b.name || '').toLowerCase().trim();
  const defaultPhoto = `/images/managers/${b.id || 1}.jpg`;
  const defaultMatch = initialManagers.find((im) => im.id === b.id || im.email === b.email || im.name.toLowerCase() === nameKey);
  const talents = defaultMatch ? (defaultMatch.representedTalents || defaultMatch.assignedCelebrities || []) : ['Vijay'];

  return {
    id: b.id,
    name: b.name,
    role: defaultMatch?.role || 'Senior VP of Talent',
    title: defaultMatch?.title || 'Senior VP of Talent',
    agency: b.agency || 'Zenve Talent Network',
    email: b.email,
    phone: b.phone || '+91 98400 00000',
    status: (b.status || 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive',
    photo: defaultMatch?.photo || defaultPhoto,
    avatar: defaultMatch?.avatar || defaultPhoto,
    representedTalents: talents
  };
};

const mapBackendAgency = (b) => {
  const nameKey = (b.name || '').toLowerCase().trim();
  return {
    id: b.id,
    name: b.name,
    headquarters: b.address || 'Chennai',
    specialty: b.description || 'Talent Representation & Commercial Production',
    rosterCount: 15,
    commission: b.commissionRate ? `${b.commissionRate}%` : '10%',
    website: b.website || 'www.zenvetalent.com',
    email: b.email || 'contact@agency.com',
    phone: b.phone || '+91 98400 00000',
    status: (b.status || 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'Verified Partner' : 'Partner',
    image: DEFAULT_AGENCY_IMAGES[nameKey] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
  };
};

export const CrmProvider = ({ children }) => {
  const [celebrities, setCelebrities] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_celebrities');
      return saved ? JSON.parse(saved) : initialCelebrities;
    } catch {
      return initialCelebrities;
    }
  });

  const [shoots, setShoots] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_shoots');
      return saved ? JSON.parse(saved) : initialShoots;
    } catch {
      return initialShoots;
    }
  });

  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_campaigns');
      return saved ? JSON.parse(saved) : initialCampaigns;
    } catch {
      return initialCampaigns;
    }
  });

  const [contracts, setContracts] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_contracts');
      return saved ? JSON.parse(saved) : initialContracts;
    } catch {
      return initialContracts;
    }
  });

  const [managers, setManagers] = useState(() => {
    const saved = localStorage.getItem('zenve_managers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((m) => m.id));
        const hydrated = parsed.map((m) => {
          const defaultMatch = initialManagers.find((im) => im.id === m.id || im.email === m.email) || initialManagers[0];
          const resolvedPhoto = (m.photo && (m.photo.startsWith('/images/') || m.photo.startsWith('data:') || m.photo.startsWith('http'))) ? m.photo : (defaultMatch.photo || `/images/managers/${m.id || 1}.jpg`);
          return {
            ...defaultMatch,
            ...m,
            photo: resolvedPhoto,
            avatar: resolvedPhoto,
            role: m.role || m.title || defaultMatch.role,
            representedTalents: m.representedTalents || m.assignedCelebrities || defaultMatch.representedTalents || []
          };
        });
        const missing = initialManagers.filter((im) => !existingIds.has(im.id));
        const allManagers = [...hydrated, ...missing];
        localStorage.setItem('zenve_managers', JSON.stringify(allManagers));
        return allManagers;
      } catch {
        return initialManagers;
      }
    }
    return initialManagers;
  });

  const [agencies, setAgencies] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_agencies');
      return saved ? JSON.parse(saved) : initialAgenciesData;
    } catch {
      return initialAgenciesData;
    }
  });

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_activities');
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Contract Milestone', text: 'Chrono Elite Swiss confirmed Vijay endorsement renewal', time: '10m ago', unread: true },
    { id: 2, title: 'Shoot Call Sheet Ready', text: 'Call sheet generated for Chennai Studio 4 photoshoot', time: '35m ago', unread: true },
    { id: 3, title: 'Casting Application', text: 'Ronit Sharma submitted actor audition tape', time: '2h ago', unread: false },
    { id: 4, title: 'Budget Approved', text: 'Apex Motors EV authorized $250k budget allocation', time: '4h ago', unread: false }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModalState] = useState(null);
  const [modalPayload, setModalPayload] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);

  /**
   * Load Celebrities, Campaigns, Shoots, Contracts, Managers, and Agencies from Backend Database on Mount
   */
  useEffect(() => {
    let isMounted = true;

    async function loadAllBackendData() {
      try {
        const results = await Promise.allSettled([
          api.celebrities.getAll(),
          api.campaigns.getAll(),
          api.shoots.getAll(),
          api.contracts.getAll(),
          api.managers.getAll(),
          api.agencies.getAll()
        ]);

        if (!isMounted) return;

        // 1. Celebrities
        if (results[0].status === 'fulfilled' && Array.isArray(results[0].value) && results[0].value.length > 0) {
          const mappedCelebs = results[0].value.map(mapBackendCelebrity);
          setCelebrities(mappedCelebs);
          localStorage.setItem('zenve_celebrities', JSON.stringify(mappedCelebs));
        }

        // 2. Campaigns
        if (results[1].status === 'fulfilled' && Array.isArray(results[1].value) && results[1].value.length > 0) {
          const mappedCamps = results[1].value.map(mapBackendCampaign);
          setCampaigns(mappedCamps);
          localStorage.setItem('zenve_campaigns', JSON.stringify(mappedCamps));
        }

        // 3. Shoots
        if (results[2].status === 'fulfilled' && Array.isArray(results[2].value) && results[2].value.length > 0) {
          const mappedShoots = results[2].value.map(mapBackendShoot);
          setShoots(mappedShoots);
          localStorage.setItem('zenve_shoots', JSON.stringify(mappedShoots));
        }

        // 4. Contracts
        if (results[3].status === 'fulfilled' && Array.isArray(results[3].value) && results[3].value.length > 0) {
          const mappedContracts = results[3].value.map(mapBackendContract);
          setContracts(mappedContracts);
          localStorage.setItem('zenve_contracts', JSON.stringify(mappedContracts));
        }

        // 5. Managers
        if (results[4].status === 'fulfilled' && Array.isArray(results[4].value) && results[4].value.length > 0) {
          const mappedManagers = results[4].value.map(mapBackendManager);
          setManagers(mappedManagers);
          localStorage.setItem('zenve_managers', JSON.stringify(mappedManagers));
        }

        // 6. Agencies
        if (results[5].status === 'fulfilled' && Array.isArray(results[5].value) && results[5].value.length > 0) {
          const mappedAgencies = results[5].value.map(mapBackendAgency);
          setAgencies(mappedAgencies);
          localStorage.setItem('zenve_agencies', JSON.stringify(mappedAgencies));
        }

        setBackendConnected(true);
      } catch (err) {
        console.warn('[CRM] Backend data fetch error:', err.message);
      }
    }

    loadAllBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (modalName, payload = null) => {
    setModalPayload(payload);
    setActiveModalState(modalName);
  };

  const closeModal = () => {
    setActiveModalState(null);
    setModalPayload(null);
  };

  const setActiveModal = (name) => {
    if (name) {
      openModal(name, null);
    } else {
      closeModal();
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * 1. CELEBRITY API HOOKS
   */
  const addCelebrity = async (celebrityData) => {
    let followersCount = 5000000;
    if (typeof celebrityData.followers === 'string') {
      const num = parseFloat(celebrityData.followers.replace(/[^0-9.]/g, ''));
      if (celebrityData.followers.toUpperCase().includes('M')) {
        followersCount = Math.round(num * 1000000);
      } else if (celebrityData.followers.toUpperCase().includes('K')) {
        followersCount = Math.round(num * 1000);
      } else if (!isNaN(num)) {
        followersCount = Math.round(num);
      }
    }

    let standardFee = 250000;
    if (typeof celebrityData.activeContract === 'string') {
      const num = parseFloat(celebrityData.activeContract.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) {
        standardFee = num;
      }
    }

    const payload = {
      name: celebrityData.name.trim(),
      stageName: celebrityData.stageName || celebrityData.name.trim(),
      category: celebrityData.category || 'Actor / Superstar',
      email: celebrityData.email?.trim() || `${celebrityData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now().toString().slice(-4)}@celebritycrm.com`,
      phone: celebrityData.phone?.trim() || '+91 98400 00000',
      gender: (celebrityData.category || '').toLowerCase().includes('actress') ? 'Female' : 'Male',
      bio: celebrityData.location || 'Chennai',
      socialMediaHandle: `@${celebrityData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      followersCount,
      standardFee,
      status: 'ACTIVE'
    };

    try {
      const created = await api.celebrities.create(payload);
      const mappedNewCeleb = mapBackendCelebrity(created);

      if (celebrityData.avatar) {
        mappedNewCeleb.avatar = celebrityData.avatar;
      }

      setCelebrities((prev) => {
        const updated = [mappedNewCeleb, ...prev];
        localStorage.setItem('zenve_celebrities', JSON.stringify(updated));
        return updated;
      });

      addActivity({
        type: 'profile',
        title: `Celebrity Onboarded: ${mappedNewCeleb.name}`,
        desc: `${mappedNewCeleb.category} from ${mappedNewCeleb.location} saved to database`,
        time: 'Just now'
      });

      addToast(`Added ${mappedNewCeleb.name} to database roster!`, 'success');
    } catch (err) {
      console.warn('[CRM] API create failed, falling back to local storage:', err.message);

      const fallbackCeleb = {
        id: Date.now(),
        campaignsCount: 0,
        status: 'Active',
        rating: 95,
        avatar: celebrityData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        followers: celebrityData.followers || '1.0M',
        ...celebrityData
      };

      setCelebrities((prev) => {
        const updated = [fallbackCeleb, ...prev];
        localStorage.setItem('zenve_celebrities', JSON.stringify(updated));
        return updated;
      });

      addToast(`Added ${fallbackCeleb.name} (Local fallback)`, 'info');
    }
  };

  const deleteCelebrity = async (id) => {
    const celeb = celebrities.find((c) => c.id === id);

    setCelebrities((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('zenve_celebrities', JSON.stringify(updated));
      return updated;
    });

    try {
      await api.celebrities.delete(id);
      addToast(`Removed ${celeb ? celeb.name : 'talent'} from database`, 'info');
    } catch (err) {
      console.warn('[CRM] Delete API note:', err.message);
      addToast(`Removed ${celeb ? celeb.name : 'talent'} from roster`, 'info');
    }
  };

  const updateCelebrityStatus = async (id, status) => {
    setCelebrities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );

    try {
      await api.celebrities.updateStatus(id, status);
      addToast(`Talent status updated to ${status}`, 'success');
    } catch (err) {
      console.warn('[CRM] Update status note:', err.message);
    }
  };

  /**
   * 2. CAMPAIGN API HOOKS
   */
  const addCampaign = async (campaignData) => {
    let budgetVal = 150000;
    if (typeof campaignData.budget === 'string') {
      const num = parseFloat(campaignData.budget.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) budgetVal = num;
    }

    const payload = {
      name: campaignData.title?.trim() || 'New Brand Campaign',
      brand: campaignData.brand?.trim() || 'Brand Partner',
      budget: budgetVal,
      startDate: new Date().toISOString().split('T')[0],
      endDate: campaignData.deadline || '2026-12-31',
      status: 'ONGOING',
      description: `${campaignData.celebrity || 'Talent'} - ${campaignData.title}`
    };

    try {
      const created = await api.campaigns.create(payload);
      const mapped = mapBackendCampaign(created);
      if (campaignData.celebrity) mapped.celebrity = campaignData.celebrity;

      setCampaigns((prev) => {
        const updated = [mapped, ...prev];
        localStorage.setItem('zenve_campaigns', JSON.stringify(updated));
        return updated;
      });

      setCelebrities((prev) =>
        prev.map((c) => {
          if (c.name.toLowerCase() === (mapped.celebrity || '').toLowerCase()) {
            return { ...c, campaignsCount: (c.campaignsCount || 0) + 1 };
          }
          return c;
        })
      );

      addActivity({
        type: 'campaign',
        title: `Campaign Created: ${mapped.title}`,
        desc: `Brand: ${mapped.brand} | Talent: ${mapped.celebrity} (${mapped.budget})`,
        time: 'Just now'
      });

      addToast(`Campaign "${mapped.title}" saved to database!`, 'success');
    } catch (err) {
      console.warn('[CRM] Campaign API create note:', err.message);
      const fallbackCampaign = {
        id: Date.now(),
        progress: 10,
        status: 'Ongoing',
        reach: 'Pending launch',
        ...campaignData
      };
      setCampaigns((prev) => [fallbackCampaign, ...prev]);
      addToast(`Campaign "${fallbackCampaign.title}" created!`, 'success');
    }
  };

  const updateCampaignStatus = async (id, newStatus) => {
    setCampaigns((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
      localStorage.setItem('zenve_campaigns', JSON.stringify(updated));
      return updated;
    });

    try {
      await api.campaigns.updateStatus(id, newStatus.toUpperCase());
      addToast(`Campaign status updated to "${newStatus}"`, 'info');
    } catch (err) {
      console.warn('[CRM] Campaign status note:', err.message);
      addToast(`Campaign status updated to "${newStatus}"`, 'info');
    }
  };

  const updateCampaignDeadline = (id, newDeadline) => {
    setCampaigns((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, deadline: newDeadline } : c));
      localStorage.setItem('zenve_campaigns', JSON.stringify(updated));
      return updated;
    });
    addToast(`Target date updated to "${newDeadline}"`, 'success');
  };

  const deleteCampaign = async (id) => {
    setCampaigns((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('zenve_campaigns', JSON.stringify(updated));
      return updated;
    });

    try {
      await api.campaigns.delete(id);
      addToast(`Campaign removed from database`, 'info');
    } catch (err) {
      console.warn('[CRM] Delete campaign note:', err.message);
      addToast(`Campaign removed`, 'info');
    }
  };

  /**
   * 3. SHOOT API HOOKS
   */
  const addShoot = async (shootData) => {
    const matchedCeleb = celebrities.find(
      (c) => c.name.toLowerCase() === (shootData.celebrity || '').toLowerCase()
    );

    let rawShootDate = shootData.rawDate || '2026-11-28';
    if (shootData.date && shootData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      rawShootDate = shootData.date;
    }

    const payload = {
      title: shootData.title?.trim() || 'Production Shoot',
      shootType: 'COMMERCIAL',
      location: shootData.location || 'Studio Stage',
      shootDate: rawShootDate,
      startTime: '09:00:00',
      endTime: '17:00:00',
      budget: 50000,
      status: 'SCHEDULED',
      notes: `Director: ${shootData.director || 'Crew Lead'}`,
      celebrityId: matchedCeleb ? matchedCeleb.id : null
    };

    try {
      const created = await api.shoots.create(payload);
      const mapped = mapBackendShoot(created);
      if (shootData.celebrity) mapped.celebrity = shootData.celebrity;

      setShoots((prev) => {
        const updated = [mapped, ...prev];
        localStorage.setItem('zenve_shoots', JSON.stringify(updated));
        return updated;
      });

      addActivity({
        type: 'shoot',
        title: `Shoot Scheduled: ${mapped.title}`,
        desc: `${mapped.celebrity} at ${mapped.location} on ${mapped.date}`,
        time: 'Just now'
      });

      addToast(`Shoot scheduled and saved to database!`, 'success');
    } catch (err) {
      console.warn('[CRM] Shoot create API note:', err.message);
      const fallbackShoot = {
        id: Date.now(),
        status: 'Scheduled',
        celebrityAvatar: matchedCeleb
          ? matchedCeleb.avatar
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        ...shootData
      };
      setShoots((prev) => [fallbackShoot, ...prev]);
      addToast(`Shoot scheduled for ${fallbackShoot.celebrity}!`, 'success');
    }
  };

  const updateShootStatus = async (id, newStatus) => {
    setShoots((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
      localStorage.setItem('zenve_shoots', JSON.stringify(updated));
      return updated;
    });

    try {
      await api.shoots.updateStatus(id, newStatus.toUpperCase());
      addToast(`Shoot status updated to "${newStatus}"`, 'info');
    } catch (err) {
      console.warn('[CRM] Shoot update status note:', err.message);
      addToast(`Shoot status updated to "${newStatus}"`, 'info');
    }
  };

  const deleteShoot = async (id) => {
    setShoots((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem('zenve_shoots', JSON.stringify(updated));
      return updated;
    });

    try {
      await api.shoots.delete(id);
      addToast(`Shoot canceled and removed from database`, 'info');
    } catch (err) {
      console.warn('[CRM] Delete shoot note:', err.message);
      addToast(`Shoot canceled and removed`, 'info');
    }
  };

  /**
   * 4. CONTRACT API HOOKS
   */
  const addContract = async (contractData) => {
    const count = contracts.length + 1;
    const contractNum = `CNT-2026-${String(count).padStart(3, '0')}`;

    let val = 250000;
    if (typeof contractData.value === 'string') {
      const num = parseFloat(contractData.value.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) val = num;
    }

    const matchedCeleb = celebrities.find(
      (c) => c.name.toLowerCase() === (contractData.celebrity || '').toLowerCase()
    );

    const payload = {
      contractNumber: contractNum,
      title: `${contractData.client || 'Client'} - ${contractData.celebrity || 'Talent'} Contract`,
      celebrityId: matchedCeleb ? matchedCeleb.id : null,
      celebrityName: contractData.celebrity || 'Talent',
      clientName: contractData.client || 'Client Brand',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      totalValue: val,
      status: 'ACTIVE',
      terms: contractData.category || 'Brand Endorsement Agreement'
    };

    try {
      const created = await api.contracts.create(payload);
      const mapped = mapBackendContract(created);

      setContracts((prev) => {
        const updated = [mapped, ...prev];
        localStorage.setItem('zenve_contracts', JSON.stringify(updated));
        return updated;
      });

      addActivity({
        type: 'contract',
        title: `Contract Executed: ${mapped.id}`,
        desc: `${mapped.celebrity} with ${mapped.client} (${mapped.value})`,
        time: 'Just now'
      });

      addToast(`Contract ${mapped.id} saved to database!`, 'success');
    } catch (err) {
      console.warn('[CRM] Contract create API note:', err.message);
      const fallbackContract = {
        id: contractNum,
        status: 'Active',
        signedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        ...contractData
      };
      setContracts((prev) => [fallbackContract, ...prev]);
      addToast(`Contract ${contractNum} executed successfully!`, 'success');
    }
  };

  const renewContract = async (id) => {
    const target = contracts.find((c) => c.id === id);

    setContracts((prev) => {
      const updated = prev.map((c) =>
        c.id === id
          ? {
              ...c,
              duration: `${parseInt(c.duration || '12') + 12} Months`,
              status: 'Active'
            }
          : c
      );
      localStorage.setItem('zenve_contracts', JSON.stringify(updated));
      return updated;
    });

    try {
      if (target && target.dbId) {
        await api.contracts.updateStatus(target.dbId, 'ACTIVE');
      }
      addToast(`Contract ${id} renewed for +12 Months in database!`, 'success');
    } catch (err) {
      console.warn('[CRM] Renew contract note:', err.message);
      addToast(`Contract ${id} renewed for +12 Months!`, 'success');
    }
  };

  /**
   * 5. MANAGER API HOOKS
   */
  const addManager = async (managerData) => {
    const payload = {
      name: managerData.name.trim(),
      email: managerData.email.trim(),
      phone: managerData.phone || '+91 98400 00000',
      agency: managerData.agency || 'Zenve Talent Network',
      status: 'ACTIVE'
    };

    try {
      const created = await api.managers.create(payload);
      const mapped = mapBackendManager(created);

      setManagers((prev) => {
        const updated = [mapped, ...prev];
        localStorage.setItem('zenve_managers', JSON.stringify(updated));
        return updated;
      });

      addToast(`Talent liaison ${mapped.name} added to database!`, 'success');
    } catch (err) {
      console.warn('[CRM] Manager create note:', err.message);
      const fallback = {
        id: Date.now(),
        ...managerData
      };
      setManagers((prev) => [fallback, ...prev]);
      addToast(`Talent liaison ${fallback.name} added!`, 'info');
    }
  };

  const updateManagerPhoto = (id, newPhoto) => {
    setManagers((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          return { ...m, photo: newPhoto, avatar: newPhoto };
        }
        return m;
      });
      localStorage.setItem('zenve_managers', JSON.stringify(updated));
      return updated;
    });
    const target = managers.find((m) => m.id === id);
    addToast('Profile photo updated for ' + (target?.name || 'Manager') + '!', 'success');
  };

  /**
   * 6. AGENCY API HOOKS
   */
  const addAgency = async (agencyData) => {
    const payload = {
      name: agencyData.name.trim(),
      email: agencyData.email || 'contact@agency.com',
      phone: agencyData.phone || '+91 98400 00000',
      website: agencyData.website || 'www.agency.com',
      address: agencyData.headquarters || 'Mumbai, India',
      country: 'India',
      commissionRate: parseFloat(agencyData.commission || '10') || 10.0,
      description: agencyData.specialty || 'Talent Representation',
      status: 'ACTIVE'
    };

    try {
      const created = await api.agencies.create(payload);
      const mapped = mapBackendAgency(created);

      setAgencies((prev) => {
        const updated = [mapped, ...prev];
        localStorage.setItem('zenve_agencies', JSON.stringify(updated));
        return updated;
      });

      addToast(`Partner Agency "${mapped.name}" saved to database!`, 'success');
    } catch (err) {
      console.warn('[CRM] Agency create note:', err.message);
      const fallback = {
        id: Date.now(),
        ...agencyData
      };
      setAgencies((prev) => [fallback, ...prev]);
      addToast(`Partner Agency "${fallback.name}" added!`, 'info');
    }
  };

  // Activity helper
  const addActivity = (act) => {
    const newAct = { id: Date.now(), ...act };
    setActivities((prev) => [newAct, ...prev.slice(0, 15)]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    addToast('All notifications marked as read', 'info');
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

<<<<<<< HEAD
=======
  const updateManagerPhoto = (id, newPhoto) => {
    setManagers(prev => {
      const updated = prev.map(m => {
        if (m.id === id) {
          return { ...m, photo: newPhoto, avatar: newPhoto };
        }
        return m;
      });
      localStorage.setItem('zenve_managers', JSON.stringify(updated));
      return updated;
    });
    const target = managers.find(m => m.id === id);
    addToast('Profile photo updated for ' + (target?.name || 'Manager') + '!', 'success');
  };

  const addManager = (newManager) => {
    setManagers(prev => {
      const updated = [newManager, ...(prev || [])];
      localStorage.setItem('zenve_managers', JSON.stringify(updated));
      return updated;
    });
    if (addToast) addToast(`Manager ${newManager.name} added successfully!`, 'success');
  };

>>>>>>> cad7f9deadd543bef7681d36b832c7457ca3dacf
  return (
    <CrmContext.Provider
      value={{
        celebrities,
        shoots,
        campaigns,
        contracts,
        managers,
        agencies,
        activities,
        notifications,
        markAllNotificationsRead,
        markNotificationRead,
        searchQuery,
        setSearchQuery,
        activeModal,
        setActiveModal,
        openModal,
        closeModal,
        modalPayload,
        toasts,
        addToast,
        removeToast,
        addCelebrity,
        deleteCelebrity,
        updateCelebrityStatus,
        addShoot,
        updateShootStatus,
        deleteShoot,
        addCampaign,
        updateCampaignStatus,
        updateCampaignDeadline,
        deleteCampaign,
        addContract,
        renewContract,
        addManager,
        updateManagerPhoto,
        addAgency,
        addActivity,
<<<<<<< HEAD
        backendConnected
=======
        updateManagerPhoto,
        addManager
>>>>>>> cad7f9deadd543bef7681d36b832c7457ca3dacf
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => useContext(CrmContext);
