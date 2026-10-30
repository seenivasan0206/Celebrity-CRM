import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, isPositive = true, icon: Icon, color, accentGlow }) {
  return (
    <div className="stat-card" style={{ '--card-accent': accentGlow }}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-icon-box" style={{ background: color }}>
          <Icon size={22} />
        </div>
      </div>
      <div className="stat-card-body">
        <span className="stat-number">{value}</span>
      </div>
      <div className="stat-card-footer">
        <span className={`stat-trend ${isPositive ? 'up' : 'down'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </span>
        <span className="stat-footer-text"> vs last month</span>
      </div>
    </div>
  );
}

