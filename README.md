# License Usage Admin

An internal admin screen for viewing, filtering, sorting, and lightly managing a SaaS product's customer license records. Built with Next.js (App Router) + TypeScript.

## Setup & run

Requires Node 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Data is seeded from an in-memory store (80 mock license records) — no external services or environment variables needed.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
npm test        # run the test suite once
npm run test:watch
```

## What's here

- **Data layer**: `app/api/licenses/route.ts` (GET) and `app/api/licenses/[id]/route.ts` (PATCH) are real Next.js Route Handlers backed by an in-memory store (`src/data/`), not a statically-imported JSON file — the UI fetches over HTTP like it would against a real backend. `src/hooks/useLicenses.ts` wraps the fetch in SWR for caching/revalidation.
- **Table**: search (debounced), status/plan filters, sortable columns, and pagination are all client-side state, pulled into a `useLicensesPage` hook (`src/hooks/useLicensesPage.ts`) that `LicensesPageClient.tsx` just wires to JSX. The table itself (`components/license/LicenseTable.tsx`) is a plain MUI `Table` — at ~80 mock records, plain DOM rows render instantly, so there's no virtualization to add complexity for a dataset this size.
- **Detail view + edit**: clicking a row opens an MUI `Drawer` (`LicenseDetailDrawer.tsx`) with the full record and an "edit seats allowed" form that validates client-side and server-side (shared validation logic in `src/utils/license-validation.ts`) before updating in-memory state — no persistence beyond the running process, per the brief.
- **Styling**: MUI components throughout, with a small `src/theme/muiTheme.ts` adding a `tone` palette group (positive/caution/danger/neutral) for the few values genuinely shared across components (status colors, seat-utilization colors) on top of MUI's defaults.
- **Tests**: `tests/` — unit tests for the filter/sort/paginate and validation logic, plus component tests for the status badge and the edit-seats form's validation/save/error paths.

## What I prioritized

Given the 2–3 hour scope, I focused mainly on getting all the required functionality working properly instead of spending too much time on visual polish.

I used a Route Handler with SWR for the data flow rather than importing the mock data directly into the page. I also kept the types shared between the API response and the client so that the data contract is clear.

I covered the main edge cases mentioned in the assignment, including loading, error and empty states, no results after searching/filtering, and validation when updating seats. I also added an error simulation option so the error state can actually be tested with the local mock API.

I spent some time on accessibility as well. The table supports keyboard interaction, the rows can be opened using the keyboard, and the detail drawer handles focus when it opens and closes.

I also tried to keep the React optimizations intentional rather than adding useMemo and useCallback everywhere. While working on the table, I found an issue where an object being recreated on every render was preventing the table memoization from being useful, so I fixed that as part of the implementation.


## With another hour or two

I'd spend the additional time mostly on the frontend side:
* Stacking Columns (Mobile Card-Style Layout) For mobile device so that we don’t have to scroll horizontally  for table contents
* Improve the table UX a bit further, especially column sizing, sticky headers and making the table work well on smaller screens.
* Add URL-based state for search, filters, sorting and pagination so that the current view can be refreshed or shared through a URL.
* Add a few Playwright end-to-end tests covering the main user flow — search, filtering, sorting, opening the detail drawer, and updating seats.

* Add optimistic UI for the seats update, along with a proper success/error feedback state.
* Spend some time on accessibility testing with keyboard navigation and screen-reader behavior, especially around the drawer and table interactions.
* Review the bundle and rendering behavior and remove any unnecessary client-side code or dependencies.



For the current scope, I’d avoid introducing additional state-management or data-persistence layers unless there’s a  requirement for them. Given the limited dataset and the exercise’s time constraints, the current approach keeps the implementation focused and maintainable without complexity.

If this were being developed further for production, I’d consider introducing server-side pagination and filtering, along with a persistent backend, as the dataset, traffic, and usage patterns grow.



