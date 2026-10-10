# TERRAQUERY
### "AI-Powered Natural-Language Climate Intelligence"
**Powered by Google Gemini & MongoDB Atlas**

---

## 🌍 Overview

**TerraQuery** allows non-technical users (climate researchers, disaster management teams, NGOs, policy makers, and students) to ask complex questions about structured Earth and climate observation datasets in plain English — without writing database queries.

Built on **Google Gemini** and **MongoDB Atlas**, TerraQuery bridges document-oriented climate collections with Large Language Models while preserving mathematical ground truth: **the LLM translates language to structured MongoDB queries, while all calculations and metrics come directly from verified historical IMD rainfall records.**

---

## ⚡ The Core Pipeline

```
User asks question in plain English
                ↓
Frontend Web Dashboard (React + Vite + Deep Oceanic UI)
                ↓
Backend / API Layer (Validation + Security Sandboxing)
                ↓
Google Gemini 3.5 / 2.5 Flash (Structured Query Generation)
                ↓
Query Safety Validator (Enforces Read-Only, Rejects Write/DDL Ops)
                ↓
MongoDB Atlas Cluster (Collection: terraquery.rainfall)
                ↓
Actual Database Output Documents & Aggregations
                ↓
Analytics & Anomaly Detection (Statistical Baseline Departures)
                ↓
Automatic Visualization (Dynamic Charts + GIS Climate Visualizer)
                ↓
Grounded AI Explanation (Zero Hallucinations)
                ↓
User
```

---

## 🎯 Target Users & Value Proposition

- **Researchers & Scientists:** Detect multi-year precipitation trends and statistical anomalies without manual data manipulation scripts.
- **Disaster Management Teams:** Instantly identify precipitation anomalies (e.g. excess monsoon rainfall departures) to pre-position emergency relief.
- **Government Environment Departments:** Formulate district-level climate adaptation plans using verified historical records.
- **Policy Analysts & NGOs:** Evaluate agricultural monsoon stability, rainfall variability, and climate risk.

---

## 🚀 Supported Demo Queries

1. **"Which district had the highest rainfall in 2024?"**
   - Result: Top district ranked by annual rainfall accumulation.
   - Visual: Peak Ranking Bar Chart + Map Highlight
2. **"Compare rainfall between Durg and Raipur from 2020 to 2024."**
   - Result: Dual Bar Comparison Chart with multi-year trends.
3. **"Show the rainfall trend over the last 5 years."**
   - Result: Time-series curve with multi-year regressive slope.
4. **"Which districts experienced unusually high rainfall?"**
   - Result: Anomaly Diverging Chart (statistical deviation above historical baseline).
5. **"What was the average monsoon rainfall across districts?"**
   - Result: Regional aggregates and seasonal distribution.
6. **"Show me the top 5 districts by precipitation."**
   - Result: Ranked horizontal bar chart.
7. **"Will it rain tomorrow?"**
   - Guardrail Response: Safely explains dataset scope without hallucinating weather predictions.

---

## 🔒 Security & Zero-Hallucination Guarantee

1. **Deterministic Grounding:** All values displayed originate from verified documents in MongoDB Atlas. The LLM does not invent figures.
2. **Read-Only Enforcement:** Queries execute strictly under read-only permissions (`find`, `aggregate`). Mutations, DDL, and administrative commands are rejected before execution.
3. **Transparent Lineage:** The "Explain Query" inspector provides a step-by-step audit of Question → NLP Tokens → Generated MongoDB Query → Raw DB Result → Final Insight.
4. **Sealed Credentials:** Database connection URIs and Gemini API keys remain in server-side environment variables and are never exposed to browser clients.

---

## 🛠️ Local Development & Running

```bash
# 1. Start backend API server (runs on http://localhost:5000)
npm run server
# or: node server.js

# 2. Start frontend dev server (runs on http://localhost:3000)
npm run dev

# 3. Production Build
npm run build
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/terraquery?retryWrites=true&w=majority
MONGODB_DB=terraquery
MONGODB_COLLECTION=rainfall
```

When backend services are offline or credentials are not configured, TerraQuery seamlessly operates in Standby Mode with the local bundled IMD rainfall catalog.

---


