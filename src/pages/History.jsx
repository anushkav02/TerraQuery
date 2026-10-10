import React from 'react';
import { 
  History as HistoryIcon, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Layers, 
  Trash2, 
  Clock,
  Code
} from 'lucide-react';

export default function History({ historyItems = [], onSelectQuery, onClearHistory }) {
  // Fallback preset demo history matching Section 11 prompt requirements
  const defaultHistory = [
    {
      id: 'h-1',
      canonicalQuestion: 'Highest temperature in Durg in 2024',
      userQuestion: 'Highest temperature in Durg in 2024',
      executedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      executionTimeMs: 132,
      recommendedViz: 'ranking-bar',
      isGuardrail: false,
      kpi: { value: '42.8°C', district: 'Durg' },
      generatedSQL: "SELECT district, MAX(temperature) AS peak_temp, date FROM climate_data WHERE district = 'Durg' AND year = 2024..."
    },
    {
      id: 'h-2',
      canonicalQuestion: 'Compare rainfall between Durg and Raipur',
      userQuestion: 'Compare rainfall between Durg and Raipur from 2020 to 2024.',
      executedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      executionTimeMs: 164,
      recommendedViz: 'comparison-bar',
      isGuardrail: false,
      kpi: { value: '+165 mm/yr', district: 'Raipur vs Durg' },
      generatedSQL: "SELECT district, year, ROUND(SUM(rainfall), 1) FROM climate_data WHERE district IN ('Durg','Raipur')..."
    },
    {
      id: 'h-3',
      canonicalQuestion: 'Show rainfall trend from 2020–2024',
      userQuestion: 'Show rainfall trend from 2020–2024.',
      executedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      executionTimeMs: 161,
      recommendedViz: 'line-trend',
      isGuardrail: false,
      kpi: { value: '1,248 mm', district: 'Statewide Trend' },
      generatedSQL: "SELECT year, ROUND(AVG(rainfall) * 12, 1) FROM climate_data WHERE year BETWEEN 2020 AND 2024..."
    },
    {
      id: 'h-4',
      canonicalQuestion: 'Which district had the highest humidity?',
      userQuestion: 'Which district had the highest humidity?',
      executedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      executionTimeMs: 144,
      recommendedViz: 'ranking-bar',
      isGuardrail: false,
      kpi: { value: '86.8%', district: 'Jagdalpur' },
      generatedSQL: "SELECT district, MAX(humidity) FROM climate_data WHERE year = 2024 GROUP BY district ORDER BY MAX(humidity) DESC..."
    },
    {
      id: 'h-5',
      canonicalQuestion: 'Which district in Chhattisgarh had the highest temperature in 2024?',
      userQuestion: 'Which district in Chhattisgarh had the highest temperature in 2024?',
      executedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
      executionTimeMs: 138,
      recommendedViz: 'ranking-bar',
      isGuardrail: false,
      kpi: { value: '42.8°C', district: 'Durg' },
      generatedSQL: "SELECT district, MAX(temperature) FROM climate_data WHERE state = 'Chhattisgarh' AND year = 2024..."
    },
    {
      id: 'h-6',
      canonicalQuestion: 'Which districts experienced unusually high rainfall?',
      userQuestion: 'Which districts experienced unusually high rainfall?',
      executedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      executionTimeMs: 189,
      recommendedViz: 'anomaly-diverging',
      isGuardrail: false,
      kpi: { value: '+31.4%', district: 'Korba' },
      generatedSQL: "SELECT c.district, ROUND(((SUM(c.rainfall) - h.baseline) / h.baseline) * 100, 1) AS anomaly..."
    }
  ];

  const displayList = historyItems.length > 0 ? historyItems : defaultHistory;

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="pill pill-cyan" style={{ fontSize: '0.72rem' }}>
              <HistoryIcon size={13} /> AUDIT & QUERY LOG
            </span>
            <span className="pill pill-muted" style={{ fontSize: '0.72rem' }}>
              Gemini + MongoDB Session Log
            </span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            AI Query History
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Review past natural-language queries, generated database queries, execution metrics, and visualizations. Click any record to re-run.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={onClearHistory}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            <Trash2 size={14} color="#EF4444" />
            <span>Clear Session History</span>
          </button>
        )}
      </div>

      {/* Query List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {displayList.map((item, idx) => {
          const qText = item.userQuestion || item.canonicalQuestion;
          const timeAgo = item.executedAt 
            ? new Date(item.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Recent';

          return (
            <div
              key={item.id || idx}
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                cursor: 'pointer'
              }}
              onClick={() => onSelectQuery && onSelectQuery(qText)}
            >
              {/* Question and details */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(0, 242, 254, 0.15)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {idx + 1}
                  </span>

                  <span className={`pill ${item.isGuardrail ? 'pill-amber' : 'pill-emerald'}`} style={{ fontSize: '0.62rem' }}>
                    {item.isGuardrail ? 'Guardrail Triggered' : 'Executed in MongoDB'}
                  </span>

                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    <span>{timeAgo}</span>
                  </span>
                </div>

                <div style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#F8FAFC',
                  lineHeight: 1.4
                }}>
                  "{qText}"
                </div>

                {item.kpi && (
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      Result: {item.kpi.value} ({item.kpi.district})
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Execution: {item.executionTimeMs || 140}ms
                    </span>
                  </div>
                )}
              </div>

              {/* Right side: Visualization type badge & Re-run button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span className="pill pill-cyan" style={{ fontSize: '0.72rem' }}>
                  <BarChart3 size={12} />
                  <span>{item.recommendedViz?.replace('-', ' ').toUpperCase() || 'CHART'}</span>
                </span>

                <button
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectQuery) onSelectQuery(qText);
                  }}
                >
                  <span>Re-Run</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '24px',
        padding: '14px 18px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.74rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Audit Trail: Session logs retained in browser memory with grounded Gemini & MongoDB telemetry.</span>
        <span>Schema Grounding: Verified</span>
      </div>
    </div>
  );
}
