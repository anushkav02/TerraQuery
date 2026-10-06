import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  Download, 
  Database, 
  Layers, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  FileSpreadsheet,
  MapPin,
  Calendar
} from 'lucide-react';
import { CLIMATE_DATA, CHHATTISGARH_DISTRICTS, ALL_MONITORED_LOCATIONS, AVAILABLE_STATES, DATASET_METRICS } from '../data/climateData.js';

export default function ExploreData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedSeason, setSelectedSeason] = useState('ALL');
  const [selectedParameter, setSelectedParameter] = useState('ALL');
  const [sortField, setSortField] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Available districts filtered by selected state
  const availableDistricts = useMemo(() => {
    if (selectedState === 'ALL') return ALL_MONITORED_LOCATIONS;
    return ALL_MONITORED_LOCATIONS.filter((d) => d.state === selectedState);
  }, [selectedState]);

  // Filtered & Sorted dataset
  const filteredData = useMemo(() => {
    return CLIMATE_DATA.filter((item) => {
      const matchSearch = searchTerm === '' || 
        item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.season.toLowerCase().includes(searchTerm.toLowerCase());

      const matchState = selectedState === 'ALL' || item.state === selectedState;
      const matchDist = selectedDistrict === 'ALL' || item.district === selectedDistrict;
      const matchYear = selectedYear === 'ALL' || item.year === parseInt(selectedYear, 10);
      const matchSeason = selectedSeason === 'ALL' || item.season === selectedSeason;

      return matchSearch && matchState && matchDist && matchYear && matchSeason;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchTerm, selectedState, selectedDistrict, selectedYear, selectedSeason, sortField, sortAsc]);

  // Handle parameter selection which automatically sorts by that parameter
  const handleSelectParameter = (param) => {
    setSelectedParameter(param);
    setCurrentPage(1);
    if (param !== 'ALL') {
      setSortField(param);
      setSortAsc(false); // Highest first
    }
  };

  // Pagination slice
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Year', 'Month', 'Season', 'District', 'State', 'Temperature (°C)', 'Rainfall (mm)', 'Precipitation (mm)', 'Humidity (%)', 'Wind Speed (km/h)', 'Pressure (hPa)'];
    const rows = filteredData.map((r) => [
      r.id,
      r.date,
      r.year,
      r.month_name,
      r.season,
      r.district,
      r.state,
      r.temperature,
      r.rainfall,
      r.precipitation,
      r.humidity,
      r.wind_speed,
      r.pressure
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `terraquery_climate_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Header Banner */}
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
              <Compass size={13} /> STRUCTURED EARTH CATALOG
            </span>
            <span className="pill pill-emerald" style={{ fontSize: '0.72rem' }}>
              125,000+ INDEXED OBSERVATIONS
            </span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Climate & Earth Observation Dataset
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '720px' }}>
            Explore underlying observation records ingested and indexed in Oracle AI Database 26ai. Query by spatio-temporal filters or download full schema extracts.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn btn-primary"
          style={{ fontSize: '0.85rem', padding: '10px 18px' }}
        >
          <Download size={15} />
          <span>Export Filtered CSV ({filteredData.length})</span>
        </button>
      </div>

      {/* Dataset Summary Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Total DB Records', val: '125,480', sub: 'Indexed in Oracle 26ai' },
          { label: 'Date Coverage', val: '2020 – 2024', sub: '5 Complete Calendar Years' },
          { label: 'Spatial Coverage', val: '12 Districts', sub: 'Chhattisgarh Central Grid' },
          { label: 'Schema Parameters', val: '10 Metrics', sub: 'Temp, Rain, Hum, Wind, Press' },
          { label: 'Storage Engine', val: 'Hybrid Columnar', sub: 'Oracle In-Memory Enabled' }
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '2px' }}>
              {stat.val}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '18px 20px', marginBottom: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          alignItems: 'center'
        }}>
          {/* Search box */}
          <div style={{
            position: 'relative',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search district, season, ID..."
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                padding: '9px 10px',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>

          {/* State Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill pill-cyan" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>STATE</span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
                setCurrentPage(1);
              }}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 12px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All States ({AVAILABLE_STATES.length})</option>
              {AVAILABLE_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--accent-cyan)" />
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 12px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Districts ({availableDistricts.length})</option>
              {availableDistricts.map((d) => (
                <option key={d.name} value={d.name}>{d.name} ({d.state})</option>
              ))}
            </select>
          </div>

          {/* Parameter Selection Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill pill-emerald" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>PARAM</span>
            <select
              value={selectedParameter}
              onChange={(e) => handleSelectParameter(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 12px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Parameters (10)</option>
              <option value="temperature">Temperature (°C)</option>
              <option value="rainfall">Rainfall (mm)</option>
              <option value="precipitation">Precipitation (mm)</option>
              <option value="humidity">Humidity (%)</option>
              <option value="wind_speed">Wind Speed (km/h)</option>
              <option value="pressure">Atmospheric Pressure (hPa)</option>
            </select>
          </div>

          {/* Year Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--accent-emerald)" />
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 12px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Years (2020–2024)</option>
              <option value="2024">2024 (Most Recent)</option>
              <option value="2023">2023</option>
              <option value="2022">2022 (High Rain)</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>

          {/* Season Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--accent-amber)" />
            <select
              value={selectedSeason}
              onChange={(e) => {
                setSelectedSeason(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 12px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Seasons</option>
              <option value="Monsoon">Monsoon (Jun–Sep)</option>
              <option value="Summer">Summer (Mar–May)</option>
              <option value="Winter">Winter (Nov–Feb)</option>
              <option value="Post-Monsoon">Post-Monsoon (Oct)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Structured Data Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.82rem',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(6, 12, 26, 0.95)',
                borderBottom: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem'
              }}>
                {[
                  { label: 'RECORD ID', field: 'id' },
                  { label: 'DATE', field: 'date' },
                  { label: 'STATE', field: 'state' },
                  { label: 'DISTRICT', field: 'district' },
                  { label: 'SEASON', field: 'season' },
                  { label: 'TEMP (°C)', field: 'temperature' },
                  { label: 'RAINFALL (MM)', field: 'rainfall' },
                  { label: 'PRECIP (MM)', field: 'precipitation' },
                  { label: 'HUMIDITY (%)', field: 'humidity' },
                  { label: 'WIND (KM/H)', field: 'wind_speed' },
                  { label: 'PRESS (HPA)', field: 'pressure' },
                  { label: 'LOCATION (LAT/LON)', field: 'latitude' }
                ].map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    style={{
                      padding: '12px 14px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      background: selectedParameter === col.field ? 'rgba(0, 242, 254, 0.08)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{col.label}</span>
                      <ArrowUpDown size={12} color={sortField === col.field ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No observation records found matching the active filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 242, 254, 0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      {row.id}
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      {row.date}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {row.state}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#F8FAFC' }}>
                      {row.district}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`pill ${row.season === 'Monsoon' ? 'pill-cyan' : (row.season === 'Summer' ? 'pill-rose' : 'pill-muted')}`} style={{ fontSize: '0.65rem' }}>
                        {row.season}
                      </span>
                    </td>
                    <td style={{
                      padding: '10px 14px',
                      fontWeight: 600,
                      background: selectedParameter === 'temperature' ? 'rgba(0, 242, 254, 0.07)' : 'transparent',
                      color: row.temperature >= 41.5 ? '#EF4444' : (row.temperature >= 38 ? '#F59E0B' : '#10B981')
                    }}>
                      {row.temperature}°C
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      background: selectedParameter === 'rainfall' ? 'rgba(0, 242, 254, 0.07)' : 'transparent',
                      color: '#00F2FE', 
                      fontWeight: row.rainfall > 200 ? 700 : 400 
                    }}>
                      {row.rainfall} mm
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      background: selectedParameter === 'precipitation' ? 'rgba(0, 242, 254, 0.07)' : 'transparent',
                      color: 'var(--text-secondary)' 
                    }}>
                      {row.precipitation} mm
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      background: selectedParameter === 'humidity' ? 'rgba(0, 242, 254, 0.07)' : 'transparent',
                      color: row.humidity > 80 ? '#34D399' : 'var(--text-secondary)' 
                    }}>
                      {row.humidity}%
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      background: selectedParameter === 'wind_speed' ? 'rgba(0, 242, 254, 0.07)' : 'transparent',
                      color: 'var(--text-secondary)' 
                    }}>
                      {row.wind_speed} km/h
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      background: selectedParameter === 'pressure' ? 'rgba(0, 242, 254, 0.07)' : 'transparent',
                      color: 'var(--text-muted)' 
                    }}>
                      {row.pressure} hPa
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {row.latitude?.toFixed(2)}°N, {row.longitude?.toFixed(2)}°E
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(5, 8, 19, 0.7)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing records {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} (from 125k+ indexed Oracle database table)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.78rem', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '0 8px', fontFamily: 'var(--font-mono)' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.78rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Attribution Note */}
      <div style={{
        marginTop: '16px',
        padding: '12px 18px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.74rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Prototype Dataset Notice: Realistic modeled observations based on IMD spatial distributions for hackathon demonstration.</span>
        <span style={{ color: 'var(--accent-cyan)' }}>Table: CLIMATE_INTEL_2026.CLIMATE_DATA</span>
      </div>
    </div>
  );
}
