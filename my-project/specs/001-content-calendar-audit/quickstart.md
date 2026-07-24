# Quickstart Validation Guide: Website Content Calendar & Audit Engine

**Feature**: Website Content Calendar & Audit Engine  
**Branch**: `001-content-calendar-audit`  
**Date**: 2026-07-21  

---

## Overview

This guide details the end-to-end execution steps to run, test, and validate the **Website Content Calendar & Audit Engine**.

---

## Prerequisites & Installation

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

```bash
# Clone/navigate to project directory
cd my-project

# Install dependencies
npm install
```

---

## End-to-End Validation Steps

### Step 1: Run Unit & Contract Tests
Validate schema validation, priority matrix calculation, and 10-field invariant enforcement:

```bash
npm test
```

Expected output:
- `10-Field Schema Invariant`: PASS
- `Priority Scoring Engine`: PASS
- `Seasonal Trip 60-90 Day Lead Time`: PASS
- `Export CSV/JSON Format`: PASS

---

### Step 2: Audit a Website Domain (CLI or API)
Audit a target website to generate a complete content audit report and 10-field calendar:

```bash
npm run audit -- --url https://exampletrekking.com
```

Or trigger via REST API:

```bash
curl -X POST http://localhost:3000/api/audit/domain \
  -H "Content-Type: application/json" \
  -d '{"domainUrl": "https://exampletrekking.com", "maxPages": 50}'
```

Expected outcome:
- Audit report generated with:
  - 10-field Content Calendar (`publishDate`, `blogTitle`, `primaryKeyword`, `secondaryKeywords`, `searchIntent`, `targetAudience`, `contentType`, `linkToBlog`, `cta`, `priority`)
  - Content Gap Analysis
  - Outdated Blogs Needing Update
  - Seasonal Trekking Trips
  - FAQ Discovery List

---

### Step 3: Enrich Raw Post Ideas into Content Calendar
Input a raw list of post concepts and receive a populated, prioritized calendar:

```bash
curl -X POST http://localhost:3000/api/calendar/generate-from-posts \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [
      { "title": "Kedarkantha Trek Guide", "primaryKeyword": "kedarkantha trek" },
      { "title": "Top Winter Trekking Boots", "targetAudience": "Beginner Trekkers" }
    ]
  }'
```

---

### Step 4: Export Content Calendar
Export the generated calendar to CSV or JSON format:

```bash
curl "http://localhost:3000/api/calendar/export?auditId=latest&format=csv" -o content-calendar.csv
```

Open `content-calendar.csv` and verify all 10 column headers match:
`Publish Date, Blog Title, Primary Keyword, Secondary Keyword, Search Intent, Target Audience, Content Type, Link to Blog, CTA, Priority`.
