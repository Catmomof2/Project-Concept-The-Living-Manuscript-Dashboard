# Living Manuscript Dashboard

A Vite + React + Tailwind CSS dashboard for tracking manuscripts in
progress — what's drafting, what's waiting, and what's due next.

Built from GitHub issue #1 in
`Catmomof2/Project-Concept-The-Living-Manuscript-Dashboard`.

## Setup (the issue's commands)

```bash
npm create vite@latest living-manuscript -- --template react
cd living-manuscript
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Note: Tailwind is pinned to v3 (`tailwindcss@^3.4`) so that
`npx tailwindcss init -p` works as written in the issue. Tailwind v4
removed that command, so installing unpinned `tailwindcss` would not
follow the issue.

## Run it

```bash
npm run dev      # local dev server with hot reload
npm run build    # production build — output in dist/
npm run preview  # serve the production build locally
```

## What's in the starter

- `src/App.jsx` — the whole dashboard: manuscript cards, progress bars,
  deadlines with days-left, search + status filters, "log words" inputs,
  and an add-manuscript form.
- `src/index.css` — Tailwind directives.
- `tailwind.config.js` — content paths for `./index.html` and `./src/**`.

Starter data is seeded from Mandy's real manuscripts as of 2026-11-06
(The Letters the House Kept, PJI prize manuscript, What the Fire Left,
The Warden of the Clockwork, Ashes & Ink, Time's Tears, The Author's Fee).
It is editable in the app and saved in the browser's localStorage only
(`living-manuscript-v1`) — nothing is sent to a server. "Reset starter
data" restores the seed.

## Repo

The app lives in `Catmomof2/Project-Concept-The-Living-Manuscript-Dashboard`.
`WorldEngine_v1.jsx` at the repo root predates the starter and is not part
of the dashboard.
