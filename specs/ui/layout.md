# Layout

Page structure pattern (slot-based):
- AppShell: Sidebar (history list) | Main (header + content)
- Dashboard pattern: Split layout with list on left, canvas on right, editor bottom.

Grid:
- 12-column responsive grid for content areas; charts occupy full-width canvas inside card.

States:
- Loading: skeletons for list and canvas
- Empty: contextual call-to-action
- Error: dismissible banner with retry

# Layout Patterns

Canonical patterns provided by the design-system:

- AppLayout — full-page shell with collapsible sidebar and topbar
- SplitLayout — left/right or top/bottom split with configurable ratio (used for chart canvas + input)
- ChatInputPattern — sticky input bar with send action and hint area
- CardListPattern — scrollable selectable list used by chart history sidebar
- FormPattern — labeled field rows with validation slots for forms
- EmptyPattern — illustration + heading + optional CTA

Pattern rules:
- Patterns are abstract and not named after product features.
- Pages compose patterns; patterns do not import pages.

