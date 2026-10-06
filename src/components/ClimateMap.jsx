import React, { useState } from 'react';
import { 
  Thermometer, 
  CloudRain, 
  Droplets, 
  MapPin, 
  Info, 
  Layers, 
  Maximize2 
} from 'lucide-react';
import { CHHATTISGARH_DISTRICTS } from '../data/climateData.js';

export default function ClimateMap({ 
  activeDistrict = 'Durg', 
  mapMode = 'temperature', 
  onSelectDistrict 
}) {
  const [currentMode, setCurrentMode] = useState(mapMode || 'temperature');
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  // Synchronize when parent prop changes
  React.useEffect(() => {
    if (mapMode) setCurrentMode(mapMode);
  }, [mapMode]);

  // District geometry coordinates mapped to custom SVG viewBox (0 0 600 700)
  // Geographically oriented for Chhattisgarh: North (Surguja) to South (Jagdalpur/Bastar)
  const DISTRICT_NODES = [
    { name: 'Surguja', x: 360, y: 110, r: 38, path: 'M 320 80 L 400 70 L 420 140 L 330 150 Z' },
    { name: 'Korba', x: 340, y: 220, r: 40, path: 'M 290 180 L 390 170 L 410 250 L 310 260 Z' },
    { name: 'Bilaspur', x: 230, y: 240, r: 42, path: 'M 170 200 L 280 190 L 290 280 L 190 290 Z' },
    { name: 'Raigarh', x: 440, y: 270, r: 38, path: 'M 390 230 L 490 220 L 500 310 L 400 320 Z' },
    { name: 'Rajnandgaon', x: 130, y: 350, r: 38, path: 'M 80 310 L 180 300 L 190 390 L 90 400 Z' },
    { name: 'Durg', x: 220, y: 350, r: 42, path: 'M 180 310 L 270 300 L 280 390 L 190 400 Z' },
    { name: 'Raipur', x: 310, y: 350, r: 44, path: 'M 270 310 L 360 300 L 370 390 L 280 400 Z' },
    { name: 'Mahasamund', x: 410, y: 360, r: 38, path: 'M 370 320 L 460 310 L 470 400 L 380 410 Z' },
    { name: 'Dhamtari', x: 290, y: 440, r: 36, path: 'M 250 410 L 340 400 L 350 480 L 260 490 Z' },
    { name: 'Kanker', x: 270, y: 510, r: 36, path: 'M 230 480 L 320 470 L 330 550 L 240 560 Z' },
    { name: 'Bastar', x: 280, y: 580, r: 40, path: 'M 230 550 L 340 540 L 350 620 L 240 630 Z' },
    { name: 'Jagdalpur', x: 320, y: 640, r: 38, path: 'M 270 610 L 370 600 L 380 675 L 280 685 Z' }
  ];

  // Specific 2024 metric lookup per district
  const getDistrictMetrics = (name) => {
    switch (name) {
      case 'Durg':
        return { temp: 42.8, rain: 1211, precip: 1235, hum: 74.8, status: 'Peak Heatwave' };
      case 'Raipur':
        return { temp: 41.9, rain: 1380, precip: 1408, hum: 76.8, status: 'Severe Heatwave' };
      case 'Bilaspur':
        return { temp: 41.5, rain: 1320, precip: 1346, hum: 76.1, status: 'Heatwave' };
      case 'Korba':
        return { temp: 40.8, rain: 1624.5, precip: 1657, hum: 81.4, status: 'Torrential Precipitation' };
      case 'Rajnandgaon':
        return { temp: 41.2, rain: 1145, precip: 1168, hum: 73.2, status: 'Heatwave' };
      case 'Jagdalpur':
        return { temp: 38.6, rain: 1582, precip: 1614, hum: 84.2, status: 'Humid Rainforest Zone' };
      case 'Surguja':
        return { temp: 37.4, rain: 1395, precip: 1423, hum: 79.2, status: 'Sub-tropical Highland' };
      case 'Raigarh':
        return { temp: 40.5, rain: 1420, precip: 1449, hum: 77.5, status: 'Above Normal Rain' };
      case 'Bastar':
        return { temp: 38.2, rain: 1510, precip: 1541, hum: 83.6, status: 'Heavy Forest Monsoon' };
      case 'Dhamtari':
        return { temp: 39.4, rain: 1240, precip: 1265, hum: 75.0, status: 'Mahanadi Basin' };
      case 'Kanker':
        return { temp: 39.1, rain: 1290, precip: 1316, hum: 78.0, status: 'Foothill Zone' };
      case 'Mahasamund':
        return { temp: 39.8, rain: 1260, precip: 1285, hum: 75.8, status: 'Eastern Plains' };
      default:
        return { temp: 39.0, rain: 1300, precip: 1326, hum: 75.0, status: 'Normal' };
    }
  };

  // Color generator based on selected mode
  const getNodeColor = (metrics) => {
    if (currentMode === 'temperature') {
      const t = metrics.temp;
      if (t >= 42.0) return '#EF4444'; // Red -> extreme
      if (t >= 41.0) return '#F97316'; // Orange -> high
      if (t >= 39.5) return '#F59E0B'; // Yellow -> moderate
      return '#10B981'; // Green -> lower / mild
    } else if (currentMode === 'rainfall') {
      const r = metrics.rain;
      if (r >= 1550) return '#00F2FE'; // Neon cyan -> torrential
      if (r >= 1400) return '#38BDF8'; // Sky blue -> heavy
      if (r >= 1250) return '#60A5FA'; // Medium blue -> normal
      return '#94A3B8'; // Muted -> low
    } else if (currentMode === 'precipitation') {
      const p = metrics.precip;
      if (p >= 1580) return '#00F2FE'; // Neon cyan
      if (p >= 1400) return '#38BDF8';
      if (p >= 1250) return '#60A5FA';
      return '#94A3B8';
    } else {
      // humidity mode
      const h = metrics.hum;
      if (h >= 82) return '#00F2FE';
      if (h >= 78) return '#818CF8';
      return '#A78BFA';
    }
  };

  return (
    <div className="glass-card accent-top" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Map Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill pill-cyan" style={{ fontSize: '0.65rem' }}>GEOGRAPHIC MAP</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Chhattisgarh Climate Grid
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Simplified geographic vector grid • Click any district to query
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(5, 10, 22, 0.8)',
          borderRadius: 'var(--radius-full)',
          padding: '3px',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'temperature', label: 'Temp', icon: Thermometer },
            { id: 'rainfall', label: 'Rain', icon: CloudRain },
            { id: 'precipitation', label: 'Precip', icon: Layers },
            { id: 'humidity', label: 'Humidity', icon: Droplets }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: isSelected ? 'var(--accent-cyan)' : 'transparent',
                  color: isSelected ? '#040814' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={12} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div style={{
        position: 'relative',
        flex: 1,
        minHeight: '340px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.04) 0%, rgba(4, 8, 18, 0.8) 100%)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        {/* Background Grid Lines */}
        <svg
          viewBox="0 0 600 720"
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '440px'
          }}
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00F2FE" stopOpacity="0" />
            </radialGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>
          <rect width="600" height="720" fill="url(#gridPattern)" />

          {/* Outlying Reference Neighboring States */}
          <g opacity="0.35" style={{ fontSize: '10px', fill: '#64748B', fontFamily: 'var(--font-mono)' }}>
            <text x="30" y="320">← MAHARASHTRA (Nagpur)</text>
            <text x="470" y="220">ODISHA (Sambalpur) →</text>
            <text x="330" y="40">↑ UTTAR PRADESH</text>
            <text x="40" y="160">MADHYA PRADESH ↖</text>
            <text x="240" y="708">↓ ANDHRA PRADESH / TELANGANA</text>
          </g>

          {/* Inter-District Connecting Geospatial Mesh Lines */}
          <g stroke="rgba(0, 242, 254, 0.15)" strokeWidth="1.2" strokeDasharray="4 3">
            <line x1="360" y1="110" x2="340" y2="220" />
            <line x1="340" y1="220" x2="230" y2="240" />
            <line x1="340" y1="220" x2="440" y2="270" />
            <line x1="230" y1="240" x2="310" y2="350" />
            <line x1="230" y1="240" x2="220" y2="350" />
            <line x1="220" y1="350" x2="130" y2="350" />
            <line x1="220" y1="350" x2="310" y2="350" />
            <line x1="310" y1="350" x2="410" y2="360" />
            <line x1="310" y1="350" x2="290" y2="440" />
            <line x1="220" y1="350" x2="290" y2="440" />
            <line x1="290" y1="440" x2="270" y2="510" />
            <line x1="270" y1="510" x2="280" y2="580" />
            <line x1="280" y1="580" x2="320" y2="640" />
          </g>

          {/* District Boundary Blocks */}
          {DISTRICT_NODES.map((node) => {
            const metrics = getDistrictMetrics(node.name);
            const color = getNodeColor(metrics);
            const isSelected = activeDistrict?.toLowerCase() === node.name.toLowerCase();
            const isHovered = hoveredDistrict?.name === node.name;

            return (
              <g
                key={node.name}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => onSelectDistrict && onSelectDistrict(node.name)}
                onMouseEnter={() => setHoveredDistrict({ ...node, metrics })}
                onMouseLeave={() => setHoveredDistrict(null)}
              >
                {/* District Region Block */}
                <path
                  d={node.path}
                  fill={color}
                  fillOpacity={isSelected ? 0.35 : (isHovered ? 0.25 : 0.12)}
                  stroke={color}
                  strokeWidth={isSelected ? 2.5 : (isHovered ? 2 : 1)}
                  strokeDasharray={isSelected ? 'none' : 'none'}
                  style={{
                    filter: isSelected ? 'url(#neonGlow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />

                {/* Central Pulse Ring for Active District */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.8"
                    className="animate-pulse"
                  />
                )}

                {/* District Core Node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 8 : (isHovered ? 7 : 5)}
                  fill={color}
                  stroke="#050813"
                  strokeWidth="2"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 8px ' + color + ')' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />

                {/* District Label */}
                <text
                  x={node.x}
                  y={node.y - (isSelected ? 14 : 10)}
                  textAnchor="middle"
                  fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                  fontSize={isSelected ? '12px' : '10px'}
                  fontWeight={isSelected ? '700' : '500'}
                  fontFamily="var(--font-main)"
                  letterSpacing="0.02em"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.name}
                </text>

                {/* Metric Sub-label */}
                <text
                  x={node.x}
                  y={node.y + (isSelected ? 18 : 14)}
                  textAnchor="middle"
                  fill={color}
                  fontSize="9px"
                  fontFamily="var(--font-mono)"
                  fontWeight="600"
                  style={{ pointerEvents: 'none' }}
                >
                  {currentMode === 'temperature' && `${metrics.temp}°C`}
                  {currentMode === 'rainfall' && `${metrics.rain}mm`}
                  {currentMode === 'precipitation' && `${metrics.precip}mm`}
                  {currentMode === 'humidity' && `${metrics.hum}%`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Active Floating Tooltip */}
        {hoveredDistrict && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(8, 16, 36, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.7)',
            pointerEvents: 'none',
            minWidth: '180px',
            animation: 'fadeIn 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F8FAFC' }}>
                {hoveredDistrict.name}
              </span>
              <span className="pill pill-cyan" style={{ fontSize: '0.62rem' }}>
                {hoveredDistrict.metrics.status}
              </span>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>Peak Temp:</span>
                <span style={{ color: '#EF4444', fontWeight: 600 }}>{hoveredDistrict.metrics.temp}°C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>Rainfall:</span>
                <span style={{ color: '#00F2FE', fontWeight: 600 }}>{hoveredDistrict.metrics.rain} mm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>Precipitation:</span>
                <span style={{ color: '#38BDF8', fontWeight: 600 }}>{hoveredDistrict.metrics.precip} mm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>Humidity:</span>
                <span style={{ color: '#34D399', fontWeight: 600 }}>{hoveredDistrict.metrics.hum}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div style={{
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.72rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Scale:</span>
          {currentMode === 'temperature' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#10B981' }} />
              <span>&lt;39°C</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#F59E0B' }} />
              <span>39-41°C</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#F97316' }} />
              <span>41-42°C</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#EF4444' }} />
              <span style={{ color: '#EF4444', fontWeight: 600 }}>&gt;42°C (Extreme)</span>
            </div>
          )}
          {currentMode === 'rainfall' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#94A3B8' }} />
              <span>&lt;1200mm</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#60A5FA' }} />
              <span>1200-1400mm</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#00F2FE' }} />
              <span style={{ color: '#00F2FE', fontWeight: 600 }}>&gt;1500mm (Torrential)</span>
            </div>
          )}
          {currentMode === 'precipitation' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#94A3B8' }} />
              <span>&lt;1250mm</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#60A5FA' }} />
              <span>1250-1400mm</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#38BDF8' }} />
              <span>1400-1580mm</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#00F2FE' }} />
              <span style={{ color: '#00F2FE', fontWeight: 600 }}>&gt;1580mm (Saturated)</span>
            </div>
          )}
          {currentMode === 'humidity' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#A78BFA' }} />
              <span>&lt;75%</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#818CF8' }} />
              <span>75-80%</span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#00F2FE' }} />
              <span style={{ color: '#00F2FE', fontWeight: 600 }}>&gt;82% (Saturated)</span>
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          Active Selection: <strong style={{ color: 'var(--accent-cyan)' }}>{activeDistrict || 'Durg'}</strong> (Prototype Data)
        </div>
      </div>
    </div>
  );
}
