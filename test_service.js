import {
    getDatasetInfo,
    getHighestDailyRainfall
} from "./src/services/climateDataService.js";

console.log("=== DATASET INFO ===");
console.log(getDatasetInfo());

console.log("\n=== HIGHEST DAILY RAINFALL ===");

const result = getHighestDailyRainfall();

console.log("District:", result.District);
console.log("State:", result.State);
console.log("Date:", result.Date);
console.log("Rainfall:", result["Daily Actual"], "mm");