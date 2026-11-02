import React from 'react';
import { useCrm } from '../context/CrmContext';
import PerformanceChart from '../components/PerformanceChart';
import StatusDonutChart from '../components/StatusDonutChart';
import RecentActivity from '../components/RecentActivity';
import { BarChart2, Download, TrendingUp, DollarSign, Award, Users } from 'lucide-react';

export default function Reports() {
  const { addToast } = useCrm();

  const handleExport = (type) => {
    addToast(`Exporting comprehensive CRM ${type} report...`, 'success');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Executive Intelligence & Reports</h2>
          <p>Portfolio ROI, campaign execution throughput, and talent agency metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleExport('CSV')}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => handleExport('PDF')}
          >
            <Download size={14} /> Export PDF Report
          </button>
        </div>
      </div>

      <div className="stat-cards-grid" style={{ marginBottom: '24px' }}>
        <div className="crm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Annual Payout Volume</span>
            <DollarSign size={18} color="#10B981" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>$1.85M</h3>
          <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600 }}>↑ 22% Year-over-Year</span>
        </div>

        <div className="crm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Shoot Completion Rate</span>
            <TrendingUp size={18} color="#06B6D4" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>98.4%</h3>
          <span style={{ fontSize: '0.74rem', color: '#06B6D4', fontWeight: 600 }}>On-time call sheet delivery</span>
        </div>

        <div className="crm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Average Endorsement Deal</span>
            <Award size={18} color="#F59E0B" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>$245,000</h3>
          <span style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 600 }}>Across top 10 celebrities</span>
        </div>

        <div className="crm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Brand Satisfaction</span>
            <Users size={18} color="#8B5CF6" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>99.2%</h3>
          <span style={{ fontSize: '0.74rem', color: '#8B5CF6', fontWeight: 600 }}>42 Client brands surveyed</span>
        </div>
      </div>

      <div className="analytics-grid-row">
        <PerformanceChart />
        <StatusDonutChart />
        <RecentActivity />
      </div>
    </div>
  );
}

