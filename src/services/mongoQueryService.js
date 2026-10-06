import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
});

let collection = null;

async function getCollection() {
  if (!collection) {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    collection = client
      .db("terraquery")
      .collection("rainfall");
  }

  return collection;
}

async function getHighestDailyRainfall() {
  const db = await getCollection();

  return await db
    .find({})
    .sort({ "Daily Actual": -1 })
    .limit(1)
    .toArray();
}

async function getHighestDailyRainfallByState(state) {
  const db = await getCollection();

  return await db
    .find({ State: state.toUpperCase() })
    .sort({ "Daily Actual": -1 })
    .limit(1)
    .toArray();
}

async function getHighestDailyRainfallByDistrict(district) {
  const db = await getCollection();

  return await db
    .find({ District: district.toUpperCase() })
    .sort({ "Daily Actual": -1 })
    .limit(1)
    .toArray();
}

async function getRecordsByDistrict(district) {
  const db = await getCollection();

  return await db
    .find({ District: district.toUpperCase() })
    .sort({ Date: 1 })
    .toArray();
}

async function getRecordsByState(state) {
  const db = await getCollection();

  return await db
    .find({ State: state.toUpperCase() })
    .sort({ Date: 1 })
    .toArray();
}

async function compareDistricts(districtA, districtB) {
  const db = await getCollection();

  return await db
    .aggregate([
      {
        $match: {
          District: {
            $in: [
              districtA.toUpperCase(),
              districtB.toUpperCase()
            ]
          }
        }
      },
      {
        $group: {
          _id: "$District",
          averageRainfall: { $avg: "$Daily Actual" },
          totalRainfall: { $sum: "$Daily Actual" },
          maximumRainfall: { $max: "$Daily Actual" },
          recordCount: { $sum: 1 }
        }
      }
    ])
    .toArray();
}

export {
  getHighestDailyRainfall,
  getHighestDailyRainfallByState,
  getHighestDailyRainfallByDistrict,
  getRecordsByDistrict,
  getRecordsByState,
  compareDistricts
};
export async function executeGeneratedQuery(query) {
  const collection = await getCollection();

  if (!query || !query.operation) {
    throw new Error("Invalid MongoDB query.");
  }

  if (query.operation === "aggregate") {
    return await collection
      .aggregate(query.pipeline || [])
      .toArray();
  }

  if (query.operation === "find") {
    return await collection
      .find(query.filter || {}, {
        projection: query.projection || {},
      })
      .sort(query.sort || {})
      .limit(query.limit || 10)
      .toArray();
  }

  throw new Error(`Unsupported MongoDB operation: ${query.operation}`);
}
export async function getDistrictRainfallMapData() {
  const collection = await getCollection();

  return await collection.aggregate([
    {
      $group: {
        _id: "$District",
        state: { $first: "$State" },
        maxRainfall: { $max: "$Daily Actual" },
        avgRainfall: { $avg: "$Daily Actual" },
        totalRainfall: { $sum: "$Daily Actual" }
      }
    },
    {
      $sort: { maxRainfall: -1 }
    },
    {
      $project: {
        _id: 0,
        district: "$_id",
        state: 1,
        maxRainfall: 1,
        avgRainfall: 1,
        totalRainfall: 1
      }
    }
  ]).toArray();
}