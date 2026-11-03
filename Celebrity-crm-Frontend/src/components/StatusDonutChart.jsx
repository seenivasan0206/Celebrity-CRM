import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Trophy } from 'lucide-react';

export default function StatusDonutChart() {
  const { celebrities = [] } = useCrm();
  const [activeSegment, setActiveSegment] = useState(null);

  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Real database calculation from live celebrities list
  const activeCount = celebrities.filter(c => (c.status || '').toUpperCase() === 'ACTIVE').length;
  const onHoldCount = celebrities.filter(c => ['ON HOLD', 'ON_HOLD', 'NEGOTIATION'].includes((c.status || '').toUpperCase())).length;
  const inactiveCount = celebrities.filter(c => (c.status || '').toUpperCase() === 'INACTIVE').length;
  const pendingCount = Math.max(0, celebrities.length - (activeCount + onHoldCount + inactiveCount));

  const totalCount = celebrities.length || 1;

  const statusItems = [
    { label: 'Active', count: activeCount },
    { label: 'On Hold', count: onHoldCount },
    { label: 'Inactive', count: inactiveCount },
    { label: 'Pending', count: pendingCount }
  ];

  // Map each status to our clean 5-colour palette
  const statusPalette = {
    'Active': '#10B981',     // Accent (Emerald)
    'On Hold': '#3B82F6',    // Primary (Blue)
    'Inactive': '#64748B',   // Secondary (Slate)
    'Pending': '#94A3B8'     // Muted Slate
  };

  let accumulatedPercent = 0;
  const segments = statusItems.map((item, idx) => {
    const fraction = item.count / totalCount;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += fraction;
    const color = statusPalette[item.label] || 'var(--secondary)';
    const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;

    return {
      ...item,
      color,
      strokeDasharray,
      strokeDashoffset,
      percentage: `${pct}%`,
      index: idx
    };
  });

  return (
    <div className="crm-card" style={{ flex: 1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Trophy size={16} color="var(--primary)" />
          <span>Celebrity Status</span>
        </div>
      </div>

      <div className="donut-card-content">
        <div className="donut-visual-wrap">
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="var(--bg-card-alt)"
              strokeWidth={strokeWidth}
            />
            {segments.map((seg) => {
              if (seg.count === 0 && totalCount > 0) return null;
              const isHighlighted = activeSegment === seg.index;
              return (
                <circle
                  key={seg.label}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHighlighted ? strokeWidth + 2 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    opacity: activeSegment !== null && !isHighlighted ? 0.6 : 1
                  }}
                  onMouseEnter={() => setActiveSegment(seg.index)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              );
            })}
          </svg>

          <div className="donut-center-metric">
            <span className="count">{celebrities.length}</span>
            <span className="label">Total</span>
          </div>
        </div>

        <div className="donut-breakdown-list">
          {segments.map((item, idx) => (
            <div
              key={item.label}
              className="donut-breakdown-item"
              onMouseEnter={() => setActiveSegment(idx)}
              onMouseLeave={() => setActiveSegment(null)}
              style={{
                background: activeSegment === idx ? 'var(--bg-hover)' : 'transparent',
                borderRadius: '6px'
              }}
            >
              <div className="breakdown-left">
                <span className="legend-dot" style={{ background: item.color }} />
                <span>{item.label}</span>
              </div>
              <span className="breakdown-right">
                {item.count} ({item.percentage})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
