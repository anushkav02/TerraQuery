import dataset from "./data/imd_rainfall.json" with { type: "json" };

console.log("=== IMD RAINFALL DATASET TEST ===");
console.log("Number of fields:", dataset.fields.length);
console.log("Number of records:", dataset.records.length);

console.log("\nField names:");
console.log(dataset.fields.map(field => field.id));

console.log("\nFirst 3 records:");
console.log(dataset.records.slice(0, 3));