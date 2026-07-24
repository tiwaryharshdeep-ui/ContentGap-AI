# Tasks: Website Content Calendar & Audit Engine

**Input**: Design documents from `/specs/001-content-calendar-audit/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/calendar-api.json, quickstart.md

---

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic repository structure

- [X] T001 Create project directory structure per implementation plan in `src/`, `tests/`, and `docs/`
- [X] T002 Initialize Node.js & TypeScript project with Express, Axios, Cheerio, fast-xml-parser, Zod, and Vitest dependencies in `package.json`
- [X] T003 [P] Configure TypeScript compilation options in `tsconfig.json`
- [X] T004 [P] Configure Vitest testing framework environment in `vitest.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data schemas and scraper infrastructure that MUST be complete before ANY user story implementation begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement 10-field Zod validation schema in `src/models/schema.ts`
- [X] T006 [P] Implement `ContentCalendarItem` and `ContentAuditReport` interfaces in `src/models/calendar.model.ts`
- [X] T007 [P] Implement audit entity models for Gaps, Outdated Blogs, Seasonal Trips, and FAQs in `src/models/audit.model.ts`
- [X] T008 Implement Web Scraper and Sitemap Parser service using Axios + Cheerio in `src/services/scraper.service.ts`
- [X] T009 Setup Express API routing framework and error handling middleware in `src/api/app.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Website Ingestion & 10-Field Content Calendar Generation (Priority: P1) 🎯 MVP

**Goal**: Ingest a website URL/sitemap and generate a complete 10-field content calendar (`publishDate`, `blogTitle`, `primaryKeyword`, `secondaryKeywords`, `searchIntent`, `targetAudience`, `contentType`, `linkToBlog`, `cta`, `priority`).

**Independent Test**: Input a target website URL or sitemap, verify the output calendar items contain valid non-null values across all 10 mandatory metadata fields.

### Tests for User Story 1

- [X] T010 [P] [US1] Write contract test for `POST /api/audit/domain` in `tests/contract/test_audit_api.test.ts`
- [X] T011 [P] [US1] Write unit test for 10-field schema invariant in `tests/unit/test_schema_validation.test.ts`

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement website crawling and post metadata extraction in `src/services/scraper.service.ts`
- [X] T013 [P] [US1] Implement deterministic Priority Scoring Engine (`High`, `Medium`, `Low`) in `src/services/priority-engine.ts`
- [X] T014 [US1] Implement core Content Calendar Generator service in `src/services/calendar.service.ts`
- [X] T015 [US1] Implement `POST /api/audit/domain` API endpoint controller in `src/api/audit.router.ts`
- [X] T016 [US1] Integrate 10-field schema validation middleware in `src/api/middleware/validate.ts`

**Checkpoint**: User Story 1 (MVP) functional and testable independently.

---

## Phase 4: User Story 2 - Comprehensive Content Audit & Gap Intelligence (Priority: P1)

**Goal**: Audit existing site content to detect Content Gaps, Outdated Blogs, Seasonal Trekking Trips (with 60-90 day lead time), and FAQ Opportunities.

**Independent Test**: Audit a website with published articles, verify generated report contains actionable gaps, outdated articles with refresh actions, seasonal trip triggers, and FAQ targets.

### Tests for User Story 2

- [X] T017 [P] [US2] Write unit test for Seasonal Trekking Lead-Time Engine (60-90 day window) in `tests/unit/test_seasonal_analyzer.test.ts`
- [X] T018 [P] [US2] Write unit test for Content Gap Identification in `tests/unit/test_gap_analyzer.test.ts`

### Implementation for User Story 2

- [X] T019 [P] [US2] Implement Content Gap Analyzer service in `src/services/gap-analyzer.ts`
- [X] T020 [P] [US2] Implement Outdated Blog Identifier service in `src/services/outdated-analyzer.ts`
- [X] T021 [P] [US2] Implement Seasonal Trekking Trip Engine in `src/services/seasonal-analyzer.ts`
- [X] T022 [P] [US2] Implement FAQ Discovery Engine in `src/services/faq-analyzer.ts`
- [X] T023 [US2] Integrate audit modules into master Content Audit Engine in `src/services/audit.service.ts`
- [X] T024 [US2] Connect audit intelligence findings to calendar generation in `src/api/audit.router.ts`

**Checkpoint**: User Stories 1 AND 2 both functional independently.

---

## Phase 5: User Story 3 - Custom Post Inventory Calendar Generation (Priority: P2)

**Goal**: Enrich a raw list of post concepts or draft headlines into fully populated 10-field content calendar items.

**Independent Test**: Post array of titles to `POST /api/calendar/generate-from-posts`, verify returned items contain keywords, search intent, audience, CTA, and priority.

### Tests for User Story 3

- [X] T025 [P] [US3] Write contract test for `POST /api/calendar/generate-from-posts` in `tests/contract/test_posts_api.test.ts`

### Implementation for User Story 3

- [X] T026 [P] [US3] Implement post concept keyword and intent enrichment service in `src/services/enrichment.service.ts`
- [X] T027 [US3] Implement `POST /api/calendar/generate-from-posts` endpoint controller in `src/api/calendar.router.ts`

**Checkpoint**: User Stories 1, 2, and 3 functional independently.

---

## Phase 6: User Story 4 - Multi-Format Export & Integration (Priority: P3)

**Goal**: Export generated content calendars and audit reports into CSV, JSON, and Google Sheets payload formats.

**Independent Test**: Request export in CSV format, verify 10 column headers match schema and data is output cleanly.

### Tests for User Story 4

- [X] T028 [P] [US4] Write unit test for CSV exporter formatting in `tests/unit/test_exporter.test.ts`

### Implementation for User Story 4

- [X] T029 [P] [US4] Implement CSV and JSON export formatting service in `src/services/export.service.ts`
- [X] T030 [P] [US4] Implement Google Sheets payload generator service in `src/services/gsheets.service.ts`
- [X] T031 [US4] Implement `GET /api/calendar/export` endpoint controller in `src/api/export.router.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: UI Dashboard, documentation, and end-to-end system validation

- [X] T032 [P] Create interactive visual dashboard frontend in `src/frontend/index.html`
- [X] T033 [P] Write API documentation and usage guide in `docs/api.md`
- [X] T034 Execute end-to-end quickstart validation scenario per `quickstart.md`
