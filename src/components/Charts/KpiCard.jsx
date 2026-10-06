import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

export default function KpiCard({ 
  value, 
  label, 
  district, 
  year, 
  sublabel, 
  trend,
  isAnomaly,
  status
}) {
  return (
    <div className="glass-card accent-top" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Top Meta Line */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pill pill-cyan" style={{ fontSize: '0.68rem' }}>KEY RESULT</span>
          {isAnomaly && (
            <span className="pill pill-rose" style={{ fontSize: '0.68rem' }}>
              <AlertTriangle size={11} /> ANOMALY
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {year ? `Period: ${year}` : 'Active Query'}
        </span>
      </div>

      {/* Main Metric Value & Entity */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{
          fontSize: '2.8rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #FFFFFF 20%, #00F2FE 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1
        }}>
          {value}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--accent-cyan)'
          }}>
            {district}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {label}
          </span>
        </div>
      </div>

      {/* Supporting context info */}
      <div style={{
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <span>{sublabel || 'Verified query output from Oracle AI Database 26ai'}</span>
        <span className="pill pill-emerald" style={{ fontSize: '0.65rem' }}>
          <CheckCircle size={10} /> GROUNDED
        </span>
      </div>
    </div>
  );
}
