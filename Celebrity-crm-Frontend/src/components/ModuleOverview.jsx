import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Users, UserCheck, Building2, FileText, Megaphone, Camera, Tv, Sparkles, LayoutGrid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModuleOverview() {
  const { celebrities = [], shoots = [], campaigns = [], contracts = [], managers = [], agencies = [] } = useCrm();

  const modules = [
    {
      name: 'Celebrities',
      count: `${celebrities.length} Roster Stars`,
      link: '/celebrities',
      icon: Users
    },
    {
      name: 'Managers',
      count: `${managers.length} Talent Leads`,
      link: '/managers',
      icon: UserCheck
    },
    {
      name: 'Agencies',
      count: `${agencies.length} Partner Networks`,
      link: '/agencies',
      icon: Building2
    },
    {
      name: 'Contracts',
      count: `${contracts.length} Legal Accords`,
      link: '/contracts',
      icon: FileText
    },
    {
      name: 'Campaigns',
      count: `${campaigns.length} Active Deals`,
      link: '/campaigns',
      icon: Megaphone
    },
    {
      name: 'Shoots',
      count: `${shoots.length} Production Calls`,
      link: '/shoots',
      icon: Camera
    },
    {
      name: 'OTT Projects',
      count: '6 Streaming Slates',
      link: '/ott-projects',
      icon: Tv
    },
    {
      name: 'Casting Calls',
      count: '28 Auditions',
      link: '/casting',
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
            >
              <div className="module-icon-wrap">
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
