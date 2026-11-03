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
import { Users, Megaphone, FileText, Camera, Plus, Sparkles, Film, ArrowRight, Star } from 'lucide-react';
import bannerImg from '../assets/dashboard-banner.jpg';

export default function Dashboard() {
  const { user } = useAuth();
  const { celebrities = [], campaigns = [], contracts = [], shoots = [], openModal, setActiveModal } = useCrm();

  const handleOpenModal = (name) => {
    if (openModal) {
      openModal(name);
    } else if (setActiveModal) {
      setActiveModal(name);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Panoramic Celebrity Hero Banner (Light & Dark Theme Adaptive) */}
      <div className="dashboard-hero-banner">
        <div
          className="hero-banner-bg"
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
        <div className="hero-banner-overlay" />

        <div className="hero-banner-content">
          <div className="hero-banner-left">
            <div className="hero-banner-tag">
              <span className="hero-live-pulse-dot" />
              <Sparkles size={12} className="hero-tag-sparkle" />
              <span>LOOP STREAM X TALENT & OTT PRODUCTION SUITE</span>
              <span className="hero-tag-status">ONLINE</span>
            </div>

            <h1 className="hero-banner-title">
              Good Morning, {user?.name || 'Admin'} <span className="hero-wave" role="img" aria-label="wave">👋</span>
            </h1>

            <p className="hero-banner-subtitle">
              Overseeing Roster Stars, Active Brand Deals & Scheduled Shoots across Pan-India Studios.
            </p>

            <div className="hero-banner-actions">
              <button
                type="button"
                className="btn-primary hero-btn-primary"
                onClick={() => handleOpenModal('scheduleShoot')}
              >
                <Plus size={15} /> New Shoot Call
              </button>
              <button
                type="button"
                className="btn-secondary hero-btn-secondary"
                onClick={() => handleOpenModal('addCelebrity')}
              >
                <Sparkles size={15} /> Onboard Talent
              </button>
            </div>
          </div>

          <div className="hero-banner-right-badges">
            <div className="hero-stat-pill">
              <div className="hero-stat-pill-icon stars">
                <Star size={15} />
              </div>
              <div className="hero-stat-pill-info">
                <span className="hero-stat-num">{celebrities.length}</span>
                <span className="hero-stat-lbl">Active Stars</span>
              </div>
            </div>
            <div className="hero-stat-pill">
              <div className="hero-stat-pill-icon shoots">
                <Camera size={15} />
              </div>
              <div className="hero-stat-pill-info">
                <span className="hero-stat-num">{shoots.length}</span>
                <span className="hero-stat-lbl">Shoot Calls</span>
              </div>
            </div>
            <div className="hero-stat-pill">
              <div className="hero-stat-pill-icon deals">
                <Megaphone size={15} />
              </div>
              <div className="hero-stat-pill-info">
                <span className="hero-stat-num">{campaigns.length}</span>
                <span className="hero-stat-lbl">Live Deals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Celebrities"
          value={celebrities.length}
          change="↑ 12%"
          isPositive={true}
          icon={Users}
        />
        <StatCard
          title="Active Campaigns"
          value={campaigns.length}
          change="↑ 33%"
          isPositive={true}
          icon={Megaphone}
        />
        <StatCard
          title="Total Contracts"
          value={contracts.length}
          change="↑ 25%"
          isPositive={true}
          icon={FileText}
        />
        <StatCard
          title="Ongoing Shoots"
          value={shoots.length}
          change="↑ 67%"
          isPositive={true}
          icon={Camera}
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
        <div className="shoots-table-col">
          <ShootsTable />
        </div>
        <div className="top-celeb-col">
          <TopCelebrities />
        </div>
        <div className="quick-actions-col">
          <QuickActions />
        </div>
      </div>

      {/* Bottom Row: 8 Module Cards */}
      <ModuleOverview />
    </div>
  );
}
