import dataset from "../../data/imd_rainfall.json" with { type: "json" };

const fields = dataset.fields.map(field => field.id);

// Convert array-based records into normal JavaScript objects
const records = dataset.records.map(row => {
    const record = {};

    fields.forEach((field, index) => {
        record[field] = row[index];
    });

    // Numeric fields
    record["_id"] = Number(record["_id"]);
    record["Daily Actual"] = parseFloat(record["Daily Actual"]);
    record["Daily Normal"] = parseFloat(record["Daily Normal"]);
    record["Weekly \nActual"] = parseFloat(record["Weekly \nActual"]);
    record["Weekly Normal"] = parseFloat(record["Weekly Normal"]);
    record["Cumulative Actual"] = parseFloat(record["Cumulative Actual"]);
    record["Cumulative Normal"] = parseFloat(record["Cumulative Normal"]);
    record["Monthly Acutual"] = parseFloat(record["Monthly Acutual"]);
    record["Monthly Normal"] = parseFloat(record["Monthly Normal"]);

    // Convert percentage strings such as "-94%" or "31%" to numbers
    record["Daily Departure Per"] = parsePercentage(
        record["Daily Departure Per"]
    );

    record["Weekly Departure Per"] = parsePercentage(
        record["Weekly Departure Per"]
    );

    record["Cumulative Departue Per"] = parsePercentage(
        record["Cumulative Departue Per"]
    );

    record["Monthly \nDeparture Per"] = parsePercentage(
        record["Monthly \nDeparture Per"]
    );

    return record;
});

function parsePercentage(value) {
    if (typeof value === "number") {
        return value;
    }

    if (typeof value !== "string") {
        return NaN;
    }

    return parseFloat(value.replace("%", ""));
}


// ============================================================
// BASIC DATA ACCESS
// ============================================================

export function getAllRecords() {
    return records;
}

export function getDatasetInfo() {
    return {
        fields,
        recordCount: records.length
    };
}


// ============================================================
// HIGHEST DAILY RAINFALL
// ============================================================

export function getHighestDailyRainfall() {
    return records.reduce((max, record) => {
        const rainfall = record["Daily Actual"];

        if (isNaN(rainfall)) {
            return max;
        }

        if (!max || rainfall > max["Daily Actual"]) {
            return record;
        }

        return max;
    }, null);
}


// ============================================================
// FILTER BY STATE
// ============================================================

export function getRecordsByState(state) {
    const target = state.trim().toUpperCase();

    return records.filter(record =>
        String(record.State).trim().toUpperCase() === target
    );
}


// ============================================================
// FILTER BY DISTRICT
// ============================================================

export function getRecordsByDistrict(district) {
    const target = district.trim().toUpperCase();

    return records.filter(record =>
        String(record.District).trim().toUpperCase() === target
    );
}


// ============================================================
// HIGHEST DAILY RAINFALL IN A STATE
// ============================================================

export function getHighestDailyRainfallByState(state) {
    const stateRecords = getRecordsByState(state);

    return stateRecords.reduce((max, record) => {
        const rainfall = record["Daily Actual"];

        if (isNaN(rainfall)) {
            return max;
        }

        if (!max || rainfall > max["Daily Actual"]) {
            return record;
        }

        return max;
    }, null);
}


// ============================================================
// HIGHEST DAILY RAINFALL BY DISTRICT
// ============================================================

export function getHighestDailyRainfallByDistrict(district) {
    const districtRecords = getRecordsByDistrict(district);

    return districtRecords.reduce((max, record) => {
        const rainfall = record["Daily Actual"];

        if (isNaN(rainfall)) {
            return max;
        }

        if (!max || rainfall > max["Daily Actual"]) {
            return record;
        }

        return max;
    }, null);
}


// ============================================================
// DISTRICT SUMMARY
// ============================================================

export function getDistrictSummary(district) {
    const districtRecords = getRecordsByDistrict(district);

    if (!districtRecords.length) {
        return null;
    }

    const rainfallValues = districtRecords
        .map(r => r["Daily Actual"])
        .filter(v => !isNaN(v));

    const total = rainfallValues.reduce((sum, value) => sum + value, 0);

    const average = rainfallValues.length
        ? total / rainfallValues.length
        : 0;

    const highest = Math.max(...rainfallValues);

    return {
        district: districtRecords[0].District,
        state: districtRecords[0].State,
        recordCount: districtRecords.length,
        totalDailyRainfall: Number(total.toFixed(2)),
        averageDailyRainfall: Number(average.toFixed(2)),
        highestDailyRainfall: highest
    };
}


// ============================================================
// COMPARE TWO DISTRICTS
// ============================================================

export function compareDistricts(districtA, districtB) {
    const summaryA = getDistrictSummary(districtA);
    const summaryB = getDistrictSummary(districtB);

    return {
        districtA: summaryA,
        districtB: summaryB
    };
}


// ============================================================
// RAINFALL TREND
// ============================================================

export function getRainfallTrend(district) {
    const districtRecords = getRecordsByDistrict(district);

    return districtRecords
        .filter(record => !isNaN(record["Daily Actual"]))
        .map(record => ({
            date: record.Date,
            rainfall: record["Daily Actual"],
            normal: record["Daily Normal"],
            departure: record["Daily Departure Per"],
            category: record["Daily Category"]
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}


// ============================================================
// EXCESS / DEFICIT RAINFALL
// ============================================================

export function getRainfallAnomalies(state = null) {
    const sourceRecords = state
        ? getRecordsByState(state)
        : records;

    return sourceRecords
        .filter(record => !isNaN(record["Daily Departure Per"]))
        .filter(record => Math.abs(record["Daily Departure Per"]) >= 20)
        .map(record => ({
            state: record.State,
            district: record.District,
            date: record.Date,
            rainfall: record["Daily Actual"],
            normal: record["Daily Normal"],
            departure: record["Daily Departure Per"],
            category: record["Daily Category"]
        }));
}