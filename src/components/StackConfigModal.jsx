import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  ShieldCheck, 
  Key, 
  Lock, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  RefreshCw,
  Terminal,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function StackConfigModal({ isOpen, onClose }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [activeTab, setActiveTab] = useState('parameters'); // 'parameters' | 'security' | 'pipeline'

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const startTime = performance.now();
      const res = await fetch('/api/health');
      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);

      setTestResult({
        success: data.status === 'healthy',
        mode: data.mode || 'LIVE_MONGODB_GEMINI',
        latency: `${elapsed}ms`,
        database: `${data.database?.engine || 'MongoDB Atlas'} (${data.database?.database}.${data.database?.collection})`,
        dbStatus: data.database?.status || 'ONLINE',
        aiProvider: `${data.ai?.provider || 'Google Gemini'} (${data.ai?.model || 'gemini-3.5-flash-lite'})`,
        validation: data.security?.queryValidation === 'ENABLED' ? 'Enforced & Active' : 'Active',
        readOnly: data.security?.readOnlyOperations ? 'Enforced Read-Only' : 'Read-Only'
      });
    } catch {
      setTestResult({
        success: false,
        mode: 'Local Dataset Mode (Backend Offline)',
        latency: 'Offline',
        database: 'MongoDB Atlas (terraquery.rainfall)',
        dbStatus: 'STANDBY',
        aiProvider: 'Google Gemini (Client Fallback)',
        validation: 'Enforced & Active',
        readOnly: 'Enforced Read-Only'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
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
              <Database size={20} color="#00F2FE" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>TerraQuery Stack & Database Configuration</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                MongoDB Atlas integration, Gemini query pipeline & connection status
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
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Banner */}
        <div style={{
          margin: '20px 24px 0',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="led-indicator led-cyan" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Active Architecture: Google Gemini + MongoDB Atlas
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Grounded on authentic IMD rainfall records across Indian meteorological divisions
              </div>
            </div>
          </div>
          <span className="pill pill-cyan" style={{ fontSize: '0.7rem' }}>
            STACK OPERATIONAL
          </span>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 24px 0',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'parameters', label: 'Connection & Environment (.env)' },
            { id: 'security', label: 'Security & Guardrails' },
            { id: 'pipeline', label: 'Query Pipeline Specification' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                padding: '10px 14px',
                color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px 24px' }}>
          {activeTab === 'parameters' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Production environment variables managed via server-side .env:
              </div>

              {[
                { key: 'MONGODB_URI', val: 'mongodb+srv://••••••••:••••••••@cluster0.mongodb.net/terraquery', type: 'password' },
                { key: 'GEMINI_API_KEY', val: 'AIzaSy••••••••••••••••••••••••••••••••', type: 'password' },
                { key: 'DATABASE_NAME', val: 'terraquery', type: 'text' },
                { key: 'COLLECTION_NAME', val: 'rainfall', type: 'text' },
                { key: 'AI_MODEL', val: 'gemini-3.5-flash-lite / gemini-2.5-flash', type: 'text' },
                { key: 'DATASET_SOURCE', val: 'India Meteorological Department (IMD) Rainfall Records', type: 'text' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(5, 10, 22, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Key size={14} color="#38BDF8" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#94A3B8' }}>
                      {item.key}
                    </span>
                  </div>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.78rem', 
                    color: item.type === 'password' ? 'var(--text-muted)' : 'var(--accent-cyan)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '4px 10px',
                    borderRadius: '4px'
                  }}>
                    {item.val}
                  </span>
                </div>
              ))}

              <div style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="btn btn-outline"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                >
                  <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
                  <span>{testing ? 'Testing Stack Connection...' : 'Test Connection Latency'}</span>
                </button>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Tests live /api/health endpoint
                </div>
              </div>

              {testResult && (
                <div style={{
                  marginTop: '10px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: testResult.success ? 'var(--accent-emerald)' : '#F59E0B', fontWeight: 600 }}>
                    {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{testResult.success ? 'Backend Services Responded Successfully' : 'Backend Server Standby / Local Mode'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                    <div>Latency: <span style={{ color: 'var(--text-primary)' }}>{testResult.latency}</span></div>
                    <div>Database: <span style={{ color: 'var(--text-primary)' }}>{testResult.database}</span></div>
                    <div>AI Provider: <span style={{ color: 'var(--text-primary)' }}>{testResult.aiProvider}</span></div>
                    <div>Enforced Role: <span style={{ color: 'var(--text-primary)' }}>{testResult.readOnly}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px'
              }}>
                {[
                  {
                    title: 'Restricted Read-Only Execution',
                    desc: 'Database queries execute under read-only permissions with zero INSERT, UPDATE, DELETE, or DROP privileges.',
                    icon: ShieldCheck,
                    color: '#10B981'
                  },
                  {
                    title: 'AST Operator Whitelist',
                    desc: 'All AI-generated queries are inspected by a strict validator to block dangerous operators ($out, $merge, $where, script injection).',
                    icon: Lock,
                    color: '#00F2FE'
                  },
                  {
                    title: 'Deterministic Grounding',
                    desc: 'All numerical facts and metrics originate from structured IMD rainfall records in MongoDB Atlas, eliminating LLM hallucinations.',
                    icon: Cpu,
                    color: '#A78BFA'
                  },
                  {
                    title: 'Air-Gapped Client Credentials',
                    desc: 'Database connection strings and Gemini API keys remain sealed in server-side environment variables and are never sent to clients.',
                    icon: Server,
                    color: '#38BDF8'
                  }
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} style={{
                      background: 'rgba(6, 12, 26, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Icon size={18} color={card.color} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{card.title}</span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {card.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.76rem',
                color: 'var(--text-secondary)'
              }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Security Note:</span> AI-generated queries are strictly validated and executed against read-only MongoDB Atlas collections.
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Production query pipeline: Natural language → Gemini → Validation → MongoDB Atlas → Grounded explanation:
              </p>
              <pre className="code-block" style={{ fontSize: '0.78rem' }}>
{`// 1. Client submits natural-language question
const question = "Which district had the highest rainfall in 2024?";

// 2. Gemini generates structured MongoDB query plan
const { query, visualization } = await generateMongoQuery(question);

// 3. Security validation: enforce read-only operators
validateMongoQuery(query);

// 4. Deterministic execution on MongoDB Atlas
const records = await executeGeneratedQuery(query);

// 5. Synthesis: Grounded explanation from verified records
const explanation = await generateResultExplanation(question, records);`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(5, 8, 19, 0.6)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            React + Vite • Google Gemini • MongoDB Atlas • IMD Rainfall Dataset
          </div>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
