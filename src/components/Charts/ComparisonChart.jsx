import React, { useState } from 'react';

export default function ComparisonChart({ 
  data = [], 
  title, 
  seriesMeta = {
    series1: { name: 'Durg', color: '#00F2FE' },
    series2: { name: 'Raipur', color: '#10B981' }
  } 
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.series1 || 0, d.series2 || 0)), 
    1
  );

  return (
    <div className="glass-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span className="pill pill-cyan" style={{ fontSize: '0.65rem' }}>COMPARISON CHART</span>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>
            {title || 'Side-by-Side Regional Comparison'}
          </h4>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: seriesMeta.series1.color }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{seriesMeta.series1.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: seriesMeta.series2.color }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{seriesMeta.series2.name}</span>
          </div>
        </div>
      </div>

      {/* Grouped Bars Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        gap: '12px',
        padding: '20px 10px 10px',
        borderBottom: '1px solid var(--border-subtle)',
        minHeight: '200px'
      }}>
        {data.map((item, index) => {
          const h1 = Math.round((item.series1 / maxVal) * 160);
          const h2 = Math.round((item.series2 / maxVal) * 160);
          const isHovered = hoveredIdx === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
                cursor: 'pointer'
              }}
            >
              {/* Values floating tooltip on hover */}
              <div style={{
                height: '18px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: isHovered ? '#FFFFFF' : 'transparent',
                transition: 'all 0.15s ease'
              }}>
                {isHovered ? `Δ ${(item.series2 - item.series1)}mm` : ''}
              </div>

              {/* Dual bar group */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '6px',
                height: '160px',
                width: '100%',
                maxWidth: '64px',
                justifyContent: 'center'
              }}>
                {/* Series 1 Bar */}
                <div
                  title={`${seriesMeta.series1.name} (${item.label}): ${item.series1} mm`}
                  style={{
                    width: '45%',
                    height: `${h1}px`,
                    background: `linear-gradient(180deg, ${seriesMeta.series1.color} 0%, rgba(0, 242, 254, 0.4) 100%)`,
                    borderRadius: '4px 4px 0 0',
                    boxShadow: isHovered ? `0 0 10px ${seriesMeta.series1.color}` : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />

                {/* Series 2 Bar */}
                <div
                  title={`${seriesMeta.series2.name} (${item.label}): ${item.series2} mm`}
                  style={{
                    width: '45%',
                    height: `${h2}px`,
                    background: `linear-gradient(180deg, ${seriesMeta.series2.color} 0%, rgba(16, 185, 129, 0.4) 100%)`,
                    borderRadius: '4px 4px 0 0',
                    boxShadow: isHovered ? `0 0 10px ${seriesMeta.series2.color}` : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>

              {/* Year / Category Label */}
              <div style={{
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: isHovered ? 700 : 500,
                color: isHovered ? 'var(--accent-cyan)' : 'var(--text-secondary)'
              }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-muted)'
      }}>
        <span>Oracle AI Database 26ai Aggregation: SUM(rainfall)</span>
        <span>Unit: Millimeters (mm)</span>
      </div>
    </div>
  );
}
