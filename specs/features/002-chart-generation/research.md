# Chart Generation Research

## Core decisions

- Keep prompt interpretation on the API side and treat the web app as a thin interaction layer.
- Use the charts API as the source of truth for generated previews, saved history, and exports.
- Preserve a local preview fallback for offline development, but surface API validation errors to the user.

## Implementation notes

- Prompt input is validated at the API boundary before any chart generation logic runs.
- Chart type changes should reuse the same extracted data instead of changing the dataset.
- Saved charts and exports should reference the same chart record so history and download behavior stay consistent.

## Open boundaries

- Real-time collaboration is out of scope.
- Advanced statistical analysis is out of scope.
- The feature focuses on prompt-to-preview, chart-type override, save history, and export.
