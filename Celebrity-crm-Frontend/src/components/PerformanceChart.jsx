import React, { useState } from 'react';
import { monthlyPerformanceData } from '../data/mockData';
import { BarChart3 } from 'lucide-react';

export default function PerformanceChart() {
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [hoveredGroup, setHoveredGroup] = useState(null);

  // SVG dimensions
  const svgWidth = 560;
  const svgHeight = 200;
  const paddingLeft = 32;
  const paddingBottom = 28;
  const paddingTop = 15;
  const graphWidth = svgWidth - paddingLeft - 20;
  const graphHeight = svgHeight - paddingBottom - paddingTop;
  const maxValue = 10;

  const groupWidth = graphWidth / monthlyPerformanceData.length;
  const barWidth = 10;
  const barGap = 3;

  return (
    <div className="crm-card" style={{ flex: 1 }}>
      <div className="analytics-card-header">
        <div className="analytics-card-title">
          <BarChart3 size={18} color="var(--primary)" />
          <span>Campaign Performance</span>
        </div>
        <select
          className="time-select-dropdown"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="Last 6 Months">Last 6 Months</option>
          <option value="Last 3 Months">Last 3 Months</option>
          <option value="This Year">This Year (2026)</option>
        </select>
      </div>

      <div className="chart-content-area">
        <div className="chart-legend-row">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#10B981' }} />
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#3B82F6' }} />
            <span>Ongoing</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#8B5CF6' }} />
            <span>Planned</span>
          </div>
        </div>

        <div className="svg-chart-container" style={{ position: 'relative' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradOngoing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="gradPlanned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 2, 4, 6, 8, 10].map((val) => {
              const y = paddingTop + graphHeight - (val / maxValue) * graphHeight;
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - 10}
                    y2={y}
                    stroke="var(--border-subtle)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    fill="var(--text-dim)"
                    fontSize="10"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Bars for each month */}
            {monthlyPerformanceData.map((d, index) => {
              const groupCenterX = paddingLeft + index * groupWidth + groupWidth / 2;
              const completedH = (d.completed / maxValue) * graphHeight;
              const ongoingH = (d.ongoing / maxValue) * graphHeight;
              const plannedH = (d.planned / maxValue) * graphHeight;

              const totalGroupBarsWidth = barWidth * 3 + barGap * 2;
              const startX = groupCenterX - totalGroupBarsWidth / 2;

              const isHovered = hoveredGroup === index;

              return (
                <g
                  key={d.month}
                  onMouseEnter={() => setHoveredGroup(index)}
                  onMouseLeave={() => setHoveredGroup(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Subtle highlight column on hover */}
                  {isHovered && (
                    <rect
                      x={groupCenterX - groupWidth / 2 + 4}
                      y={paddingTop}
                      width={groupWidth - 8}
                      height={graphHeight}
                      fill="var(--bg-hover)"
                      rx="6"
                    />
                  )}

                  {/* Completed Bar */}
                  <rect
                    x={startX}
                    y={paddingTop + graphHeight - completedH}
                    width={barWidth}
                    height={completedH}
                    fill="url(#gradCompleted)"
                    rx="3"
                  />

                  {/* Ongoing Bar */}
                  <rect
                    x={startX + barWidth + barGap}
                    y={paddingTop + graphHeight - ongoingH}
                    width={barWidth}
                    height={ongoingH}
                    fill="url(#gradOngoing)"
                    rx="3"
                  />

                  {/* Planned Bar */}
                  <rect
                    x={startX + (barWidth + barGap) * 2}
                    y={paddingTop + graphHeight - plannedH}
                    width={barWidth}
                    height={plannedH}
                    fill="url(#gradPlanned)"
                    rx="3"
                  />

                  {/* Month Label */}
                  <text
                    x={groupCenterX}
                    y={svgHeight - 8}
                    fill={isHovered ? 'var(--primary)' : 'var(--text-muted)'}
                    fontSize="11"
                    fontWeight={isHovered ? '700' : '500'}
                    textAnchor="middle"
                  >
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip card */}
          {hoveredGroup !== null && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: `${(hoveredGroup / (monthlyPerformanceData.length - 1)) * 65 + 10}%`,
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '6px 12px',
                boxShadow: 'var(--shadow-md)',
                fontSize: '0.72rem',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 10
              }}
            >
              <strong style={{ color: 'var(--text-main)' }}>
                {monthlyPerformanceData[hoveredGroup].month} 2025
              </strong>
              <div style={{ color: '#10B981' }}>
                Completed: {monthlyPerformanceData[hoveredGroup].completed}
              </div>
              <div style={{ color: '#3B82F6' }}>
                Ongoing: {monthlyPerformanceData[hoveredGroup].ongoing}
              </div>
              <div style={{ color: '#8B5CF6' }}>
                Planned: {monthlyPerformanceData[hoveredGroup].planned}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

