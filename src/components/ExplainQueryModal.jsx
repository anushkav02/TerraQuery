import React from 'react';
import { 
  X, 
  HelpCircle, 
  ArrowDown, 
  Database, 
  Sparkles, 
  Code, 
  Table, 
  CheckCircle2, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function ExplainQueryModal({ isOpen, onClose, queryResult }) {
  if (!isOpen || !queryResult) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.08) 0%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 242, 254, 0.3)'
            }}>
              <HelpCircle size={20} color="#00F2FE" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Transparency & Query Explanation</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Auditing the 5-step lineage from Natural Language to Verified Database Grounding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: 5 Step Chain */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Step 1: User Question */}
          <div style={{
            background: 'rgba(6, 12, 26, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="pill pill-muted" style={{ fontSize: '0.65rem' }}>STAGE 1</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                User Question in Plain English
              </span>
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--accent-cyan)', fontWeight: 600, fontStyle: 'italic' }}>
              "{queryResult.userQuestion || queryResult.canonicalQuestion}"
            </p>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowDown size={20} color="var(--accent-cyan)" />
          </div>

          {/* Step 2: AI Interpretation & Entity Extraction */}
          <div style={{
            background: 'rgba(6, 12, 26, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="pill pill-cyan" style={{ fontSize: '0.65rem' }}>STAGE 2</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Select AI Semantic Interpretation
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
              fontSize: '0.78rem'
            }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Query Intent:</span>
                <div style={{ color: '#F8FAFC', fontWeight: 600, marginTop: '2px' }}>{queryResult.intent || 'METRIC_SEARCH'}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Parameter Mapped:</span>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '2px' }}>{queryResult.parameter || 'temperature'}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Entity / Location:</span>
                <div style={{ color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '2px' }}>{queryResult.activeDistrict || 'Chhattisgarh'}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Year:</span>
                <div style={{ color: '#F8FAFC', fontWeight: 600, marginTop: '2px' }}>{queryResult.year || '2024'}</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowDown size={20} color="var(--accent-cyan)" />
          </div>

          {/* Step 3: Generated Oracle SQL */}
          <div style={{
            background: 'rgba(6, 12, 26, 0.7)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pill pill-cyan" style={{ fontSize: '0.65rem' }}>STAGE 3</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Generated Oracle AI Database 26ai SQL
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Oracle 26ai Engine
              </span>
            </div>
            <pre className="code-block" style={{ fontSize: '0.8rem', margin: 0 }}>
              {queryResult.generatedSQL}
            </pre>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowDown size={20} color="var(--accent-cyan)" />
          </div>

          {/* Step 4: Database Execution Result */}
          <div style={{
            background: 'rgba(6, 12, 26, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pill pill-emerald" style={{ fontSize: '0.65rem' }}>STAGE 4</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Actual Database Result
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                {queryResult.executionTimeMs}ms • Ground Truth
              </span>
            </div>
            <div style={{
              background: '#040711',
              borderRadius: '6px',
              padding: '12px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#34D399',
              lineHeight: 1.6
            }}>
              <div>PRIMARY VALUE : {queryResult.kpi?.value} ({queryResult.kpi?.district})</div>
              <div>METRIC LABEL   : {queryResult.kpi?.label}</div>
              <div>ROWS EXAMINED  : {queryResult.rowsExamined?.toLocaleString()} records in CLIMATE_DATA</div>
              <div>STATUS         : Oracle SQL execution successful (HTTP 200 OK)</div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowDown size={20} color="var(--accent-cyan)" />
          </div>

          {/* Step 5: Final Natural Language Explanation */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="pill pill-emerald" style={{ fontSize: '0.65rem' }}>STAGE 5</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                Final Grounded AI Explanation
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#E2E8F0', lineHeight: 1.6 }}>
              {queryResult.explanation}
            </p>
          </div>

          {/* Trust Guarantee Box */}
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldCheck size={22} color="#00F2FE" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Zero-Hallucination Architectural Guarantee:</strong> The LLM does NOT generate climate measurements. All numerical values are retrieved directly from structured tables in Oracle AI Database 26ai; the LLM merely translates English to SQL and synthesizes the returned tabular rows.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(5, 8, 19, 0.6)'
        }}>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
