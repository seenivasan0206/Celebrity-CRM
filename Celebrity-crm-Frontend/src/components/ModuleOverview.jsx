import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Users, UserCheck, Building2, FileText, Megaphone, Camera, Tv, Sparkles, LayoutGrid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModuleOverview() {
  const { celebrities, shoots, campaigns, contracts, managers } = useCrm();

  const modules = [
    {
      name: 'Celebrities',
      count: `${celebrities.length} Total`,
      link: '/celebrities',
      color: '#6366F1',
      icon: Users
    },
    {
      name: 'Managers',
      count: `${managers.length} Total`,
      link: '/managers',
      color: '#06B6D4',
      icon: UserCheck
    },
    {
      name: 'Agencies',
      count: '4 Partnered',
      link: '/agencies',
      color: '#10B981',
      icon: Building2
    },
    {
      name: 'Contracts',
      count: `${contracts.length} Total`,
      link: '/contracts',
      color: '#F59E0B',
      icon: FileText
    },
    {
      name: 'Campaigns',
      count: `${campaigns.length} Active`,
      link: '/campaigns',
      color: '#EC4899',
      icon: Megaphone
    },
    {
      name: 'Shoots',
      count: `${shoots.length} Ongoing`,
      link: '/shoots',
      color: '#14B8A6',
      icon: Camera
    },
    {
      name: 'OTT Projects',
      count: '3 In Production',
      link: '/ott-projects',
      color: '#8B5CF6',
      icon: Tv
    },
    {
      name: 'Casting Calls',
      count: '28 Auditions',
      link: '/casting',
      color: '#EAB308',
      icon: Sparkles
    }
  ];

  return (
    <div className="module-overview-section">
      <div className="section-headline">
        <LayoutGrid size={18} color="var(--primary)" />
        <span>Module Overview</span>
      </div>

      <div className="module-cards-grid">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.name}
              to={m.link}
              className="module-card"
              style={{ '--module-accent': m.color }}
            >
              <div className="module-icon-wrap" style={{ background: m.color }}>
                <Icon size={18} />
              </div>
              <span className="module-name">{m.name}</span>
              <span className="module-count">{m.count}</span>
              <span className="module-link-text">
                View <ArrowRight size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
