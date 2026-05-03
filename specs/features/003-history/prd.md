# Feature: History (Save & List)

## 0. Version
See `../003-history/version.md`

## 1. Scope
- Save generated charts to user's history, list view in sidebar, detail view to open saved chart.

## 2. Out of Scope
- Sharing, team folders, versioned chart edits.

## 3. Interfaces
- POST /api/charts { chartSpec } -> 201 { id }
- GET /api/charts?userId= -> 200 [{ id, title, thumbnail, createdAt }]
- GET /api/charts/:id -> 200 { chartSpec }

## 4. Data Model
- ChartRecord { id, userId, title, chartSpec, thumbnailUrl, createdAt }

## 5. Dependencies
- 001-auth (user identity), 002-chart-generation (chartSpec)

## 6. Acceptance Criteria
- User can save a chart and retrieve it in list and detail endpoints; UI shows thumbnails and open action.

## 7. UI Specification
- Sidebar list item component, empty state, and detail open flow.
