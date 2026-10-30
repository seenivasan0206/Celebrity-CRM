import React, { useState } from 'react';
import { celebrityStatusData } from '../data/mockData';
import { Trophy } from 'lucide-react';

export default function StatusDonutChart() {
  const [activeSegment, setActiveSegment] = useState(null);

  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const totalCount = celebrityStatusData.reduce((acc, curr) => acc + curr.count, 0);

  // Calculate SVG stroke offset for each arc
  let accumulatedPercent = 0;
  const segments = celebrityStatusData.map((item, idx) => {
    const fraction = item.count / totalCount;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += fraction;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      index: idx
    };
  });

  return (
    <div className="crm-card" style={{ flex: 1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <Trophy size={18} color="var(--accent-amber)" />
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
                  strokeWidth={isHighlighted ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    filter: isHighlighted ? `drop-shadow(0 0 8px ${seg.color})` : 'none'
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
          {celebrityStatusData.map((item, idx) => (
            <div
              key={item.label}
              className="donut-breakdown-item"
              onMouseEnter={() => setActiveSegment(idx)}
              onMouseLeave={() => setActiveSegment(null)}
              style={{
                background: activeSegment === idx ? 'var(--bg-hover)' : 'transparent',
                borderRadius: '8px'
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

