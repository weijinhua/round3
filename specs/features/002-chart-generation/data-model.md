# Chart Generation Data Model

## Entities

### Chart Prompt
- `prompt`: user-entered text describing the desired chart.
- `chartType`: optional preferred chart type.

### Chart Data
- `xAxis`: ordered labels extracted from the prompt.
- `series`: numeric values paired with labels.

### Chart Preview
- `title`: human-readable chart title.
- `config`: renderable chart configuration.
- `chartType`: resolved chart presentation type.

### Saved Chart
- `id`: persisted chart identifier.
- `userId`: owning user.
- `prompt`: original prompt text.
- `config`: saved chart configuration.
- `createdAt` / `updatedAt`: audit timestamps.

### Export Artifact
- `filename`: SVG filename derived from the chart title.
- `svg`: rendered chart markup.

## Relationships

- A `Chart Prompt` produces one `Chart Preview`.
- A `Chart Preview` can be saved as a `Saved Chart`.
- A `Saved Chart` can produce one or more `Export Artifact` downloads.
- A `Saved Chart` owns the chart history entry shown in the dashboard sidebar.
