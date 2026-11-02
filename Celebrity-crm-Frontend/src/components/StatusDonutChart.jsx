import React, { useState } from 'react';
import { celebrityStatusData } from '../data/mockData';
import { Trophy } from 'lucide-react';

export default function StatusDonutChart() {
  const [activeSegment, setActiveSegment] = useState(null);

  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const totalCount = celebrityStatusData.reduce((acc, curr) => acc + curr.count, 0);

  // Map each status to our clean 5-colour palette
  const statusPalette = {
    'Active': '#10B981',     // Accent
    'On Hold': '#3B82F6',    // Primary
    'Inactive': '#64748B',   // Secondary
    'Pending': '#94A3B8'     // Muted Secondary
  };

  // Calculate SVG stroke offset for each arc
  let accumulatedPercent = 0;
  const segments = celebrityStatusData.map((item, idx) => {
    const fraction = item.count / totalCount;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += fraction;
    const color = statusPalette[item.label] || 'var(--secondary)';

    return {
      ...item,
      color,
      strokeDasharray,
      strokeDashoffset,
      index: idx
    };
  });

  return (
    <div className="crm-card" style={{ flex: 1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Trophy size={18} color="var(--primary)" />
          <span>Celebrity Status</span>
        </div>
      </div>

      <div className="donut-card-content">
        <div className="donut-visual-wrap">
          <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke="var(--bg-card-alt)"
              strokeWidth={strokeWidth}
            />
            {segments.map((seg) => {
              const isHighlighted = activeSegment === seg.index;
              return (
                <circle
                  key={seg.label}
                  cx="85"
                  cy="85"
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
            <span className="count">{totalCount}</span>
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
