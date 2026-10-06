import React, { useState } from 'react';
import { 
  Globe2, 
  Database, 
  Sparkles, 
  Cpu, 
  BarChart3, 
  Compass, 
  History, 
  Info, 
  Layers, 
  ShieldCheck, 
  Menu, 
  X,
  Server
} from 'lucide-react';

export default function Navbar({ activeRoute, onNavigate, onOpenConfig }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'explore', label: 'Explore Data', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'history', label: 'Query History', icon: History },
    { id: 'about', label: 'About', icon: Info }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(5, 8, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)'
          }}>
            <Globe2 size={24} color="#00F2FE" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #FFFFFF 30%, #00F2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                TERRAQUERY
              </span>
              <span className="pill pill-cyan" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                SELECT AI
              </span>
            </div>
            <p style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>Oracle AI Database 26ai</span>
              <span style={{ color: 'var(--accent-cyan)' }}>•</span>
              <span>Natural-Language Earth Data</span>
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(10, 18, 38, 0.6)',
          padding: '4px 6px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }} className="desktop-nav">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  outline: 'none',
                  boxShadow: isActive ? '0 0 12px rgba(0, 242, 254, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Icon size={15} color={isActive ? '#00F2FE' : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Connection Status Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenConfig}
            title="Click to view Oracle AI Database connection parameters"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(12, 24, 48, 0.8)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.1)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 242, 254, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.1)';
            }}
          >
            <span className="led-indicator led-cyan" />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.74rem' }}>
                Oracle AI Database 26ai
              </div>
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.68rem', fontWeight: 500 }}>
                Prototype Mode (Simulated)
              </div>
            </div>
            <Server size={14} color="#38BDF8" style={{ marginLeft: '4px' }} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--header-height)',
          left: 0,
          right: 0,
          background: 'rgba(7, 12, 26, 0.98)',
          borderBottom: '1px solid var(--border-glow)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 99
        }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? '#00F2FE' : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Style for responsive media queries */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
