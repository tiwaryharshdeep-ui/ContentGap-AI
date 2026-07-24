# Content Calendar & Audit Engine Documentation

## Overview
The **Content Calendar & Audit Engine** is a comprehensive system designed to analyze website domains or custom post inventories and produce structured, highly optimized **10-Field Content Calendars** along with multi-dimensional SEO content intelligence.

---

## The 10-Field Mandatory Content Calendar Metadata Schema

Every generated content calendar entry strictly contains all 10 mandatory metadata fields:

| Field Number | Field Name | Description & Format |
|--------------|------------|----------------------|
| 1 | `Publish Date` | Scheduled publication date in `YYYY-MM-DD` format |
| 2 | `Blog Title` | Proposed headline or existing published blog title |
| 3 | `Primary Keyword` | Main search keyword target |
| 4 | `Secondary Keyword` | Comma-separated supporting keywords array |
| 5 | `Search Intent` | Enum: `Informational`, `Commercial`, `Transactional`, `Navigational` |
| 6 | `Target Audience` | Specific user persona or demographic targeted |
| 7 | `Content Type` | Format classification (e.g. `Comprehensive Guide`, `Itinerary`, `Comparison`) |
| 8 | `Link to Blog` | Canonical URL or planned slug path |
| 9 | `CTA` | Actionable Call-To-Action instruction |
| 10 | `Priority` | Enum: `High`, `Medium`, `Low` |

---

## Audit Intelligence Capabilities

1. **Content Gap Analysis**: Compares website coverage against high-volume search intents in the niche to identify missing topic clusters.
2. **Outdated Blog Identification**: Detects articles >365 days old or containing stale years (e.g. 2023) in headlines, generating actionable refresh suggestions.
3. **Seasonal Trekking Trip Engine**: Schedules seasonal outdoor trips **60–90 days prior** to peak seasonal demand (e.g. Winter Treks scheduled in October for December peak).
4. **FAQ Discovery**: Extracts question patterns and target queries for structured snippet optimization.

---

## API Endpoints

### 1. `POST /api/audit/domain`
Runs a full domain crawl and multi-dimensional audit.

**Request**:
```json
{
  "domainUrl": "https://exampletrekking.com",
  "maxPages": 50
}
```

**Response**: Returns complete `ContentAuditReport` containing `contentGaps`, `outdatedBlogs`, `seasonalTrips`, `faqOpportunities`, and 10-field `calendar`.

---

### 2. `POST /api/calendar/generate-from-posts`
Enriches raw post headlines or concepts into complete 10-field content calendar items.

**Request**:
```json
{
  "posts": [
    { "title": "Kedarkantha Winter Snow Trek Guide", "primaryKeyword": "kedarkantha trek" },
    { "title": "Top 10 High Altitude Trekking Boots" }
  ]
}
```

---

### 3. `GET /api/calendar/export`
Exports content calendar and audit report.

**Query Parameters**:
- `auditId`: string (default: `"latest"`)
- `format`: `"csv"` | `"json"` | `"gsheets"`

---

## Running Locally

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start REST Server & Web Dashboard UI
npm start
```

Access the interactive dashboard UI at `http://localhost:3000`.
