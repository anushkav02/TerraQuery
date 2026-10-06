import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DATASET_SCHEMA = `
MongoDB database: terraquery
Collection: rainfall

Each document has these fields:

_id: number
State: string
District: string
Date: string (YYYY-MM-DD)

Daily Actual: number
Daily Normal: number
Daily Departure Per: number
Daily Category: string

Weekly \\nActual: number
Weekly Normal: number
Weekly Departure Per: number
Weekly Category: string

Cumulative Date: string
Cumulative Actual: number
Cumulative Normal: number
Cumulative Departue Per: number
Cumulative \\nCategory: string

Monthly Date: string
Monthly Acutual: number
Monthly Normal: number
Monthly \\nDeparture Per: number
Monthly Category: string

IMPORTANT:
State and District values in the database are stored in UPPERCASE.
Examples: "CHHATTISGARH", "ODISHA", "DURG", "RAIPUR".
When filtering by State or District, always use uppercase values.
`;

export async function generateMongoQuery(question) {
  const prompt = `
You are a MongoDB query generator for a rainfall analytics system.

${DATASET_SCHEMA}

User question:
"${question}"

Generate a MongoDB query that answers the user's question.

Rules:
1. Use ONLY the "rainfall" collection fields listed above.
2. Generate READ-ONLY MongoDB operations.
3. Prefer aggregation pipelines for analytical questions.
4. Do not use insert, update, delete, drop, eval, or JavaScript execution.
5. Return ONLY valid JSON.
6. The JSON must have this exact structure:

{
  "operation": "find" | "aggregate",
  "filter": {},
  "projection": {},
  "sort": {},
  "limit": 10,
  "pipeline": []
}

7.For aggregate queries, use "operation": "aggregate" and put the pipeline in "pipeline".
8.For find queries, use "operation": "find" and put the filter in "filter".
9.Do not include markdown fences or explanations.
10. When the user asks "highest rainfall", "maximum rainfall", or "which record had the highest rainfall", interpret it as the single record with the maximum value of "Daily Actual", unless the user explicitly asks for total, average, or cumulative rainfall by district/state.
11. When the user asks "which district had the highest rainfall", return the district associated with the single highest "Daily Actual" record.
12. When comparing districts, calculate the requested statistics separately for each district.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text.trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Gemini returned invalid JSON:");
    console.error(text);
    throw new Error("Gemini generated an invalid MongoDB query.");
  }
}