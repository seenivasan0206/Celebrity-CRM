import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';
import PerformanceChart from '../components/PerformanceChart';
import StatusDonutChart from '../components/StatusDonutChart';
import RecentActivity from '../components/RecentActivity';
import { BarChart2, Download, TrendingUp, DollarSign, Award, Users, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function Reports() {
  const { addToast } = useCrm();

  const [metrics, setMetrics] = useState({
    totalCelebrities: 9,
    activeCelebrities: 9,
    totalAgencies: 4,
    activeAgencies: 4,
    totalCampaigns: 4,
    totalShoots: 6,
    upcomingShoots: 6,
    totalManagers: 6,
    totalCampaignBudget: 700000,
    totalShootBudget: 400000
  });

  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.reports.getDashboard();
      if (data) {
        setMetrics(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (err) {
      console.warn('Live reports fetch failed, using fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Celebrities,${metrics.totalCelebrities}\n` +
      `Active Celebrities,${metrics.activeCelebrities}\n` +
      `Total Partner Agencies,${metrics.totalAgencies}\n` +
      `Total Brand Campaigns,${metrics.totalCampaigns}\n` +
      `Total Production Shoots,${metrics.totalShoots}\n` +
      `Total Campaign Budget (USD),$${metrics.totalCampaignBudget?.toLocaleString()}\n` +
      `Total Shoot Budget (USD),$${metrics.totalShootBudget?.toLocaleString()}\n` +
      `Report Generated At,${new Date().toISOString()}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zenve_crm_executive_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Executive CSV Report downloaded successfully!', 'success');
  };

  const handleExportPDF = () => {
    window.print();
    addToast('Print dialog triggered for PDF generation', 'info');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Executive Intelligence & Reports</h2>
          <p>Portfolio ROI, campaign execution throughput, and live database metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={fetchReports}
            title="Refresh live metrics from backend"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleExportPDF}
          >
            <Download size={14} /> Export PDF Report
          </button>
        </div>
      </div>

      <div className="stat-cards-grid" style={{ marginBottom: '24px' }}>
        <div className="crm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Campaign Pipeline</span>
            <DollarSign size={18} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            ${(metrics.totalCampaignBudget || 700000).toLocaleString()}
          </h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600 }}>
            Across {metrics.totalCampaigns} active campaigns
          </span>
        </div>

        <div className="crm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Active Roster Celebrities</span>
            <Award size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{metrics.activeCelebrities} Stars</h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600 }}>
            Managed across {metrics.totalManagers} Talent Leads
          </span>
        </div>

        <div className="crm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Production Shoots Scheduled</span>
            <TrendingUp size={18} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{metrics.totalShoots} Shoots</h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600 }}>
            ${(metrics.totalShootBudget || 400000).toLocaleString()} shoot budget allocated
          </span>
        </div>

        <div className="crm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Partner Agency Network</span>
            <Users size={18} color="var(--secondary)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{metrics.totalAgencies} Agencies</h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--secondary)', fontWeight: 600 }}>
            100% active collaboration status
          </span>
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
