import { MongoClient } from "mongodb";
import "dotenv/config";
import fs from "fs";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

const filePath = "./data/imd_rainfall.json";
const dataset = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const fields = dataset.fields.map(field => field.id);

function convertValue(field, value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  // Integer ID
  if (field === "_id") {
    return Number(value);
  }

  // Rainfall / numeric fields
  const numericFields = [
    "Daily Actual",
    "Daily Normal",
    "Weekly \nActual",
    "Weekly Normal",
    "Cumulative Actual",
    "Cumulative Normal",
    "Monthly Acutual",
    "Monthly Normal"
  ];

  if (numericFields.includes(field)) {
    const number = Number(value);
    return Number.isNaN(number) ? null : number;
  }

  // Percentage fields
  const percentageFields = [
    "Daily Departure Per",
    "Weekly Departure Per",
    "Cumulative Departue Per",
    "Monthly \nDeparture Per"
  ];

  if (percentageFields.includes(field)) {
    const number = Number(String(value).replace("%", ""));
    return Number.isNaN(number) ? null : number;
  }

  return value;
}

const documents = dataset.records.map(record => {
  const document = {};

  fields.forEach((field, index) => {
    document[field] = convertValue(field, record[index]);
  });

  return document;
});

try {
  console.log(`📦 Preparing ${documents.length} records...`);

  await client.connect();

  const db = client.db("terraquery");
  const collection = db.collection("rainfall");

  // Remove old import if this script is run again
  await collection.deleteMany({});

  // Insert in batches
  const batchSize = 1000;

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);

    await collection.insertMany(batch, {
      ordered: false
    });

    console.log(
      `✅ Imported ${Math.min(i + batchSize, documents.length)} / ${documents.length}`
    );
  }

  // Useful indexes for TerraQuery queries
  await collection.createIndex({ State: 1 });
  await collection.createIndex({ District: 1 });
  await collection.createIndex({ Date: 1 });
  await collection.createIndex({ "Daily Actual": -1 });

  const count = await collection.countDocuments();

  console.log("\n🎉 Import completed!");
  console.log(`MongoDB documents: ${count}`);

} catch (error) {
  console.error("\n❌ Import failed:");
  console.error(error);

} finally {
  await client.close();
}