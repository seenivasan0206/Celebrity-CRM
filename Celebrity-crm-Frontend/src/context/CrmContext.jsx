import React, { createContext, useContext, useState } from 'react';
import {
  initialCelebrities,
  initialShoots,
  initialCampaigns,
  initialContracts,
  initialManagers,
  initialActivities
} from '../data/mockData';

const CrmContext = createContext();

export const CrmProvider = ({ children }) => {
  const [celebrities, setCelebrities] = useState(() => {
    const saved = localStorage.getItem('zenve_celebrities');
    return saved ? JSON.parse(saved) : initialCelebrities;
  });

  const [shoots, setShoots] = useState(() => {
    const saved = localStorage.getItem('zenve_shoots');
    return saved ? JSON.parse(saved) : initialShoots;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('zenve_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem('zenve_contracts');
    return saved ? JSON.parse(saved) : initialContracts;
  });

  const [managers, setManagers] = useState(() => {
    const saved = localStorage.getItem('zenve_managers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hydrated = parsed.map((m) => {
          const defaultMatch = initialManagers.find((im) => im.id === m.id || im.email === m.email) || initialManagers[0];
          const resolvedPhoto = m.photo || m.avatar || defaultMatch.photo;
          return {
            ...defaultMatch,
            ...m,
            photo: resolvedPhoto,
            avatar: resolvedPhoto,
            role: m.role || m.title || defaultMatch.role,
            representedTalents: m.representedTalents || m.assignedCelebrities || defaultMatch.representedTalents || []
          };
        });
        localStorage.setItem('zenve_managers', JSON.stringify(hydrated));
        return hydrated;
      } catch {
        return initialManagers;
      }
    }
    return initialManagers;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('zenve_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Contract Milestone', text: 'Chrono Elite Swiss confirmed Vijay endorsement renewal', time: '10m ago', unread: true },
    { id: 2, title: 'Shoot Call Sheet Ready', text: 'Call sheet generated for Chennai Studio 4 photoshoot', time: '35m ago', unread: true },
    { id: 3, title: 'Casting Application', text: 'Ronit Sharma submitted actor audition tape', time: '2h ago', unread: false },
    { id: 4, title: 'Budget Approved', text: 'Apex Motors EV authorized $250k budget allocation', time: '4h ago', unread: false }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'addCelebrity' | 'createCampaign' | 'createContract' | 'scheduleShoot' | null
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Celebrity
  const addCelebrity = (celebrityData) => {
    const newCeleb = {
      id: Date.now(),
      campaignsCount: 0,
      status: 'Active',
      rating: 95,
      avatar: celebrityData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      followers: celebrityData.followers || '1.0M',
      ...celebrityData
    };
    const updated = [newCeleb, ...celebrities];
    setCelebrities(updated);
    localStorage.setItem('zenve_celebrities', JSON.stringify(updated));

    addActivity({
      type: 'profile',
      title: `Celebrity Onboarded: ${newCeleb.name}`,
      desc: `${newCeleb.category} from ${newCeleb.location} added to Zenve CRM`,
      time: 'Just now',
      iconColor: '#6366F1'
    });

    addToast(`Added ${newCeleb.name} to talent roster!`, 'success');
  };

  // Add Shoot
  const addShoot = (shootData) => {
    const matchedCeleb = celebrities.find(c => c.name.toLowerCase() === (shootData.celebrity || '').toLowerCase());
    const newShoot = {
      id: Date.now(),
      status: 'Scheduled',
      celebrityAvatar: matchedCeleb ? matchedCeleb.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      ...shootData
    };
    const updated = [newShoot, ...shoots];
    setShoots(updated);
    localStorage.setItem('zenve_shoots', JSON.stringify(updated));

    addActivity({
      type: 'shoot',
      title: `Shoot Scheduled: ${newShoot.title}`,
      desc: `${newShoot.celebrity} at ${newShoot.location} on ${newShoot.date}`,
      time: 'Just now',
      iconColor: '#EC4899'
    });

    addToast(`Shoot scheduled for ${newShoot.celebrity}!`, 'success');
  };

  // Update Shoot Status
  const updateShootStatus = (id, newStatus) => {
    const updated = shoots.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setShoots(updated);
    localStorage.setItem('zenve_shoots', JSON.stringify(updated));
    addToast(`Shoot status updated to ${newStatus}`, 'info');
  };

  // Delete Shoot
  const deleteShoot = (id) => {
    const updated = shoots.filter(s => s.id !== id);
    setShoots(updated);
    localStorage.setItem('zenve_shoots', JSON.stringify(updated));
    addToast(`Shoot removed from schedule`, 'info');
  };

  // Add Campaign
  const addCampaign = (campaignData) => {
    const newCampaign = {
      id: Date.now(),
      progress: 10,
      status: 'Ongoing',
      reach: 'Pending launch',
      ...campaignData
    };
    const updated = [newCampaign, ...campaigns];
    setCampaigns(updated);
    localStorage.setItem('zenve_campaigns', JSON.stringify(updated));

    // Also update celebrity campaign count
    setCelebrities(prev => prev.map(c => {
      if (c.name.toLowerCase() === (newCampaign.celebrity || '').toLowerCase()) {
        return { ...c, campaignsCount: (c.campaignsCount || 0) + 1 };
      }
      return c;
    }));

    addActivity({
      type: 'campaign',
      title: `Campaign Created: ${newCampaign.title}`,
      desc: `Brand: ${newCampaign.brand} | Talent: ${newCampaign.celebrity} (${newCampaign.budget})`,
      time: 'Just now',
      iconColor: '#10B981'
    });

    addToast(`Campaign "${newCampaign.title}" created successfully!`, 'success');
  };

  // Add Contract
  const addContract = (contractData) => {
    const count = contracts.length + 1;
    const newContract = {
      id: `CNT-2026-${String(count).padStart(3, '0')}`,
      status: 'Active',
      signedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...contractData
    };
    const updated = [newContract, ...contracts];
    setContracts(updated);
    localStorage.setItem('zenve_contracts', JSON.stringify(updated));

    addActivity({
      type: 'contract',
      title: `Contract Executed: ${newContract.id}`,
      desc: `${newContract.celebrity} with ${newContract.client} (${newContract.value})`,
      time: 'Just now',
      iconColor: '#F59E0B'
    });

    addToast(`Contract ${newContract.id} created!`, 'success');
  };

  // Add Activity helper
  const addActivity = (act) => {
    const newAct = { id: Date.now(), ...act };
    setActivities(prev => [newAct, ...prev.slice(0, 15)]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

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

  return (
    <CrmContext.Provider
      value={{
        celebrities,
        shoots,
        campaigns,
        contracts,
        managers,
        activities,
        notifications,
        markAllNotificationsRead,
        searchQuery,
        setSearchQuery,
        activeModal,
        setActiveModal,
        toasts,
        addToast,
        removeToast,
        addCelebrity,
        addShoot,
        updateShootStatus,
        deleteShoot,
        addCampaign,
        addContract,
        addActivity,
        updateManagerPhoto
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => useContext(CrmContext);

