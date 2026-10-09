import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Send, 
  HelpCircle, 
  Database, 
  Code, 
  Copy, 
  Check, 
  AlertCircle, 
  Table as TableIcon,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Compass,
  Sliders,
  ExternalLink
} from 'lucide-react';
//import { aiQueryService } from '../services/aiQueryService.js';
import ExecutionPipeline from '../components/ExecutionPipeline.jsx';
import KpiCard from '../components/Charts/KpiCard.jsx';
import BarChart from '../components/Charts/BarChart.jsx';
import LineTrendChart from '../components/Charts/LineTrendChart.jsx';
import ComparisonChart from '../components/Charts/ComparisonChart.jsx';
import AnomalyDivergingChart from '../components/Charts/AnomalyDivergingChart.jsx';
import ClimateMap from '../components/ClimateMap.jsx';
import ExplainQueryModal from '../components/ExplainQueryModal.jsx';

export default function Dashboard({ onAddHistory, onOpenConfig, onNavigate }) {
  const [queryInput, setQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineState, setPipelineState] = useState({ step: 1, detail: '' });
  const [queryResult, setQueryResult] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Suggested queries chips from prompt requirements
  const SUGGESTED_CHIPS = [
    { label: 'Highest temperature in 2024', q: 'Which district in Chhattisgarh had the highest temperature in 2024?' },
    { label: 'Compare rainfall by district', q: 'Compare rainfall between Durg and Raipur from 2020 to 2024.' },
    { label: 'Compare temp & rainfall (2 regions)', q: 'Compare temperature and rainfall between two regions.' },
    { label: 'Show temperature trend', q: 'Show the temperature trend of Durg over the last 5 years.' },
    { label: '5-year rainfall trend', q: 'Show rainfall trend from 2020–2024.' },
    { label: 'Find rainfall anomalies', q: 'Which districts experienced unusually high rainfall?' },
    { label: 'Highest humidity district', q: 'Which district had the highest humidity?' },
    { label: 'Top 5 by precipitation', q: 'Show me the top 5 districts by precipitation.' },
    { label: 'Monsoon humidity', q: 'What was the average humidity in Chhattisgarh during monsoon?' },
    { label: 'Weather forecast guardrail', q: 'Will it rain tomorrow?' }
  ];

  
 const executeSearch = async (questionToRun) => {
  const q = (questionToRun || queryInput).trim();
  if (!q) return;

  setQueryInput(q);
  setIsProcessing(true);
  setQueryResult(null);

  try {
    // Step 1: Sending question
    setPipelineState({
      step: 1,
      detail: 'Sending your question to Gemini...'
    });

    // Step 2: Gemini generates MongoDB query
    setPipelineState({
      step: 2,
      detail: 'Gemini is generating a MongoDB query...'
    });

    const response = await fetch('http://localhost:5000/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: q
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed: ${response.status}`);
    }

    const data = await response.json();
  
    // Step 3: Validation + database execution
    setPipelineState({
      step: 3,
      detail: 'Validated query. Executing against MongoDB Atlas...'
    });

    // Step 4: Results
    setPipelineState({
      step: 4,
      detail: 'Real IMD rainfall data retrieved successfully.'
    });

    if (!data.success) {
      throw new Error(data.error || 'Query failed.');
    }

    const records = data.result?.records || [];

    // Adapt the real backend response to the existing dashboard UI.
    const firstRecord = records[0] || {};

    const result = {
      question: q,

      // Backend information
      ai: data.ai,
      database: data.database,
      generatedQuery: data.query,
      visualization: data.visualization,
      validation: data.validation,

      // Result information
      tableData: records,
      records,
      resultCount: data.result?.count || 0,

      // Dashboard display
      kpi: firstRecord['Daily Actual'] !== undefined
        ? {
            value: `${firstRecord['Daily Actual']} mm`,
            label: 'Highest Daily Rainfall',
            district: firstRecord.District,
            year: firstRecord.Date?.slice(0, 4),
            sublabel: `${firstRecord.State || ''} • ${firstRecord.Date || ''}`
          }
        : null,

          explanation: data.explanation || (
  records.length
    ? `The query returned ${records.length} record${records.length === 1 ? '' : 's'} from the real IMD rainfall dataset stored in MongoDB Atlas.`
    : 'No matching rainfall records were found.'
),

      connectionModeText: 'LIVE GEMINI + MONGODB ATLAS',
      executionTimeMs: null,
      rowsExamined: data.result?.count || 0,

      // Keep existing visualization area from crashing.
      recommendedViz: records.length > 1 ? 'comparison-bar' : records.length > 0 ? 'ranking-bar' : null,

chartData: records.length > 1
  ? records.map((record, index) => ({
      label:
        record.District ??
        record.district ??
        record._id ??
        record.label ??
        'Unknown',

      value: Number(
  record[data.visualization?.metric] ??
  record.avgDailyActual ??
  record['Daily Actual'] ??
  record.value ??
  0
),

      isHighlight: index === 0
    }))
  : records
      .filter(
        (record) =>
          typeof record['Daily Actual'] === 'number'
      )
      .map((record, index) => ({
        label:
          record.District ??
          record.district ??
          record._id ??
          'Unknown',

        value: record['Daily Actual'],

        isHighlight: index === 0
      })),

      vizTitle: data.visualization?.title ||
  (records.length > 1
    ? 'Rainfall Comparison'
    : 'Daily Rainfall Ranking'),
      parameter: 'rainfall',
      activeDistrict: firstRecord.District || 'DURG',
      mapMode: 'rainfall',

      // Used by the existing query display section.
      generatedSQL: JSON.stringify(data.query, null, 2)
    };
   
    setQueryResult(result);

    if (onAddHistory) {
      onAddHistory(result);
    }

  } catch (err) {
    console.error('Execution error:', err);

    setQueryResult({
      question: q,
      isGuardrail: true,
      message: 'Unable to process this query.',
      suggestion: err.message || 'Please try another rainfall or climate question.'
    });

  } finally {
    setIsProcessing(false);
  }
};

  const handleCopySQL = (sql) => {
    if (!sql) return;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDistrictMapSelect = (districtName) => {
    executeSearch(`Show the temperature and climate metrics for ${districtName} in 2024`);
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        padding: '50px 0 30px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Oracle Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="pill pill-cyan" style={{ fontSize: '0.72rem', padding: '4px 14px' }}>
              <Sparkles size={12} /> GEMINI + MONGODB ATLAS
            </span>
            <span className="pill pill-muted" style={{ fontSize: '0.72rem' }}>
              MONGODB ATLAS
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '14px',
            background: 'linear-gradient(135deg, #FFFFFF 40%, #00F2FE 80%, #38BDF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.15
          }}>
            Ask Earth Data Anything.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 32px',
            lineHeight: 1.5
          }}>
            Turn natural-language questions into trusted climate insights — without writing SQL.
          </p>

          {/* Large AI Query Input Box */}
          <div style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            padding: '8px 12px 8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-card), 0 0 35px rgba(0, 242, 254, 0.15)',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}>
            <Search size={22} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
            
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') executeSearch();
              }}
              placeholder="Ask a question about temperature, rainfall, humidity or precipitation..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'var(--font-main)',
                outline: 'none',
                padding: '10px 0'
              }}
            />

            <button
              onClick={() => executeSearch()}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                flexShrink: 0,
                fontSize: '0.92rem'
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Ask TerraQuery</span>
                </>
              )}
            </button>
          </div>

          {/* Clickable Suggested Queries Chips */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginRight: '4px' }}>
              Suggested:
            </span>
            {SUGGESTED_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => executeSearch(chip.q)}
                style={{
                  background: 'rgba(12, 24, 48, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 14px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.background = 'rgba(0, 242, 254, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'rgba(12, 24, 48, 0.6)';
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Section 25 Required CTAs */}
          <div style={{
            marginTop: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => onNavigate && onNavigate('explore')}
              className="btn btn-outline"
              style={{
                fontSize: '0.85rem',
                padding: '9px 20px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Compass size={15} color="var(--accent-cyan)" />
              <span>Explore Climate Data</span>
            </button>

            <button
              onClick={() => {
                const searchInput = document.querySelector('input[type="text"]');
                if (searchInput) {
                  searchInput.focus();
                  searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="btn btn-ghost"
              style={{
                fontSize: '0.85rem',
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={15} />
              <span>Try AI Query</span>
            </button>
          </div>

          {/* Section 25 Powered By Banner */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            flexWrap: 'wrap'
          }}>
            <span>Powered by:</span>
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>MONGODB ATLAS</span>
            <span style={{ color: 'var(--accent-cyan)' }}>•</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Google Gemini</span>
            <span style={{ color: 'var(--accent-cyan)' }}>•</span>
            <span style={{ color: '#94A3B8' }}>LLM-powered Natural Language Analytics</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container">
        {/* Animated Processing State */}
        {isProcessing && (
          <ExecutionPipeline 
            currentStep={pipelineState.step} 
            currentDetail={pipelineState.detail} 
          />
        )}

        {/* Guardrail or Limitation Response State */}
        {!isProcessing && queryResult && queryResult.isGuardrail && (
          <div className="glass-card" style={{
            padding: '32px',
            margin: '24px 0',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            background: 'rgba(20, 16, 10, 0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertCircle size={24} color="#F59E0B" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="pill pill-amber" style={{ fontSize: '0.7rem' }}>
                    SCOPE GUARDRAIL
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Query: "{queryResult.question}"
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '10px 0 6px', color: '#F8FAFC' }}>
                  {queryResult.message}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {queryResult.suggestion}
                </p>

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => executeSearch('Which district had the highest rainfall?')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.82rem' }}
                  >
                    Run Sample Demo Query
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Normal Successful Result View */}
        {!isProcessing && queryResult && !queryResult.isGuardrail && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Bar: Execution Summary & Explain Query Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(10, 18, 38, 0.7)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span className="pill pill-cyan" style={{ fontSize: '0.7rem' }}>
                  QUERY RESOLVED
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Execution Time: <strong style={{ color: '#F8FAFC' }}>{queryResult.executionTimeMs}ms</strong>
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>|</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Rows Examined: <strong style={{ color: '#F8FAFC' }}>{queryResult.rowsExamined?.toLocaleString()}</strong>
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>|</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
                  {queryResult.connectionModeText}
                </span>
              </div>

              <button
                onClick={() => setExplainModalOpen(true)}
                className="btn btn-outline"
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                <HelpCircle size={15} color="var(--accent-cyan)" />
                <span>Explain Query & Grounding</span>
              </button>
            </div>

            {/* Grid: Key Result Card + AI Insight */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {/* Card 1: Key Answer KPI Card */}
              {queryResult.kpi && (
                <KpiCard
                  value={queryResult.kpi.value}
                  label={queryResult.kpi.label}
                  district={queryResult.kpi.district}
                  year={queryResult.kpi.year}
                  sublabel={queryResult.kpi.sublabel}
                  isAnomaly={queryResult.intent === 'ANOMALY_DETECTION'}
                />
              )}

              {/* Card 2: AI Grounded Explanation */}
              <div className="glass-card accent-top-emerald" style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="pill pill-emerald" style={{ fontSize: '0.68rem' }}>AI INSIGHT</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Google Gemini Natural-Language Synthesis
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.96rem',
                    color: '#E2E8F0',
                    lineHeight: 1.65
                  }}>
                    {queryResult.explanation}
                  </p>
                </div>

                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>Context: MONGODB ATLAS Climate Catalog</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Zero Hallucination</span>
                </div>
              </div>
            </div>

            {/* Grid: Dynamic Chart + Interactive Climate Map */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '24px',
              minHeight: '400px'
            }}>
             {/* Smart Selected Visualization */}
<div>
  {queryResult.visualization?.type === 'map_highlight' && (
    <div
      style={{
        padding: '20px',
        borderRadius: '14px',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(34, 211, 238, 0.2)',
        color: '#e2e8f0'
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1px',
          color: '#67e8f9',
          marginBottom: '8px'
        }}
      >
        CLIMATE HIGHLIGHT
      </div>

      <h3 style={{ margin: '0 0 12px' }}>
        {queryResult.visualization.title}
      </h3>

      {queryResult.kpi && (
        <>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '4px'
            }}
          >
            {queryResult.kpi.value}
          </div>

          <div
            style={{
              fontSize: '15px',
              color: '#cbd5e1'
            }}
          >
            {queryResult.kpi.district}
          </div>

          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginTop: '4px'
            }}
          >
            {queryResult.kpi.sublabel}
          </div>
        </>
      )}
    </div>
  )}

  {queryResult.visualization?.type === 'ranking_bar' && (
    <BarChart 
      data={queryResult.chartData} 
      title={queryResult.vizTitle} 
      unit={queryResult.visualization.unit || 'mm'}
    />
  )}

  {queryResult.visualization?.type === 'comparison_bar' && (
    <ComparisonChart 
      data={queryResult.chartData} 
      title={queryResult.vizTitle}
      seriesMeta={queryResult.seriesMeta}
    />
  )}

  {queryResult.visualization?.type === 'line_trend' && (
    <LineTrendChart 
      data={queryResult.chartData} 
      title={queryResult.vizTitle} 
    />
  )}

  {queryResult.visualization?.type === 'anomaly_diverging' && (
    <AnomalyDivergingChart 
      data={queryResult.chartData} 
      title={queryResult.vizTitle} 
    />
  )}
</div>

              {/* Geographic Climate Cartogram Map */}
              <div>
                <ClimateMap  highlightDistrict={queryResult?.records?.[0]?.District || null}
                  activeDistrict={queryResult.activeDistrict || 'Durg'}
                  mapMode={queryResult.mapMode || 'temperature'}
                  onSelectDistrict={handleDistrictMapSelect}
                />
              </div>
            </div>

            {/* Supporting Data Table */}
            {queryResult.tableData && queryResult.tableData.length > 0 && (
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TableIcon size={18} color="var(--accent-cyan)" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Supporting Climate Observation Table</h4>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {queryResult.tableData.length} Records Retrieved from MongoDB Atlas
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem',
                    textAlign: 'left'
                  }}>
                    <thead>
                      <tr style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem'
                      }}>
                        {Object.keys(queryResult.tableData[0]).map((key) => (
                          <th key={key} style={{ padding: '10px 14px', textTransform: 'uppercase' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.tableData.map((row, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          {Object.values(row).map((val, j) => (
                            <td key={j} style={{
                              padding: '12px 14px',
                              color: j === 1 || j === 2 ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontWeight: j === 1 ? 600 : 400
                            }}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Generated SQL Transparency Inspector Box */}
            <div className="glass-card" style={{
              padding: '24px',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              background: 'rgba(5, 10, 24, 0.9)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Code size={18} color="var(--accent-cyan)" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="pill pill-cyan" style={{ fontSize: '0.65rem' }}>AI-GENERATED QUERY</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>
                        Executed against MONGODB ATLAS
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Generated via Google Gemini • Validated as read-only before execution
                    </p>
                  </div>   
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleCopySQL(queryResult.generatedSQL)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.76rem', padding: '5px 12px' }}
                  >
                    {copiedSql ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                    <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                  </button>

                  <button
                    onClick={() => setExplainModalOpen(true)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.76rem', padding: '5px 12px' }}
                  >
                    <HelpCircle size={13} />
                    <span>Explain Lineage</span>
                  </button>
                </div>
              </div>

              {/* Code block */}
              <pre className="code-block" style={{ margin: 0, fontSize: '0.82rem', color: '#38BDF8' }}>
                {queryResult.generatedSQL}
              </pre>

              {/* Security & Grounding note */}
              <div style={{
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.74rem',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="led-indicator led-emerald" />
                  <span>Security Note: AI-generated queries are validated and executed using restricted read-only permissions.</span>
                </div>
                <span>Collection: terraquery.rainfall</span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Explain Query Modal */}
      <ExplainQueryModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        queryResult={queryResult}
      />
    </div>
  );
}
