# Implementation Plan: Website Content Calendar & Audit Engine

**Branch**: `001-content-calendar-audit` | **Date**: 2026-07-21 | **Spec**: [spec.md](file:///C:/Users/Pradeep/Desktop/New%20folder/my-project/specs/001-content-calendar-audit/spec.md)

**Input**: Feature specification from `/specs/001-content-calendar-audit/spec.md`

## Summary

The Website Content Calendar & Audit Engine ingests target website URLs, sitemaps, or raw post concepts and automatically generates a structured 10-field content calendar (`Publish Date`, `Blog Title`, `Primary Keyword`, `Secondary Keyword`, `Search Intent`, `Target Audience`, `Content Type`, `Link to Blog`, `CTA`, `Priority`). 

Additionally, the system executes automated multi-dimensional content audits identifying **Content Gaps**, **Outdated Blogs Needing Updates**, **Seasonal Trekking Trips** (scheduled 60–90 days ahead of peak season), and **FAQ Opportunities**.

## Technical Context

**Language/Version**: Node.js (v18+) & TypeScript 5+  
**Primary Dependencies**: Express, Axios, Cheerio, fast-xml-parser, Zod, Vite, React (for visual dashboard UI)  
**Storage**: In-memory audit cache, local file persistence (JSON/CSV export format)  
**Testing**: Vitest / Jest (Unit, Contract, 10-field Schema Validation)  
**Target Platform**: Web application & REST API microservice  
**Project Type**: Web Application + REST Service  
**Performance Goals**: Complete domain crawl & audit analysis under 30 seconds for 100 pages  
**Constraints**: 100% adherence to the 10-field metadata schema per calendar entry  
**Scale/Scope**: Supports multi-domain indexing up to 500 pages per audit run  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **10-Field Mandatory Metadata Schema Gate**: PASS - Enforced via Zod runtime schema in [contracts/calendar-api.json](file:///C:/Users/Pradeep/Desktop/New%20folder/my-project/specs/001-content-calendar-audit/contracts/calendar-api.json) and [data-model.md](file:///C:/Users/Pradeep/Desktop/New%20folder/my-project/specs/001-content-calendar-audit/data-model.md).
2. **Automated Content Audit & Gap Intelligence Gate**: PASS - Four distinct analyzers designed for Content Gaps, Outdated Blogs, Seasonal Trips, and FAQ Discovery.
3. **Intent-Driven Priority & Scheduling Gate**: PASS - Deterministic Priority Matrix (`High`, `Medium`, `Low`) based on commercial intent, content decay, and 60-90 day seasonal lead time.
4. **Non-Destructive Data Lineage Gate**: PASS - Live URLs mapped directly to `Link to Blog` field with source lineage tracking.
5. **SEO & EEAT Reader Quality Gate**: PASS - Guidelines integrated into title generation and keyword mapping rules.

## Project Structure

### Documentation (this feature)

```text
specs/001-content-calendar-audit/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 architecture decisions
├── data-model.md        # Phase 1 data model entities & schemas
├── quickstart.md        # Phase 1 validation guide
├── contracts/
│   └── calendar-api.json# OpenAPI / JSON Schema endpoint contract
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
src/
├── models/
│   ├── calendar.model.ts       # ContentCalendarItem Zod schema
│   ├── audit.model.ts          # Audit report schemas
│   └── schema.ts               # 10-field validation rules
├── services/
│   ├── scraper.service.ts      # Axios + Cheerio crawling engine
│   ├── gap-analyzer.ts         # Content Gap Identification logic
│   ├── outdated-analyzer.ts    # Stale blog detection
│   ├── seasonal-analyzer.ts    # 60-90 day seasonal trekking scheduler
│   ├── faq-analyzer.ts         # FAQ discovery & extraction
│   ├── priority-engine.ts      # Priority scoring matrix (High/Med/Low)
│   └── export.service.ts       # CSV, JSON, and Google Sheets exporter
├── api/
│   ├── audit.router.ts         # POST /api/audit/domain
│   ├── calendar.router.ts      # POST /api/calendar/generate-from-posts
│   └── export.router.ts        # GET /api/calendar/export
└── frontend/                   # Interactive Visual Dashboard UI
    ├── components/
    └── pages/

tests/
├── unit/                       # Priority logic & schema unit tests
├── contract/                   # API contract validation tests
└── integration/                # Full scraping & audit integration tests
```

**Structure Decision**: Web application layout (backend API engine with services + frontend interactive visual dashboard).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | *All constitution principles satisfied without violations* | *N/A* |
