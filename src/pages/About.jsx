import React from 'react';
import { 
  Globe2, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Award, 
  Terminal, 
  Cpu, 
  Layers, 
  PlayCircle,
  ArrowRight
} from 'lucide-react';

export default function About({ onNavigateToDashboard }) {
  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="pill pill-cyan" style={{ fontSize: '0.74rem' }}>
            <Award size={13} /> HACKATHON PROTOTYPE SPECIFICATION
          </span>
          <span className="pill pill-emerald" style={{ fontSize: '0.74rem' }}>
            ORACLE AI DATABASE 26ai
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 800,
          marginBottom: '14px',
          background: 'linear-gradient(135deg, #FFFFFF 30%, #00F2FE 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          About TerraQuery
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          "An AI-powered natural-language interface over structured Earth and climate observations, powered by Oracle AI Database 26ai and Select AI."
        </p>
      </div>

      {/* Core Value Proposition Banner */}
      <div className="glass-card accent-top" style={{
        padding: '32px',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(10, 20, 44, 0.9) 0%, rgba(5, 10, 24, 0.9) 100%)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div>
            <span className="pill pill-cyan" style={{ fontSize: '0.68rem', marginBottom: '8px' }}>
              THE CORE CONCEPT
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>
              "No SQL. Just Ask."
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Climate science and disaster relief depend on high-velocity data queries across millions of sensor readings. Yet the people who make critical policies — climate analysts, emergency response officers, agricultural directors — rarely know SQL.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#E2E8F0', marginTop: '10px', lineHeight: 1.6 }}>
              TerraQuery bridges this gap: users ask questions in plain English, and Oracle Database 26ai's native <strong>Select AI</strong> layer handles the query translation, execution, anomaly discovery, and visual mapping seamlessly.
            </p>
          </div>

          <div style={{
            background: 'rgba(5, 10, 22, 0.8)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#38BDF8',
            lineHeight: 1.7
          }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>// Natural Query Flow:</div>
            <div>User: "Compare rainfall between Durg & Raipur"</div>
            <div style={{ color: 'var(--accent-emerald)' }}>↓ Select AI (DBMS_CLOUD_AI)</div>
            <div>Oracle SQL: SELECT district, SUM(rainfall)...</div>
            <div style={{ color: 'var(--accent-emerald)' }}>↓ Oracle AI Database 26ai Engine</div>
            <div>Result: Raipur +165 mm surplus (+14.0%)</div>
            <div style={{ color: 'var(--accent-cyan)' }}>↓ Grounded Visuals & Anomaly Map</div>
          </div>
        </div>
      </div>

      {/* Target Users Grid (Section 2) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Users size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Target Users & Stakeholders</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {[
            {
              role: 'Researchers & Scientists',
              useCase: 'Detect multi-year warming trends, calculate standard deviations, and cross-reference humidity anomalies without writing manual SQL joins.'
            },
            {
              role: 'Disaster Management Teams',
              useCase: 'Rapidly identify districts experiencing acute precipitation surplus (>25% departure) to pre-position flood relief assets.'
            },
            {
              role: 'Government & Environment Depts',
              useCase: 'Formulate heat-action plans based on localized urban heat island detections, such as Durg\'s 42.8°C heatwave records.'
            },
            {
              role: 'Policy Analysts & NGOs',
              useCase: 'Validate agricultural monsoon stability across districts (e.g. Rajnandgaon kharif deficit) for drought compensation.'
            }
          ].map((u, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                {u.role}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {u.useCase}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Minute Hackathon Jury Demonstration Script (Section 23) */}
      <div className="glass-card accent-top" style={{
        padding: '28px',
        marginBottom: '40px',
        border: '1px solid rgba(0, 242, 254, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlayCircle size={22} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              2-Minute Hackathon Jury Demo Walkthrough
            </h3>
          </div>
          <span className="pill pill-cyan" style={{ fontSize: '0.68rem' }}>
            JUDGE PRESENTATION GUIDE
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {[
            {
              step: 'Step 1: The Pitch (0:00 - 0:25)',
              text: 'Open the Dashboard. Emphasize "Ask Earth Data Anything." State the core problem: climate data is locked behind complex SQL databases.'
            },
            {
              step: 'Step 2: Peak Query (0:25 - 0:55)',
              text: 'Click: "Which district in Chhattisgarh had the highest temperature in 2024?". Watch the 4-step pipeline run. Show Durg (42.8°C), the auto-selected ranking chart, and the map highlight.'
            },
            {
              step: 'Step 3: Comparison Query (0:55 - 1:25)',
              text: 'Click: "Compare rainfall between Durg and Raipur from 2020 to 2024." Point out the dual bar chart (+165 mm surplus for Raipur).'
            },
            {
              step: 'Step 4: Architecture & Trust (1:25 - 2:00)',
              text: 'Open the Architecture page. Show Oracle Database 26ai + Select AI. Emphasize: "The LLM never hallucinates numbers — data is computed directly in Oracle 26ai."'
            }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(5, 10, 22, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                {item.step}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onNavigateToDashboard}
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.92rem' }}
          >
            <span>Launch Live Demo on Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Technology Differentiation Summary (Section 19) */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
          Key Product Differentiators
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {[
            {
              title: '1. No SQL Expertise Required',
              desc: 'Natural language queries are automatically translated to optimized Oracle SQL.'
            },
            {
              title: '2. Deterministic Database Grounding',
              desc: 'Answers are backed by structured observation tables in Oracle 26ai, eliminating LLM hallucinations.'
            },
            {
              title: '3. Transparent SQL Inspector',
              desc: 'Full visibility into generated queries, schema references, and execution plans with 1-click lineage auditing.'
            },
            {
              title: '4. Smart Adaptive Visualizations',
              desc: 'Automatically chooses KPI cards, bar rankings, trendlines, or anomaly charts based on query semantics.'
            },
            {
              title: '5. Spatial Cartogram Intelligence',
              desc: 'Interactive geographic visualization of Chhattisgarh and Indian benchmark climate nodes.'
            },
            {
              title: '6. Enterprise Security Boundaries',
              desc: 'Operates with read-only database privileges and air-gapped credential storage.'
            }
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#F8FAFC' }}>{d.title}</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {d.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
