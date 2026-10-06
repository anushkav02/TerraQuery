import React, { useState } from 'react';

export default function BarChart({ data = [], title, unit = '', isHorizontal = true }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => (typeof d.value === 'number' ? d.value : 0)), 1);

  return (
    <div className="glass-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span className="pill pill-cyan" style={{ fontSize: '0.65rem' }}>RECOMMENDED VISUALIZATION</span>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>{title || 'Metric Ranking'}</h4>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {data.length} Districts Analyzed
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
        {data.map((item, index) => {
          const percentage = Math.min(100, Math.max(8, (item.value / maxValue) * 100));
          const isHighlight = item.isHighlight;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: '95px 1fr 75px',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '6px',
                background: isHovered ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Label */}
              <div style={{
                fontSize: '0.82rem',
                fontWeight: isHighlight ? 700 : 500,
                color: isHighlight ? 'var(--accent-cyan)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {isHighlight && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                )}
                <span>{item.label}</span>
              </div>

              {/* Bar track */}
              <div style={{
                height: '18px',
                background: 'rgba(5, 10, 22, 0.7)',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}>
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: item.color 
                      ? `linear-gradient(90deg, ${item.color}88 0%, ${item.color} 100%)`
                      : 'var(--grad-cyan-teal)',
                    borderRadius: '3px',
                    boxShadow: isHighlight || isHovered ? `0 0 12px ${item.color || '#00F2FE'}` : 'none',
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>

              {/* Value Label */}
              <div style={{
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: isHighlight ? 700 : 500,
                color: isHighlight ? '#FFFFFF' : 'var(--text-secondary)',
                textAlign: 'right'
              }}>
                {item.value} {unit}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '14px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-muted)'
      }}>
        <span>Grounded on Oracle AI Database 26ai CLIMATE_DATA</span>
        <span>Auto-scaled Ranking Bar</span>
      </div>
    </div>
  );
}
