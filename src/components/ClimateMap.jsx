import React, { useEffect, useState } from 'react';
import { IndiaMap } from 'vardhan-maps/react';


  export default function ClimateMap({ highlightDistrict = null }) {
 
  const [stateRainfall, setStateRainfall] = useState([]);
  const [districtRainfall, setDistrictRainfall] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    async function fetchMapData() {
      try {
        const [stateResponse, districtResponse] = await Promise.all([
          fetch('http://localhost:5000/api/map/rainfall/states'),
          fetch('http://localhost:5000/api/map/rainfall')
        ]);

        const stateData = await stateResponse.json();
        const districtData = await districtResponse.json();

        if (stateData.success) {
          setStateRainfall(stateData.records);
        }

        if (districtData.success) {
          setDistrictRainfall(districtData.records);
        }
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      }
    }

    fetchMapData();
  }, []);

  const getRainfallColor = (rainfall) => {
  if (rainfall >= 150) return '#083344';
  if (rainfall >= 100) return '#0e7490';
  if (rainfall >= 50) return '#0891b2';
  if (rainfall >= 20) return '#22d3ee';
  if (rainfall >= 10) return '#67e8f9';
  return '#cffafe';
};

  const handleStateClick = (stateName, props) => {
  
  
    setSelectedState(stateName);
  };

  const handleDistrictClick = (districtName) => {
   
  };

  const normalizeStateName = (name) => {
  if (!name) return '';

  return name
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace('CHHATISGARH', 'CHHATTISGARH')
    .trim();
};
const normalizeDistrictName = (name) => {
  if (!name) return '';

  return name
    .toUpperCase()
    .replace(/[-_]/g, ' ')
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\bDISTRICT\b/g, '')
    .trim();
};
useEffect(() => {
  if (!highlightDistrict || districtRainfall.length === 0) return;
  
   

  const highlightedDistrict = districtRainfall.find(
    item =>
      normalizeDistrictName(item.district) ===
      normalizeDistrictName(highlightDistrict)
  );

  if (highlightedDistrict) {
    setSelectedState(highlightedDistrict.state);
  }
}, [highlightDistrict, districtRainfall]);

const filteredDistricts = selectedState
  ? districtRainfall.filter(
      item =>
        normalizeStateName(item.state) ===
        normalizeStateName(selectedState)
    )
  : [];
  
  console.log("Filtered districts:", filteredDistricts);
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '12px',
    color: '#cbd5e1'
  }}
>
  

  <div
  style={{
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '7px',
    padding: '10px 14px',
    marginBottom: '12px',
    borderRadius: '10px',
    background: 'rgba(15, 23, 42, 0.78)',
    border: '1px solid rgba(34, 211, 238, 0.2)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    color: '#cbd5e1'
  }}
>
  <span
    style={{
      fontSize: '10px',
      fontWeight: '600',
      letterSpacing: '1px',
      color: '#67e8f9'
    }}
  >
    RAINFALL INTENSITY
  </span>

  <div
    style={{
      width: '180px',
      height: '9px',
      borderRadius: '999px',
      background:
        'linear-gradient(to right, #cffafe, #67e8f9, #22d3ee, #0891b2, #0e7490, #083344)'
    }}
  />

  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '10px',
      color: '#94a3b8'
    }}
  >
    <span>Low</span>
    <span>High</span>
  </div>
</div>

  
</div>
      {selectedState && (
        <button
          onClick={() => setSelectedState(null)}
          style={{
            marginBottom: '12px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #22d3ee',
            background: 'transparent',
            color: '#22d3ee',
            cursor: 'pointer'
          }}
        >
          ← Back to India
        </button>
      )}

      <IndiaMap
        mode="svg"
        level={selectedState ? 'district' : 'state'}
        stateName={selectedState || undefined}
        width={800}
        height={600}
        titles={true}
        tooltip={true}

        stateFill={(name) => {
          const state = stateRainfall.find(
            item =>
              item.state?.toUpperCase() === name.toUpperCase()
          );

          if (!state) return '#e5e7eb';

          return getRainfallColor(state.maxRainfall);
        }}

        districtFill={(name) => {
          
          const district = filteredDistricts.find(item => {
  const datasetName = normalizeDistrictName(item.district);
  const mapName = normalizeDistrictName(name);

  return datasetName === mapName;
});

          if (!district) {
    

    return '#e5e7eb';
  }
          
         if (
  normalizeDistrictName(name) ===
  normalizeDistrictName(highlightDistrict)
) {
  return '#facc15';
}

return getRainfallColor(district.maxRainfall);
         
        }}

        onStateClick={handleStateClick}
        onDistrictClick={handleDistrictClick}
      />
    </div>
  );
}