# Components

Core primitives:
- Button (primary, secondary, destructive, icon)
- Input / Textarea / TextField
- Select / Dropdown
- Modal / Dialog
- Card / Panel
- Avatar / ListItem
- Spinner / Skeleton (loading states)
- EmptyState / ErrorState

Charts:
- ChartCanvas wrapper (responsible for sizing, export)
- ChartLegend, ChartToolbar (type selector, export button)

Usage:
- Feature-level UI MUST use these components; custom CSS only via sanctioned tokens.
# Component Catalogue

Core atomic & molecular components exposed by the design-system:

- Button — variants: primary, secondary, ghost, disabled; size: sm/md/lg
- Input — text, password, number; supports validation states and i18n labels
- Textarea — with autosize and maxlength support
- Card — title, body, footer slots
- Modal — accessible focus trap, close callback
- Icon — shared icon set mapping
- StateShell — wrapper to render loading/empty/error states
- CardListPattern (component-level helper) — renders selectable list of cards

Each component:
- Accepts tokens for style control only via props (no inline styles)
- Exposes TypeScript types and test harnesses

