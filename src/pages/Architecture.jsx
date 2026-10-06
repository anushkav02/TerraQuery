import React, { useState } from 'react';
import { 
  Layers, 
  ArrowDown, 
  User, 
  Layout, 
  Server, 
  Database, 
  Cpu, 
  Sparkles, 
  Code, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2,
  Terminal,
  HelpCircle
} from 'lucide-react';

export default function Architecture() {
  const [selectedNode, setSelectedNode] = useState('select-ai');

  const ARCHITECTURE_NODES = [
    {
      id: 'user',
      title: '1. USER',
      badge: 'NON-TECHNICAL ANALYST',
      subtitle: 'Researchers, Disaster Teams, Policy Makers',
      icon: User,
      color: '#38BDF8',
      description: 'The end-user interacts exclusively using natural English questions (e.g., "Which district in Chhattisgarh had the highest temperature in 2024?"). No SQL or database engineering knowledge is required.',
      details: [
        'Zero SQL syntax learning curve',
        'Mobile, desktop, and API conversational client interfaces',
        'Automatic intent translation into actionable analytics'
      ]
    },
    {
      id: 'dashboard',
      title: '2. WEB DASHBOARD',
      badge: 'FRONTEND INTERFACE',
      subtitle: 'React + Modern Climate-Tech Design System',
      icon: Layout,
      color: '#00F2FE',
      description: 'Provides query suggestions, live execution pipeline animations, geographic SVG climate maps, interactive charts, and an AI transparency lineage modal.',
      details: [
        'Adaptive visualization selection (KPI, Bar, Line, Anomaly)',
        'Interactive Chhattisgarh district GIS cartogram',
        'Explain Query audit trail inspects full execution lineage'
      ]
    },
    {
      id: 'backend',
      title: '3. BACKEND / API LAYER',
      badge: 'ORCHESTRATION & SECURITY',
      subtitle: 'FastAPI / Node.js Microservice Gateway',
      icon: Server,
      color: '#60A5FA',
      description: 'Handles rate limiting, request validation, air-gapped credential protection, and delegates queries to the Oracle AI Database 26ai Select AI layer.',
      details: [
        'Sanitizes user input to prevent prompt injection',
        'Keeps database credentials sealed in secure server vault',
        'Provides WebSocket / SSE progress streams during query translation'
      ]
    },
    {
      id: 'oracle-db',
      title: '4. ORACLE AI DATABASE 26ai',
      badge: 'CORE DATA PLATFORM',
      subtitle: 'Enterprise Autonomous Database 26ai',
      icon: Database,
      color: '#00F2FE',
      description: 'Houses the structured climate observation tables, autonomous indexing, in-memory columnar store, and native AI capabilities.',
      details: [
        'Contains 125,000+ indexed observations in CLIMATE_DATA table',
        'Hybrid Columnar Compression (HCC) for high throughput',
        'Role-Based Access Control enforcing read-only permissions'
      ]
    },
    {
      id: 'select-ai',
      title: '5. SELECT AI (DBMS_CLOUD_AI)',
      badge: 'PROPRIETARY ORACLE AI LAYER',
      subtitle: 'Native In-Database Natural Language Engine',
      icon: Cpu,
      color: '#A78BFA',
      description: 'Oracle 26ai\'s native feature that bridges relational schemas with Large Language Models. Transforms natural language prompts directly into validated SQL inside database boundaries.',
      details: [
        'Package: DBMS_CLOUD_AI',
        'Eliminates custom middleware SQL translators',
        'Enforces schema catalog grounding so the model sees table structure'
      ]
    },
    {
      id: 'ai-profile',
      title: '6. AI PROFILE & METADATA BINDINGS',
      badge: 'ORACLE AI PROFILE',
      subtitle: 'DBMS_CLOUD_AI.CREATE_PROFILE Configuration',
      icon: Sparkles,
      color: '#C084FC',
      description: 'Configures provider credentials, schema context, and target database objects. Defines exactly which tables (e.g. CLIMATE_DATA) the AI can access.',
      details: [
        'Profile Name: CLIMATE_SELECT_AI_V2',
        'Scoped strictly to CLIMATE_ADMIN.CLIMATE_DATA catalog',
        'System metadata, sensitive tables, and DDL commands blocked'
      ]
    },
    {
      id: 'llm',
      title: '7. LLM / OCI GENERATIVE AI',
      badge: 'FOUNDATION MODEL',
      subtitle: 'OCI GenAI (Cohere Command R+ / OpenAI / Azure)',
      icon: Cpu,
      color: '#F472B6',
      description: 'Translates natural language questions into strict Oracle SQL syntax using table DDL schemas provided by the AI Profile. Crucially, the LLM does NOT invent climate numbers.',
      details: [
        'Translates English to SQL syntax only',
        'Receives schema DDL context, NOT arbitrary training guesses',
        'Returns executable SQL queries back to Oracle SQL Engine'
      ]
    },
    {
      id: 'sql-engine',
      title: '8. ORACLE SQL EXECUTION ENGINE',
      badge: 'GROUND TRUTH COMPUTE',
      subtitle: 'Deterministic Relational Analytics',
      icon: Code,
      color: '#10B981',
      description: 'Executes the validated SQL query on the structured climate dataset under ROLE_CLIMATE_ANALYTICS_RO with zero DDL or write permissions.',
      details: [
        'Deterministic execution produces verifiable mathematical outputs',
        'Fast index scans and vectorized aggregations in milliseconds',
        'Returns pure tabular rows: District, Temperature, Rainfall, Date'
      ]
    },
    {
      id: 'climate-dataset',
      title: '9. STRUCTURED CLIMATE DATASET',
      badge: 'GROUND TRUTH STORAGE',
      subtitle: '125,000+ Observations across Chhattisgarh & India',
      icon: Database,
      color: '#34D399',
      description: 'The physical database table storing temperature, rainfall, humidity, wind, and pressure records from 2020 through 2024. All numbers shown to the user originate here.',
      details: [
        'Columns: id, date, district, state, temp, rain, hum, wind, press',
        'Strict constraints and foreign key integrity',
        'Partitioned by year and sub-divided by district'
      ]
    },
    {
      id: 'analytics',
      title: '10. ANALYTICS & ANOMALY DETECTION',
      badge: 'POST-PROCESSING INTELLIGENCE',
      subtitle: 'Baseline Departures & Trend Regressions',
      icon: BarChart3,
      color: '#F59E0B',
      description: 'Calculates percentage departures from historical baselines, standard deviations, and multi-year warming trend slopes before rendering.',
      details: [
        'Identifies anomalies like Korba +31.4% precipitation surplus',
        'Computes multi-year linear warming rate (+0.32°C/year in Durg)',
        'Scores severity as normal, elevated, or critical excess'
      ]
    },
    {
      id: 'visualization',
      title: '11. AUTOMATIC VISUALIZATION ENGINE',
      badge: 'SMART VISUALIZATION',
      subtitle: 'Adaptive Chart & Map Selection',
      icon: Layout,
      color: '#38BDF8',
      description: 'Selects the optimal visual representation based on query semantics (e.g. comparison -> dual bars, temporal -> trendline, spatial -> GIS map).',
      details: [
        'Single metric -> Key KPI Card',
        'Geographic query -> Chhattisgarh GIS cartogram',
        'Multi-district comparison -> Grouped dual bar chart'
      ]
    },
    {
      id: 'ai-explanation',
      title: '12. GROUNDED AI EXPLANATION → USER',
      badge: 'VERIFIED INSIGHT',
      subtitle: 'Synthesis Grounded in Database Rows',
      icon: CheckCircle2,
      color: '#10B981',
      description: 'Generates a concise plain-English explanation summarizing the exact tabular rows returned from the database. Zero hallucination guarantee.',
      details: [
        'Numbers are derived strictly from database output rows',
        'Bold highlights for key findings and regional variances',
        'Provides transparent "Explain Query" lineage on demand'
      ]
    }
  ];

  const activeNodeData = ARCHITECTURE_NODES.find((n) => n.id === selectedNode) || ARCHITECTURE_NODES[4];

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="pill pill-cyan" style={{ fontSize: '0.72rem' }}>
            <Layers size={13} /> TECHNICAL ARCHITECTURE
          </span>
          <span className="pill pill-emerald" style={{ fontSize: '0.72rem' }}>
            ORACLE 26ai ENTERPRISE BLUEPRINT
          </span>
        </div>

        <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
          System Architecture & Lineage
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '820px' }}>
          How TerraQuery transforms natural language into deterministic database queries using Oracle AI Database 26ai and Select AI.
        </p>
      </div>

      {/* Critical Core Differentiator Callout Banner */}
      <div style={{
        padding: '20px 24px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'rgba(0, 242, 254, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={26} color="#00F2FE" />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>
            Fundamental Differentiator: The LLM Does NOT Invent Climate Values
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
            Unlike generic chat AI that guesses weather from static model weights, TerraQuery uses Oracle Select AI purely for <strong>Language-to-SQL translation</strong>. All numerical values, metrics, and trends are computed directly by the Oracle 26ai engine from verified climate observation tables.
          </p>
        </div>
      </div>

      {/* Main Interactive Grid: Architecture Pipeline vs Selected Node Detail */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Left Column: Flowchart Nodes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Click Any Layer to Inspect Technical Implementation:
          </div>

          {ARCHITECTURE_NODES.map((node, idx) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;

            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNode(node.id)}
                  style={{
                    background: isSelected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(8, 16, 36, 0.7)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: node.color
                    }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#E2E8F0' }}>
                        {node.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {node.subtitle}
                      </div>
                    </div>
                  </div>

                  <span className="pill pill-muted" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                    {node.badge}
                  </span>
                </div>

                {/* Arrow connector between nodes */}
                {idx < ARCHITECTURE_NODES.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '1px 0' }}>
                    <ArrowDown size={14} color="rgba(0, 242, 254, 0.4)" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Column: Node Deep Dive Panel */}
        <div style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
          <div className="glass-card accent-top" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="pill pill-cyan" style={{ fontSize: '0.72rem' }}>
                ARCHITECTURE INSPECTOR
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Component {activeNodeData.id.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeNodeData.color
              }}>
                {React.createElement(activeNodeData.icon, { size: 22 })}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{activeNodeData.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{activeNodeData.subtitle}</p>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: '20px' }}>
              {activeNodeData.description}
            </p>

            <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Engineering Capabilities:
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {activeNodeData.details.map((d, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            {/* Oracle 26ai Select AI PL/SQL Code Sample */}
            <div style={{
              background: '#040711',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 600 }}>
                <Terminal size={14} />
                <span>Oracle Select AI Implementation Spec:</span>
              </div>
              <pre className="code-block" style={{ fontSize: '0.74rem', margin: 0, maxHeight: '180px' }}>
{`-- Oracle Database 26ai Select AI Profile Setup
BEGIN
  DBMS_CLOUD_AI.CREATE_PROFILE(
    profile_name => 'CLIMATE_SELECT_AI_V2',
    attributes   => '{"provider": "oci",
                      "model": "cohere.command-r-plus",
                      "credential_name": "OCI_CRED",
                      "object_list": [
                        {"owner": "CLIMATE_ADMIN", "name": "CLIMATE_DATA"}
                      ]}'
  );
END;
/`}
              </pre>
            </div>

            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Status: Architecture Validated</span>
              <span style={{ color: 'var(--accent-cyan)' }}>Oracle 26ai Ready</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
