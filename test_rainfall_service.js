import {
    getDatasetInfo,
    getHighestDailyRainfall,
    getHighestDailyRainfallByState,
    getDistrictSummary,
    compareDistricts,
    getRainfallTrend,
    getRainfallAnomalies
} from "./src/services/climateDataService.js";

console.log("\n=== DATASET INFO ===");
console.log(getDatasetInfo());

console.log("\n=== HIGHEST DAILY RAINFALL: ALL INDIA ===");
console.log(getHighestDailyRainfall());

console.log("\n=== HIGHEST DAILY RAINFALL: CHHATTISGARH ===");
console.log(getHighestDailyRainfallByState("CHHATTISGARH"));

console.log("\n=== DURG SUMMARY ===");
console.log(getDistrictSummary("DURG"));

console.log("\n=== DURG VS RAIPUR ===");
console.log(compareDistricts("DURG", "RAIPUR"));

console.log("\n=== DURG RAINFALL TREND: FIRST 5 ===");
console.log(getRainfallTrend("DURG").slice(0, 5));

console.log("\n=== CHHATTISGARH RAINFALL ANOMALIES: FIRST 5 ===");
console.log(getRainfallAnomalies("CHHATTISGARH").slice(0, 5));