import dataset from "./data/imd_rainfall.json" with { type: "json" };

const fields = dataset.fields.map(field => field.id);

const records = dataset.records.map(row => {
    const obj = {};

    fields.forEach((field, index) => {
        obj[field] = row[index];
    });

    return obj;
});

// Convert Daily Actual from text to number
records.forEach(record => {
    record["Daily Actual"] = parseFloat(record["Daily Actual"]);
});

// Find the record with the highest daily rainfall
const highest = records.reduce((max, record) => {
    if (isNaN(record["Daily Actual"])) return max;

    if (!max || record["Daily Actual"] > max["Daily Actual"]) {
        return record;
    }

    return max;
}, null);

console.log("=== HIGHEST DAILY RAINFALL ===");
console.log("District:", highest.District);
console.log("State:", highest.State);
console.log("Date:", highest.Date);
console.log("Rainfall:", highest["Daily Actual"], "mm");