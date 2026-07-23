# 🚀 Auditify: Website Content Calendar & Multi-Dimensional Content Audit Engine

![Project License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![Express](https://img.shields.io/badge/Express-4.19-lightgrey)
![Vitest](https://img.shields.io/badge/Tests-18%20Passed-emerald)

**Auditify** is an end-to-end full-stack application that automatically crawls website domains/sitemaps, audits content health, discovers missing topic gaps, flags outdated posts, factors in 60-90 day seasonal demand lead times, and generates a structured 10-field content calendar exportable to Excel, CSV, JSON, and Google Sheets.

---

## 🌟 Key Features

- **🌐 Domain & Sitemap Crawler:** Extracts structured post metadata and URL architecture using Axios and Cheerio.
- **🔍 Multi-Dimensional Content Audit:**
  - **Content Gaps:** Identifies missing high-intent blog topics.
  - **Outdated Blogs:** Flags stale content requiring refresh actions.
  - **Seasonal Trekking Engine:** Maps 60-90 day lead-time windows for peak season travel.
  - **FAQ Opportunities:** Discovers target questions for voice and direct search optimization.
- **🗓️ 10-Field Content Calendar Generator:** Creates 30, 60, or 90-day publishing roadmaps mapped across 10 mandatory metadata fields:
  1. `publishDate` 2. `blogTitle` 3. `primaryKeyword` 4. `secondaryKeywords` 5. `searchIntent` 
  6. `targetAudience` 7. `contentType` 8. `linkToBlog` 9. `cta` 10. `priority`
- **📝 Instant 2000-Word SEO Article Generator:** Generates formatted blog articles with visual banners and downloadable Markdown (`.md`) exports.
- **📊 Multi-Format Export Center:** 1-click export to Excel Workbooks (`.xlsx`), CSV, JSON payloads, and Google Sheets API arrays.
- **🌓 Responsive Dark & Light UI Dashboard:** Built with CSS custom variables, smooth transitions, and persistent user preferences.
- **🔒 Email Rate Limiter Middleware:** Protects against unauthorized automated web scraping using single-use quota controls.

---

## 💻 Tech Stack

- **Frontend:** HTML5, Modern CSS3 Design Tokens (Dark/Light Modes), ES6+ JavaScript
- **Backend:** Node.js, Express.js (REST API Architecture), TypeScript 5.3
- **Scraping & Parsing:** Axios, Cheerio, Fast-XML-Parser
- **Validation:** Zod Schema Middleware
- **Export Engines:** ExcelJS, CSV Generator
- **Testing:** Vitest (18 Unit & Contract Test Cases)
- **Deployment:** Render Blueprint (`render.yaml`)

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/auditify-content-engine.git
cd auditify-content-engine
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Build & Run Locally
```bash
# Build TypeScript and Frontend Assets
npm run build

# Start Production Server
npm start

# Run in Development Watch Mode
npm run dev
```

Open your browser and visit `http://localhost:3000` to view the interactive dashboard.

---

## 🧪 Running Automated Tests

Run the Vitest test suite to verify contract and schema invariants:
```bash
npm test
```

---

## 📁 Project Structure

```
├── docs/                 # Documentation & API Specifications
├── specs/                # Feature specs, data models & task checklists
├── src/
│   ├── api/              # Express API routers & middleware
│   ├── frontend/         # Visual Dashboard (index.html, styles, JS)
│   ├── models/           # Zod schemas & TypeScript interfaces
│   ├── services/         # Scraper, Audit, Priority, Export & Blog Services
│   └── index.ts          # Server entry point
├── tests/                # Contract & Unit Test Suites
├── package.json          # Project dependencies & scripts
├── render.yaml           # Render deployment configuration
├── tsconfig.json         # TypeScript compiler configuration
└── vitest.config.ts      # Vitest test framework configuration
```

---

## 🚀 Deploy to Render

This repository includes a pre-configured `render.yaml` blueprint file for zero-config deployment on Render.com:

1. Push code to GitHub.
2. Log into [Render.com](https://render.com) and create a **New Web Service**.
3. Select your repository. Render automatically reads `render.yaml` and deploys your live service.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
