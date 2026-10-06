import { generateMongoQuery } from "./src/services/geminiQueryService.js";
import { executeGeneratedQuery } from "./src/services/mongoQueryService.js";
import { validateMongoQuery } from "./src/services/queryValidator.js";

const questions = [
  "Which district had the highest rainfall?",
  "What was the highest rainfall in Durg?",
  "Compare rainfall between Durg and Raipur"
];

for (const question of questions) {
  console.log("\n=================================");
  console.log("QUESTION:", question);

  try {
    const query = await generateMongoQuery(question);

    console.log("GEMINI GENERATED:");
    console.dir(query, { depth: null });

    validateMongoQuery(query);

    console.log("🛡️ Query validation: PASSED");

    const result = await executeGeneratedQuery(query);

    console.log("📊 REAL MONGODB RESULT:");
    console.dir(result, { depth: null });

  } catch (error) {
    console.error("ERROR:", error.message);
  }
}