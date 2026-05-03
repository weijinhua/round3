# Feature: Chart Generation (AI-driven)

## 0. Version
See `../002-chart-generation/version.md`

## 1. Scope
- Accept user prompt text, parse numeric data and labels, select chart type (auto or user-specified), render chart on canvas.
- Server-side LLM adapter calls OpenAI; API translates prompt -> structured data + recommended chart.

## 2. Out of Scope
- Real-time collaborative editing, advanced statistical analysis.

## 3. Interfaces
- POST /api/ai/parse-prompt { prompt } -> 200 { data: [{label,values}], suggestedType }
- POST /api/charts/render { chartSpec } -> 200 { chartId, renderUrl }

## 4. Data Model
- ChartSpec { id, userId?, type, data: [{label,values}], metadata }

## 5. Dependencies
- 000-ui-foundation, 001-auth (optional for saved charts), OpenAI provider config

## 6. Acceptance Criteria
- Given a prompt with inline numbers, the system extracts data and returns a chart spec; unit tests for parsing and adapter.

## 7. UI Specification
- ChartCanvas component, ChartToolbar for type override, loading and error states.
