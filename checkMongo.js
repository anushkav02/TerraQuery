import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();

  const collection = client
    .db("terraquery")
    .collection("rainfall");

  // 1. Count
  const count = await collection.countDocuments();
  console.log("📊 Total records:", count);

  // 2. Highest daily rainfall
  const highest = await collection
    .find({})
    .sort({ "Daily Actual": -1 })
    .limit(1)
    .toArray();

  console.log("\n🌧️ Highest Daily Rainfall:");
  console.log(highest[0]);

  // 3. One district example
  const districtData = await collection
    .find({ District: "DURG" })
    .limit(3)
    .toArray();

  console.log("\n📍 Sample DURG records:");
  console.log(districtData);

} catch (error) {
  console.error("❌ MongoDB query failed:");
  console.error(error);
} finally {
  await client.close();
}