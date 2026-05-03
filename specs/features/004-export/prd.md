# Feature: Export (PNG/JPEG)

## 0. Version
See `../004-export/version.md`

## 1. Scope
- Export rendered chart as PNG or JPEG via client-side canvas export or server-side rendering fallback.

## 2. Out of Scope
- Vector/SVG export, print presets.

## 3. Interfaces
- GET /api/charts/:id/export?format=png -> 200 binary (or redirect to signed URL)

## 4. Data Model
- ExportRequest metadata logged for auditing.

## 5. Dependencies
- 002-chart-generation (rendered chart), 003-history (export saved charts)

## 6. Acceptance Criteria
- Export button produces downloadable PNG; automated test for client-side export path.

## 7. UI Specification
- Export action in ChartToolbar; progress indicator during export.
