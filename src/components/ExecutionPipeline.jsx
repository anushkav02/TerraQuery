import React from 'react';
import { 
  BrainCircuit, 
  Code, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

export default function ExecutionPipeline({ currentStep = 1, currentDetail = '' }) {
  const steps = [
    { num: 1, title: 'Understanding question...', icon: BrainCircuit },
    { num: 2, title: 'Generating database query...', icon: Code },
    { num: 3, title: 'Querying climate dataset...', icon: Database },
    { num: 4, title: 'Analyzing result...', icon: Sparkles }
  ];

  return (
    <div className="glass-card accent-top" style={{
      padding: '24px',
      margin: '24px 0',
      background: 'rgba(8, 15, 34, 0.95)',
      boxShadow: '0 12px 35px rgba(0, 242, 254, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="led-indicator led-cyan" />
          <span style={{
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)'
          }}>
            Gemini & MongoDB Query Pipeline Execution
          </span>
        </div>
        <span className="pill pill-cyan" style={{ fontSize: '0.68rem' }}>
          LIVE AGENTIC FLOW
        </span>
      </div>

      {/* 4 Pipeline Steps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {steps.map((st) => {
          const Icon = st.icon;
          const isDone = currentStep > st.num;
          const isCurrent = currentStep === st.num;
          const isPending = currentStep < st.num;

          return (
            <div
              key={st.num}
              style={{
                background: isCurrent 
                  ? 'rgba(0, 242, 254, 0.12)' 
                  : (isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(5, 10, 22, 0.6)'),
                border: isCurrent 
                  ? '1px solid var(--accent-cyan)' 
                  : (isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'),
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                boxShadow: isCurrent ? '0 0 20px rgba(0, 242, 254, 0.25)' : 'none'
              }}
            >
              {/* Icon badge */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: isCurrent 
                  ? 'rgba(0, 242, 254, 0.25)' 
                  : (isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)'),
                color: isCurrent 
                  ? 'var(--accent-cyan)' 
                  : (isDone ? 'var(--accent-emerald)' : 'var(--text-muted)')
              }}>
                {isDone ? (
                  <CheckCircle2 size={20} color="#10B981" />
                ) : isCurrent ? (
                  <Loader2 size={20} color="#00F2FE" className="animate-spin" />
                ) : (
                  <Icon size={18} />
                )}
              </div>

              {/* Step info */}
              <div>
                <div style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: isCurrent ? 'var(--accent-cyan)' : (isDone ? 'var(--accent-emerald)' : 'var(--text-muted)'),
                  fontWeight: 600
                }}>
                  STEP {st.num}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? '#FFFFFF' : (isDone ? '#E2E8F0' : 'var(--text-muted)'),
                  marginTop: '2px'
                }}>
                  {st.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time status ticker */}
      {currentDetail && (
        <div style={{
          marginTop: '16px',
          padding: '10px 14px',
          borderRadius: '6px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="shimmer-bg" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%' }} />
          <span>{currentDetail}</span>
        </div>
      )}
    </div>
  );
}
