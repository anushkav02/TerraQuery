import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import OracleConfigModal from './components/OracleConfigModal.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ExploreData from './pages/ExploreData.jsx';
import Analytics from './pages/Analytics.jsx';
import Architecture from './pages/Architecture.jsx';
import History from './pages/History.jsx';
import About from './pages/About.jsx';
import { 
  Globe2, 
  Database, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Server,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Path to route mapper
  const getRouteFromPath = () => {
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (['explore', 'analytics', 'architecture', 'history', 'about'].includes(path)) {
      return path;
    }
    return 'dashboard';
  };

  const [activeRoute, setActiveRoute] = useState(getRouteFromPath());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('terraquery_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with browser URL navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveRoute(getRouteFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (routeId) => {
    setActiveRoute(routeId);
    const newPath = routeId === 'dashboard' ? '/' : `/${routeId}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addHistoryItem = (item) => {
    setHistoryItems((prev) => {
      const updated = [item, ...prev.filter((h) => h.canonicalQuestion !== item.canonicalQuestion)].slice(0, 20);
      try {
        localStorage.setItem('terraquery_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage error:', err);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistoryItems([]);
    try {
      localStorage.removeItem('terraquery_history');
    } catch (err) {
      console.warn('Storage clear error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Global Navigation Bar */}
      <Navbar
        activeRoute={activeRoute}
        onNavigate={navigateTo}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Main Page Content Body */}
      <main style={{ flex: 1 }}>
        {activeRoute === 'dashboard' && (
          <Dashboard
            onAddHistory={addHistoryItem}
            onOpenConfig={() => setIsConfigModalOpen(true)}
            onNavigate={navigateTo}
          />
        )}
        {activeRoute === 'explore' && <ExploreData />}
        {activeRoute === 'analytics' && <Analytics />}
        {activeRoute === 'architecture' && <Architecture />}
        {activeRoute === 'history' && (
          <History
            historyItems={historyItems}
            onSelectQuery={(q) => {
              navigateTo('dashboard');
              // trigger search via state dispatch or auto-fill
              setTimeout(() => {
                const searchInput = document.querySelector('input[type="text"]');
                if (searchInput) {
                  searchInput.value = q;
                  const btn = searchInput.parentElement?.querySelector('button');
                  if (btn) btn.click();
                }
              }, 100);
            }}
            onClearHistory={clearHistory}
          />
        )}
        {activeRoute === 'about' && (
          <About onNavigateToDashboard={() => navigateTo('dashboard')} />
        )}
      </main>

      {/* Global Oracle Configuration & Security Modal */}
      <OracleConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Global Footer */}
      <footer style={{
        backgroundColor: '#040711',
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 0 30px',
        color: 'var(--text-secondary)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px',
            marginBottom: '32px'
          }}>
            {/* Col 1: Brand & Purpose */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Globe2 size={20} color="var(--accent-cyan)" />
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#FFFFFF'
                }}>
                  TERRAQUERY
                </span>
                <span className="pill pill-cyan" style={{ fontSize: '0.62rem' }}>
                  26ai
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                AI-Powered Natural-Language Climate Intelligence Platform. Grounded on Oracle AI Database 26ai, Select AI, and high-fidelity Earth observation datasets.
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '12px' }}>
                Quick Navigation
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <li>
                  <button 
                    onClick={() => navigateTo('dashboard')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    AI Climate Query Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('explore')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    Explore 125k+ Observation Catalog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('analytics')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    Macro Trends & Climate Anomalies
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('architecture')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    System Architecture & Select AI
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Technical Specifications */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '12px' }}>
                Enterprise Architecture
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div>• Platform: Oracle AI Database 26ai</div>
                <div>• Query Layer: Select AI (DBMS_CLOUD_AI)</div>
                <div>• Catalog: CLIMATE_INTEL_2026.CLIMATE_DATA</div>
                <div>• Security: Read-Only Role Enforcement</div>
                <div style={{ marginTop: '4px' }}>
                  <button
                    onClick={() => setIsConfigModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>View Connection Secrets & Status</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="led-indicator led-cyan" />
              <span>Prototype Mode — Oracle connection simulated with structured 125,000+ observation schema</span>
            </div>

            <div>
              Built for Oracle AI Database 26ai Hackathon • No SQL. Just Ask.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
