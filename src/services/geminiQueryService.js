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
You are the query and visualization planner for a rainfall analytics system.

${DATASET_SCHEMA}

User question:
"${question}"

Your job has TWO parts:

PART 1 — Generate a MongoDB query
PART 2 — Decide the most useful visualization for the result.

Return ONLY valid JSON.

The JSON must have this exact structure:

{
  "query": {
    "operation": "find" | "aggregate",
    "filter": {},
    "projection": {},
    "sort": {},
    "limit": 10,
    "pipeline": []
  },
  "visualization": {
    "type": "kpi" | "map_highlight" | "comparison_bar" | "ranking_bar" | "line_trend" | "map" | "table" | "kpi_table" | "insight",
    "title": "string",
    "metric": "string",
    "unit": "string"
  }
}

MONGODB QUERY RULES:

1. Use ONLY the "rainfall" collection fields listed above.
2. Generate READ-ONLY MongoDB operations.
3. Prefer aggregation pipelines for analytical questions.
4. Do not use insert, update, delete, drop, eval, or JavaScript execution.
5. For aggregate queries, use "operation": "aggregate" and put the pipeline in "pipeline".
6. For find queries, use "operation": "find" and put the filter in "filter".
7. Do not include markdown fences or explanations.
8. When the user asks "highest rainfall", "maximum rainfall", or "which record had the highest rainfall", interpret it as the single record with the maximum value of "Daily Actual", unless the user explicitly asks for total, average, or cumulative rainfall by district/state.
9. When the user asks "which district had the highest rainfall", return the district associated with the single highest "Daily Actual" record.
10. When comparing districts, calculate the requested statistics separately for each district.

VISUALIZATION RULES:

1. Use "map_highlight" when the question asks for:
   - highest/lowest rainfall in a location
   - which district/state had the highest or lowest rainfall
   - a specific geographic location identified by the result
   - geographic risk or hotspot questions where a map adds useful context

2. Use "comparison_bar" when the user explicitly compares two or more districts/states.

3. Use "ranking_bar" when the user asks for:
   - top N districts/states
   - ranking
   - highest to lowest
   - lowest to highest
   - multiple ranked locations

4. Use "line_trend" when the user asks about:
   - rainfall over time
   - rainfall trend
   - change over dates
   - daily/monthly/yearly progression

5. Use "map" when the user asks about:
   - rainfall distribution across India
   - rainfall distribution across states/districts
   - geographic patterns
   - regional rainfall patterns

6. Use "kpi_table" when the user asks for a specific record or location and the result contains several useful fields.

7. Use "table" when the user requests multiple records or raw data.

8. Use "kpi" when the result is primarily one important numeric value and geographic visualization is not useful.

9. Use "insight" when the answer is mainly categorical or textual and a chart would not add meaningful information.

10. Prefer a geographic visualization over a simple chart when the question is explicitly about a geographic location and the result identifies a district or state.

IMPORTANT:
- Do NOT generate React code.
- Do NOT generate chart code.
- Do NOT invent visualization types outside the allowed list.
- The frontend will decide how to render each visualization type.
- "metric" should normally be "Daily Actual", "Daily Normal", "Daily Departure Per", "Cumulative Actual", or another field from the dataset.
- "unit" should normally be "mm", "%", or an appropriate simple unit.
- Keep the visualization title short and human-readable.
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
    const result = JSON.parse(text);

    // Keep backward compatibility with the existing backend.
    if (!result.query || !result.query.operation) {
      throw new Error("Gemini response is missing a MongoDB query.");
    }

    if (!result.visualization || !result.visualization.type) {
      throw new Error("Gemini response is missing visualization information.");
    }

    return result;
  } catch (error) {
    console.error("❌ Gemini returned invalid JSON:");
    console.error(text);
    throw new Error("Gemini generated an invalid query/visualization response.");
  }
}
export async function generateResultExplanation(question, results) {
  const prompt = `
You are the result explanation assistant for TerraQuery, a rainfall analytics system.

The system has already executed a validated read-only MongoDB query on the real IMD rainfall dataset.

User question:
"${question}"

MongoDB results:
${JSON.stringify(results, null, 2)}

Your job:
Explain the result clearly and concisely for a user.

Rules:
1. Use ONLY the information contained in the MongoDB results.
2. Do NOT invent, estimate, or assume any values.
3. Directly answer the user's question.
4. Mention the most important location, value, date, or comparison when available.
5. If multiple records are returned, summarize the important pattern rather than listing everything.
6. Keep the explanation to 2-3 sentences.
7. Do not mention MongoDB, Gemini, prompts, or internal implementation details.
8. If no records were found, clearly say that no matching rainfall records were found.
9. Return ONLY the explanation text. Do not return JSON or markdown.

`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  });

  return response.text.trim();
}