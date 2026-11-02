import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import StatusDonutChart from '../components/StatusDonutChart';
import RecentActivity from '../components/RecentActivity';
import ShootsTable from '../components/ShootsTable';
import TopCelebrities from '../components/TopCelebrities';
import QuickActions from '../components/QuickActions';
import ModuleOverview from '../components/ModuleOverview';
import { Users, Megaphone, FileText, Camera, Plus, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { celebrities, campaigns, contracts, shoots, openModal, setActiveModal } = useCrm();

  const handleOpenModal = (name) => {
    if (openModal) {
      openModal(name);
    } else if (setActiveModal) {
      setActiveModal(name);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Greeting Header */}
      <div className="dashboard-greeting">
        <div className="greeting-text">
          <h2>
            Good Morning, {user?.name || 'Admin'} <span role="img" aria-label="wave">👋</span>
          </h2>
          <p>Here's what's happening with your celebrity management today.</p>
        </div>
        <div className="greeting-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => handleOpenModal('scheduleShoot')}
          >
            <Plus size={16} /> New Shoot Call
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleOpenModal('addCelebrity')}
          >
            <Sparkles size={16} /> Onboard Talent
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Celebrities"
          value={celebrities?.length || 0}
          change="↑ 12%"
          isPositive={true}
          icon={Users}
          color="linear-gradient(135deg, #6366F1 0%, #4338CA 100%)"
          accentGlow="rgba(99, 102, 241, 0.2)"
        />
        <StatCard
          title="Active Campaigns"
          value={campaigns?.length || 0}
          change="↑ 33%"
          isPositive={true}
          icon={Megaphone}
          color="linear-gradient(135deg, #10B981 0%, #059669 100%)"
          accentGlow="rgba(16, 185, 129, 0.2)"
        />
        <StatCard
          title="Total Contracts"
          value={contracts?.length || 0}
          change="↑ 25%"
          isPositive={true}
          icon={FileText}
          color="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
          accentGlow="rgba(245, 158, 11, 0.2)"
        />
        <StatCard
          title="Ongoing Shoots"
          value={shoots?.length || 0}
          change="↑ 67%"
          isPositive={true}
          icon={Camera}
          color="linear-gradient(135deg, #EC4899 0%, #DB2777 100%)"
          accentGlow="rgba(236, 72, 153, 0.2)"
        />
      </div>

      {/* Top Analytics Row: Performance Chart + Donut Chart + Recent Activity */}
      <div className="analytics-grid-row">
        <PerformanceChart />
        <StatusDonutChart />
        <div className="activity-card-col">
          <RecentActivity />
        </div>
      </div>

      {/* Middle Row: Upcoming Shoots Table + Top Celebrities + Quick Actions */}
      <div className="middle-grid-row">
        <ShootsTable />
        <TopCelebrities />
        <div className="quick-actions-col">
          <QuickActions />
        </div>
      </div>

      {/* 8-Card Module Quick-Access Overview Grid */}
      <ModuleOverview />
    </div>
  );
}
