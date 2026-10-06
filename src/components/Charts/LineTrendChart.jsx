import React, { useState } from 'react';

export default function LineTrendChart({ data = [], title }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) return null;

  // ViewBox: 0 0 500 240
  const width = 500;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  const values = data.map((d) => d.value);
  const minVal = Math.floor(Math.min(...values, ...data.map((d) => d.min || d.value)) - 2);
  const maxVal = Math.ceil(Math.max(...values, ...data.map((d) => d.peak || d.value)) + 2);

  const getX = (idx) => {
    return padding.left + (idx / (data.length - 1)) * (width - padding.left - padding.right);
  };

  const getY = (val) => {
    return height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);
  };

  // Build SVG path string
  const mainPoints = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const linePath = `M ${mainPoints.join(' L ')}`;

  // Area under path
  const areaPath = `${linePath} L ${getX(data.length - 1)},${height - padding.bottom} L ${getX(0)},${height - padding.bottom} Z`;

  return (
    <div className="glass-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span className="pill pill-cyan" style={{ fontSize: '0.65rem' }}>TIME-SERIES LINE CHART</span>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>{title || 'Temporal Trend Profile'}</h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pill pill-rose" style={{ fontSize: '0.68rem' }}>
            +0.32°C / year trend
          </span>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#00F2FE" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - padding.bottom - pct * (height - padding.top - padding.bottom);
            const val = (minVal + pct * (maxVal - minVal)).toFixed(1);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="10px"
                  fontFamily="var(--font-mono)"
                >
                  {val}°C
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaPath} fill="url(#trendGradient)" />

          {/* Trendline Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.5))' }}
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.value);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Year Label */}
                <text
                  x={cx}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fill={isHovered ? '#00F2FE' : '#94A3B8'}
                  fontSize="11px"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="var(--font-mono)"
                >
                  {d.label}
                </text>

                {/* Point circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 5}
                  fill="#050813"
                  stroke="#00F2FE"
                  strokeWidth="2.5"
                  style={{
                    cursor: 'pointer',
                    filter: isHovered ? 'drop-shadow(0 0 8px #00F2FE)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Value tooltip tag */}
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  fill={isHovered ? '#FFFFFF' : '#38BDF8'}
                  fontSize={isHovered ? '12px' : '10px'}
                  fontWeight={isHovered ? '700' : '600'}
                  fontFamily="var(--font-mono)"
                >
                  {d.value}°C
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-muted)'
      }}>
        <span>Oracle AI Database 26ai Linear Regressive Smoothing</span>
        <span>Confidence Interval: 95%</span>
      </div>
    </div>
  );
}
