# Research & Architecture Decisions: Website Content Calendar & Audit Engine

**Feature**: Website Content Calendar & Audit Engine  
**Branch**: `001-content-calendar-audit`  
**Date**: 2026-07-21  

---

## Technical Context & Decisions

### Decision 1: Application Stack & Architecture
- **Decision**: Node.js (v18+) with TypeScript / Express backend engine coupled with a modern Vite frontend UI.
- **Rationale**: Node.js allows fast async web crawling, fast HTML/sitemap parsing, and seamless sharing of TypeScript data types between backend audit engines and frontend visualizers.
- **Alternatives Considered**: 
  - *Python FastAPI*: Strong NLP capabilities, but slower frontend integration and extra runtime overhead for single-repo deployment.
  - *Pure static frontend*: Limited by CORS when scraping remote website domains or parsing full sitemaps directly in browser.

### Decision 2: 10-Field Metadata Schema Enforcement
- **Decision**: Use `Zod` schema validation to guarantee 100% schema compliance for every calendar entry before data persistence or UI presentation.
- **Schema Fields**:
  1. `publishDate`: string (YYYY-MM-DD)
  2. `blogTitle`: string (non-empty)
  3. `primaryKeyword`: string (non-empty)
  4. `secondaryKeywords`: string[] (array of strings)
  5. `searchIntent`: enum (`Informational`, `Commercial`, `Transactional`, `Navigational`)
  6. `targetAudience`: string
  7. `contentType`: string (e.g., `Blog Post`, `Trekking Itinerary`, `Guide`, `Comparison`, `FAQ Article`)
  8. `linkToBlog`: string (URL or path slug)
  9. `cta`: string (Call to Action)
  10. `priority`: enum (`High`, `Medium`, `Low`)
- **Rationale**: Fulfills Constitution Principle I with strict, runtime-enforced type safety and automated validation error reporting.

### Decision 3: Website Scraping & Content Indexing Engine
- **Decision**: Combine `Axios` HTTP client with `Cheerio` DOM parser and `fast-xml-parser` for sitemap.xml ingestion.
- **Rationale**: Highly reliable, lightweight scraping stack capable of extracting canonical URLs, `<title>`, meta descriptions, `<h1>` headers, published dates (meta `article:published_time`), and embedded FAQs (`FAQPage` JSON-LD schema).
- **Alternatives Considered**: 
  - *Puppeteer / Playwright*: Full browser headless automation is too slow and heavy for scanning 100+ blog posts. Axios + Cheerio yields sub-30s execution for 100 pages.

### Decision 4: Audit & Intelligence Algorithms
- **Decision**: Modular audit engine broken into 4 distinct analyzers:
  1. **Content Gap Analyzer**: Compares ingested site topics against keyword cluster taxonomies and search intent maps to detect unaddressed topics.
  2. **Outdated Blog Identifier**: Evaluates post age (>365 days), stale year references in titles (e.g., "Best Treks in 2023"), and missing structured data.
  3. **Seasonal Trekking Trip Engine**: Evaluates trekking/outdoor destination seasonal peaks (Spring: Mar-May, Autumn: Sep-Nov, Winter: Dec-Feb, Monsoon: Jun-Aug) and calculates target publish dates **60-90 days prior** to peak season.
  4. **FAQ Discovery Engine**: Scrapes existing page headings (`<h2>`/`<h3>` with question patterns) and search intent queries to construct structured FAQ pairs.

### Decision 5: Intent-Driven Priority Matrix
- **Decision**: Deterministic scoring system calculating priority (`High`, `Medium`, `Low`):
  - **High Priority Score**: 
    - Commercial/Transactional search intent with high content gap confidence.
    - Outdated high-performing blog post needing immediate refresh.
    - Seasonal trekking trip within 60-90 day publication window.
  - **Medium Priority Score**: 
    - Informational search intent in primary topic cluster.
    - Moderately outdated content (180-365 days old).
    - Standard FAQ items.
  - **Low Priority Score**: 
    - Long-tail informational queries, minor copy updates, or out-of-season topics.

### Decision 6: Multi-Format Exporters
- **Decision**: Native export service providing:
  - `JSON` (full audit report payload & calendar items)
  - `CSV` (formatted with exact 10 columns matching spreadsheet standards)
  - `Google Sheets payload` (compatible with `mcp-gsheets` tool format for direct Google Sheets sync)
