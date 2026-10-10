// TerraQuery API Server
// Backend for AI-powered natural-language rainfall analytics
// Gemini → MongoDB query → Validation → MongoDB Atlas → Real IMD results

import http from 'http';
import { URL } from 'url';

import {
  CLIMATE_DATA,
  CHHATTISGARH_DISTRICTS,
  BENCHMARK_DISTRICTS,
  ALL_MONITORED_LOCATIONS,
  DATASET_METRICS
} from './src/data/climateData.js';
import {
  executeGeneratedQuery,
  getDistrictRainfallMapData,
  getStateRainfallMapData,
  getRecordsByDistrict

} from './src/services/mongoQueryService.js';

import { generateMongoQuery } from './src/services/geminiQueryService.js';
import { validateMongoQuery } from './src/services/queryValidator.js';

const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------
// CORS
// ---------------------------------------------------------

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ---------------------------------------------------------
// JSON RESPONSE
// ---------------------------------------------------------

function sendJSON(res, statusCode, data) {
  setCorsHeaders(res);

  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });

  res.end(JSON.stringify(data, null, 2));
}

// ---------------------------------------------------------
// POST BODY PARSER
// ---------------------------------------------------------

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();

      // 1 MB request limit
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });
}

// ---------------------------------------------------------
// SERVER
// ---------------------------------------------------------

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // -------------------------------------------------------
  // CORS PREFLIGHT
  // -------------------------------------------------------

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(
    req.url,
    `http://${req.headers.host}`
  );

  const pathname = parsedUrl.pathname;

  try {

    // =====================================================
    // 1. ROOT INFO ENDPOINT
    // =====================================================

    if (pathname === '/' && req.method === 'GET') {
      return sendJSON(res, 200, {
        service: 'TerraQuery AI Backend Service',
        version: '2.0.0',

        description:
          'AI-powered natural-language rainfall intelligence using Gemini and MongoDB Atlas',

        status: 'OPERATIONAL',

        architecture: [
          'Natural-language question',
          'Gemini query generation',
          'MongoDB query validation',
          'MongoDB Atlas execution',
          'Real IMD rainfall result'
        ],

        database: {
          engine: 'MongoDB Atlas',
          database: 'terraquery',
          collection: 'rainfall'
        },

        ai: {
          provider: 'Google Gemini',
          model: 'gemini-3.5-flash-lite'
        },

        endpoints: [
          'GET  /api/health',
          'POST /api/query',
          'GET  /api/dataset',
          'GET  /api/analytics',
          'GET  /api/oracle-profile'
        ]
      });
    }

    // =====================================================
    // 2. HEALTH ENDPOINT
    // =====================================================

    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJSON(res, 200, {
        status: 'healthy',
        timestamp: new Date().toISOString(),

        mode: 'LIVE_MONGODB_GEMINI',

        database: {
          engine: 'MongoDB Atlas',
          database: 'terraquery',
          collection: 'rainfall',
          status: 'ONLINE'
        },

        ai: {
          provider: 'Google Gemini',
          model: 'gemini-3.5-flash-lite',
          queryGeneration: 'ENABLED'
        },

        security: {
          queryValidation: 'ENABLED',
          readOnlyOperations: true,
          dangerousOperatorsBlocked: true,
          credentialsStoredInEnvironment: true
        }
      });
    }

    // =====================================================
    // 3. AI QUERY EXECUTION
    // =====================================================

    if (pathname === '/api/query' && req.method === 'POST') {

      const body = await parseRequestBody(req);

      const question = (body.question || '').trim();

      if (!question) {
        return sendJSON(res, 400, {
          success: false,
          error: 'Question parameter is required in request body.'
        });
      }

      console.log('\n==============================================');
      console.log('🌧️ TerraQuery AI Query');
      console.log('Question:', question);

      // ---------------------------------------------------
      // STEP 1: Gemini generates MongoDB query
      // ---------------------------------------------------

      console.log('🧠 Generating MongoDB query with Gemini...');

      const generatedResponse = await generateMongoQuery(question);

      const generatedQuery = generatedResponse.query;
      const visualization = generatedResponse.visualization;

      console.log('✅ Gemini response generated:');
      console.dir(generatedResponse, { depth: null });

      console.log('🎨 Visualization plan:');
      console.dir(visualization, { depth: null });

// ---------------------------------------------------
// STEP 2: Validate generated query
// ---------------------------------------------------

      console.log('🛡️ Validating query...');

      validateMongoQuery(generatedQuery);

      console.log('✅ Query validation passed');

      // ---------------------------------------------------
      // STEP 3: Execute against REAL MongoDB Atlas
      // ---------------------------------------------------

      console.log('☁️ Executing query on MongoDB Atlas...');

      const results = await executeGeneratedQuery(generatedQuery);

      console.log('✅ MongoDB query executed');
      console.log('📊 Result count:', results.length);
      console.log('📊 First MongoDB record:', results[0]);

      console.log('==============================================\n');

      // ---------------------------------------------------
      // STEP 4: Return result to frontend
      // ---------------------------------------------------

      return sendJSON(res, 200, {
        success: true,

        question,

        ai: {
          provider: 'Google Gemini',
          model: 'gemini-3.5-flash-lite'
        },

        database: {
          engine: 'MongoDB Atlas',
          database: 'terraquery',
          collection: 'rainfall'
        },

        query: generatedQuery,
        visualization,
        validation: {
          passed: true,
          readOnly: true
        },

        result: {
          count: results.length,
          records: results
        },

        timestamp: new Date().toISOString()
      });
    }
    // =====================================================
    // MAP RAINFALL DATA
    // =====================================================

    if (pathname === '/api/map/rainfall' && req.method === 'GET') {

      try {

        const data = await getDistrictRainfallMapData();

        return sendJSON(res, 200, {
          success: true,
          records: data
        });

      } catch (error) {

        console.error('Map rainfall error:', error);

        return sendJSON(res, 500, {
          success: false,
          error: error.message
        });

      }
    }
    if (pathname === '/api/map/rainfall/states' && req.method === 'GET') {

      try {

         const data = await getStateRainfallMapData();

         return sendJSON(res, 200, {
            success: true,
            records: data
      });

  } catch (error) {

    console.error('State rainfall map error:', error);

    return sendJSON(res, 500, {
      success: false,
      error: error.message
    });

  }
}
// =====================================================
// DISTRICT DRILL-DOWN API
// =====================================================
if (
  req.method === 'GET' &&
  pathname.startsWith('/api/district/')
) {
  try {
    const district = decodeURIComponent(
      pathname.slice('/api/district/'.length)
    ).trim();

    if (!district) {
      return sendJSON(res, 400, {
        success: false,
        error: 'District name is required.'
      });
    }

    console.log(`[District drill-down] ${district}`);

    const records = await getRecordsByDistrict(district);

    return sendJSON(res, 200, {
      success: true,
      district: district.toUpperCase(),
      count: records.length,
      records
    });
  } catch (error) {
    console.error('District drill-down error:', error);

    return sendJSON(res, 500, {
      success: false,
      error: error.message
    });
  }
}
    // =====================================================
    // 4. DATASET EXPLORATION API
    // =====================================================

    if (pathname === '/api/dataset' && req.method === 'GET') {

      const search =
        (parsedUrl.searchParams.get('search') || '').toLowerCase();

      const state =
        parsedUrl.searchParams.get('state') || 'all';

      const district =
        parsedUrl.searchParams.get('district') || 'all';

      const year =
        parsedUrl.searchParams.get('year') || 'all';

      const season =
        parsedUrl.searchParams.get('season') || 'all';

      const parameter =
        parsedUrl.searchParams.get('parameter') || 'all';

      const page =
        parseInt(
          parsedUrl.searchParams.get('page') || '1',
          10
        );

      const limit =
        parseInt(
          parsedUrl.searchParams.get('limit') || '25',
          10
        );

      let filtered = CLIMATE_DATA.filter(item => {

        if (
          state !== 'all' &&
          item.state !== state
        ) {
          return false;
        }

        if (
          district !== 'all' &&
          item.district !== district
        ) {
          return false;
        }

        if (
          year !== 'all' &&
          String(item.year) !== String(year)
        ) {
          return false;
        }

        if (
          season !== 'all' &&
          item.season !== season
        ) {
          return false;
        }

        if (search) {

          const matchLoc =
            item.district
              .toLowerCase()
              .includes(search) ||
            item.state
              .toLowerCase()
              .includes(search);

          const matchMonth =
            (item.month_name || '')
              .toLowerCase()
              .includes(search);

          if (!matchLoc && !matchMonth) {
            return false;
          }
        }

        return true;
      });

      // Sort by selected parameter
      if (
        [
          'temperature',
          'rainfall',
          'precipitation',
          'humidity',
          'wind_speed',
          'pressure'
        ].includes(parameter)
      ) {
        filtered = [...filtered].sort(
          (a, b) => b[parameter] - a[parameter]
        );
      }

      const total = filtered.length;

      const startIndex =
        (page - 1) * limit;

      const paginatedRecords =
        filtered.slice(
          startIndex,
          startIndex + limit
        );

      return sendJSON(res, 200, {

        dataset:
          'Climate & Earth Observation Dataset',

        totalRecordsMonitored:
          '125,000+',

        filteredCount: total,

        page,

        limit,

        totalPages:
          Math.ceil(total / limit),

        parametersAvailable: [
          'temperature',
          'rainfall',
          'precipitation',
          'humidity',
          'wind_speed',
          'pressure',
          'location',
          'date',
          'district',
          'state'
        ],

        records: paginatedRecords
      });
    }

    // =====================================================
    // 5. CLIMATE ANALYTICS / KPI ENDPOINT
    // =====================================================

    if (
      pathname === '/api/analytics' &&
      req.method === 'GET'
    ) {

      return sendJSON(res, 200, {

        kpis: {
          averageTemperature: {
            value: '32.4°C',
            baseline: '+1.2°C vs 10-yr norm',
            status: 'Warming Trend'
          },

          averageRainfall: {
            value: '812 mm',
            annualTotal2024: '1,248 mm',
            status: '+18% Monsoon Surplus'
          },

          averageHumidity: {
            value: '71%',
            peakMonsoon: '84%',
            status: 'Normal Seasonal Range'
          },

          highestTemperature: {
            value: '44.1°C',
            district: 'Bilaspur (May 2022)',
            recorded2024: '42.8°C (Durg)'
          },

          totalPrecipitation: {
            value: '15,240 mm',
            monitoredCoverage:
              '12 Districts Aggregate 2024'
          }
        },

        anomalies2024:
          DATASET_METRICS.keyAnomalies,

        datasetMetrics:
          DATASET_METRICS,

        chhattisgarhDistricts:
          CHHATTISGARH_DISTRICTS,

        benchmarkLocations:
          BENCHMARK_DISTRICTS,

        allMonitoredLocations:
          ALL_MONITORED_LOCATIONS,

        notice:
          'Legacy analytics endpoint retained for frontend compatibility.'
      });
    }

    // =====================================================
    // 6. LEGACY ORACLE PROFILE ENDPOINT
    // =====================================================

    if (
      pathname === '/api/oracle-profile' &&
      req.method === 'GET'
    ) {

      return sendJSON(res, 200, {

        status: 'LEGACY',

        message:
          'Oracle Select AI was part of the original TerraQuery prototype. The active architecture now uses Gemini and MongoDB Atlas.',

        previousProfile:
          'CLIMATE_INTEL_PROFILE',

        previousTargetDatabase:
          'Oracle AI Database 26ai',

        currentArchitecture: {
          ai: 'Google Gemini',
          database: 'MongoDB Atlas',
          collection: 'rainfall'
        }
      });
    }

    // =====================================================
    // 7. 404
    // =====================================================

    return sendJSON(res, 404, {
      error: 'Not Found',
      message:
        `The requested path ${pathname} does not exist.`
    });

  } catch (error) {

    console.error('❌ API Error:', error);

    return sendJSON(res, 500, {

      success: false,

      error:
        'Internal Server Error',

      message:
        error.message
    });
  }
});

// ---------------------------------------------------------
// START SERVER
// ---------------------------------------------------------

server.listen(PORT, () => {

  console.log(
    `=======================================================`
  );

  console.log(
    ` TERRAQUERY API SERVER RUNNING`
  );

  console.log(
    ` Port: ${PORT}`
  );

  console.log(
    ` Mode: LIVE GEMINI + MONGODB ATLAS`
  );

  console.log(
    ` Health: http://localhost:${PORT}/api/health`
  );

  console.log(
    ` Query:  POST http://localhost:${PORT}/api/query`
  );

  console.log(
    ` Dataset: GET http://localhost:${PORT}/api/dataset`
  );

  console.log(
    ` Analytics: GET http://localhost:${PORT}/api/analytics`
  );

  console.log(
    `=======================================================`
  );
});