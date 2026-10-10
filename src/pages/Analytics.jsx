import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { DATASET_METRICS, CHHATTISGARH_DISTRICTS } from '../data/climateData.js';
import BarChart from '../components/Charts/BarChart.jsx';
import LineTrendChart from '../components/Charts/LineTrendChart.jsx';
import ComparisonChart from '../components/Charts/ComparisonChart.jsx';
import AnomalyDivergingChart from '../components/Charts/AnomalyDivergingChart.jsx';

export default function Analytics() {
  const [selectedYear, setSelectedYear] = useState(2024);

  // Five Year Macro Trends
  const macroTempTrend = [
    { label: '2020', value: 31.8, peak: 40.6, min: 13.8 },
    { label: '2021', value: 32.1, peak: 41.1, min: 14.2 },
    { label: '2022', value: 32.4, peak: 41.4, min: 14.5 },
    { label: '2023', value: 32.7, peak: 42.1, min: 14.9 },
    { label: '2024', value: 33.1, peak: 42.8, min: 15.4 }
  ];

  // District Rainfall Distribution (2024)
  const districtRainfall = [
    { label: 'Korba', value: 1624.5, color: '#00F2FE', isHighlight: true },
    { label: 'Jagdalpur', value: 1582.0, color: '#38BDF8' },
    { label: 'Bastar', value: 1510.4, color: '#60A5FA' },
    { label: 'Raigarh', value: 1420.2, color: '#818CF8' },
    { label: 'Surguja', value: 1395.0, color: '#A78BFA' },
    { label: 'Raipur', value: 1380.0, color: '#C084FC' },
    { label: 'Bilaspur', value: 1320.0, color: '#34D399' },
    { label: 'Durg', value: 1211.0, color: '#94A3B8' }
  ];

  // Monthly Monsoon Distribution
  const monthlyRainfall = [
    { label: 'Jan', series1: 12, series2: 15 },
    { label: 'Feb', series1: 18, series2: 20 },
    { label: 'Mar', series1: 15, series2: 18 },
    { label: 'Apr', series1: 22, series2: 26 },
    { label: 'May', series1: 35, series2: 42 },
    { label: 'Jun', series1: 195, series2: 240 },
    { label: 'Jul', series1: 380, series2: 440 },
    { label: 'Aug', series1: 360, series2: 420 },
    { label: 'Sep', series1: 210, series2: 260 },
    { label: 'Oct', series1: 65, series2: 78 },
    { label: 'Nov', series1: 14, series2: 16 },
    { label: 'Dec', series1: 8, series2: 10 }
  ];

  // Anomaly data points
  const anomalyData = [
    { label: 'Korba', value: 31.4, color: '#EF4444' },
    { label: 'Jagdalpur', value: 24.8, color: '#F97316' },
    { label: 'Bastar', value: 21.2, color: '#F59E0B' },
    { label: 'Raigarh', value: 15.6, color: '#38BDF8' },
    { label: 'Bilaspur', value: 11.9, color: '#10B981' }
  ];

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Page Header */}
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
              <BarChart3 size={13} /> CLIMATE ANALYTICS
            </span>
            <span className="pill pill-muted" style={{ fontSize: '0.72rem' }}>
              MongoDB Atlas Aggregations
            </span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Macro Climate Intelligence & Trends
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Multi-year statistical baselines, anomaly detection alerts, and cross-district atmospheric correlations.
          </p>
        </div>

        {/* Year Filter Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(10, 18, 38, 0.7)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          border: '1px solid var(--border-subtle)'
        }}>
          {[2020, 2021, 2022, 2023, 2024].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: selectedYear === yr ? 'var(--accent-cyan)' : 'transparent',
                color: selectedYear === yr ? '#040814' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Cards Strip (Section 10 Requirements) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Card 1: Average Temperature */}
        <div className="glass-card accent-top" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>AVERAGE TEMPERATURE</span>
            <Thermometer size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#F8FAFC' }}>
            32.4°C
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#EF4444' }}>
            <ArrowUpRight size={14} />
            <span>+0.32°C/yr warming rate</span>
          </div>
        </div>

        {/* Card 2: Average Rainfall */}
        <div className="glass-card accent-top" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>AVERAGE RAINFALL</span>
            <CloudRain size={16} color="#00F2FE" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#00F2FE' }}>
            812 mm
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#10B981' }}>
            <ArrowUpRight size={14} />
            <span>Baseline Quota (2024: 1,248 mm)</span>
          </div>
        </div>

        {/* Card 3: Average Humidity */}
        <div className="glass-card accent-top" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>AVERAGE HUMIDITY</span>
            <Droplets size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#34D399' }}>
            71%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Peaked at 84% in Jagdalpur</span>
          </div>
        </div>

        {/* Card 4: Highest Temperature */}
        <div className="glass-card accent-top" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>HIGHEST TEMPERATURE</span>
            <Thermometer size={16} color="#EF4444" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#EF4444' }}>
            44.1°C
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
            <span>Historical All-Time Peak Record</span>
          </div>
        </div>

        {/* Card 5: Total Monitored Precipitation */}
        <div className="glass-card accent-top" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>TOTAL PRECIPITATION</span>
            <Layers size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#38BDF8' }}>
            15,240 mm
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Cumulative across 12 districts</span>
          </div>
        </div>
      </div>

      {/* Climate Anomalies Banner (Section 10 Requirement) */}
      <div className="glass-card accent-top" style={{
        padding: '24px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(16, 26, 54, 0.9) 0%, rgba(8, 14, 30, 0.9) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#F59E0B" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Detected Climate Anomalies (Statistical Departures &gt; 2.0 σ)
            </h3>
          </div>
          <span className="pill pill-amber" style={{ fontSize: '0.7rem' }}>
            CLIMATE ANALYTIC ENGINE
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {DATASET_METRICS.keyAnomalies.map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(5, 10, 22, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {item.district} ({item.year})
                </span>
                <span className={`pill ${item.severity === 'critical' ? 'pill-rose' : 'pill-amber'}`} style={{ fontSize: '0.62rem' }}>
                  {item.metric} Anomaly
                </span>
              </div>
              <div style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: item.severity === 'critical' ? '#EF4444' : '#F59E0B',
                marginBottom: '6px'
              }}>
                {item.changeText}
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '24px',
        marginBottom: '28px'
      }}>
        {/* Chart 1: 5-Year Warming Trend */}
        <div>
          <LineTrendChart
            data={macroTempTrend}
            title="Statewide Thermal Acceleration Trend (2020–2024)"
          />
        </div>

        {/* Chart 2: Rainfall Anomaly Diverging Chart */}
        <div>
          <AnomalyDivergingChart
            data={anomalyData}
            title="Precipitation Surplus & Departure by District"
          />
        </div>

        {/* Chart 3: District Cumulative Rainfall */}
        <div>
          <BarChart
            data={districtRainfall}
            title="2024 Cumulative District Rainfall Ranking (mm)"
            unit="mm"
          />
        </div>

        {/* Chart 4: Monthly Monsoon Precipitation Breakdown */}
        <div>
          <ComparisonChart
            data={monthlyRainfall}
            title="Monthly Precipitation Profile: Historical vs 2024 (mm)"
            seriesMeta={{
              series1: { name: 'Historical Mean', color: '#60A5FA' },
              series2: { name: '2024 Observed', color: '#00F2FE' }
            }}
          />
        </div>
      </div>

      {/* Footer attribution */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.74rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Ground Truth: IMD rainfall observations and climate parameters.</span>
        <span>Powered by MongoDB Atlas & Gemini Analytics</span>
      </div>
    </div>
  );
}
