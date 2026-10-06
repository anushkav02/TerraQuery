import {
  getHighestDailyRainfall,
  getHighestDailyRainfallByDistrict,
  compareDistricts
} from "./src/services/mongoQueryService.js";

console.log("\n🌧️ Highest rainfall:");

console.log(
  await getHighestDailyRainfall()
);

console.log("\n📍 Highest rainfall in DURG:");

console.log(
  await getHighestDailyRainfallByDistrict("DURG")
);

console.log("\n⚖️ DURG vs RAIPUR:");

console.log(
  await compareDistricts("DURG", "RAIPUR")
);