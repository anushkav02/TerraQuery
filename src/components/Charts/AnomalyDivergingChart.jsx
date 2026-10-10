import React from 'react';
import { AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

export default function AnomalyDivergingChart({ data = [], title }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span className="pill pill-rose" style={{ fontSize: '0.65rem' }}>
            <AlertTriangle size={11} /> STATISTICAL ANOMALIES
          </span>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>
            {title || 'Precipitation Deviation from 4-Year Baseline'}
          </h4>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
          &gt; +15% Threshold
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        {data.map((item, index) => {
          const isExtreme = item.value >= 25;
          const isHigh = item.value >= 20 && item.value < 25;

          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
                  <span className={`pill ${isExtreme ? 'pill-rose' : (isHigh ? 'pill-amber' : 'pill-cyan')}`} style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                    {isExtreme ? 'Critical Excess' : (isHigh ? 'High Departure' : 'Moderate')}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: isExtreme ? '#EF4444' : (isHigh ? '#F97316' : '#38BDF8')
                }}>
                  +{item.value}%
                </span>
              </div>

              {/* Anomaly Bar */}
              <div style={{
                height: '14px',
                background: 'rgba(5, 10, 22, 0.7)',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (item.value / 35) * 100)}%`,
                  background: item.color || '#EF4444',
                  boxShadow: `0 0 10px ${item.color || '#EF4444'}`,
                  borderRadius: '3px',
                  transition: 'width 0.5s ease'
                }} />
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
        <span>Historical Baseline: 2020–2023 Mean</span>
        <span>Climate Baseline Anomaly Scoring Engine</span>
      </div>
    </div>
  );
}
