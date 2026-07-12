# Project Atlas — Demo Build

A fully self-contained version of Project Atlas with **no backend, no
database, no API keys, and no environment variables**. Everything runs in
the visitor's browser and deploys to Vercel (or any static host) with a
single click.

## What changed from the full version

| Full version | This demo build |
|---|---|
| Supabase Auth | Local "session" in `localStorage` — any email logs you in, no password check |
| Supabase Storage + Postgres | Images stored in the browser's own **IndexedDB** |
| Stripe subscriptions | "Upgrade to Pro" just flips a `plan` flag in `localStorage` — no card, no charge |
| OpenAI `images/edits` API call | An in-browser `<canvas>` routine (`lib/fake-ai-edit.ts`) picks a stylized effect from keywords in your instruction and composites it at the marker point |
| `middleware.ts` session refresh | `components/AuthGuard.tsx` checks `localStorage` client-side and redirects if missing |
| Dynamic route `/editor/[id]` | Static route `/editor?id=...`, since image IDs are generated at runtime in the browser and can't be pre-rendered by a static export |
| Next.js server rendering | `next.config.js` sets `output: "export"` — the whole app builds to static HTML/JS/CSS, no server functions at all |

The click-to-place-marker interaction, the instruction panel, and the
overall UI are unchanged from the full version.

## Why this deploys with zero configuration

- `next build` produces a static `out/` directory — there's nothing for
  Vercel to run at request time, so there's nothing to configure.
- No `.env` file is read anywhere in the code. Search the repo — there are
  no `process.env` references left.
- No external network calls are made by the app itself (fonts are loaded
  from Google Fonts via CSS `@import`, same as the full version, but the
  UI works fine if that's blocked too).

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Click "Skip login, try instant demo" on the
login page to get straight into the editor with no typing.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. Import it in Vercel. No environment variables need to be added.
3. Vercel will detect the Next.js static export automatically. Alternatively,
   run `npm run build` locally and drag the generated `out/` folder into
   Vercel, Netlify, GitHub Pages, or any static file host.

## Limitations of a browser-only demo

- **Storage is per-browser, per-device.** Clearing site data (or opening
  the app in a different browser) starts fresh. There's a "reset demo data"
  button in the navbar for this.
- **No real accounts.** Anyone can "log in" as any email with no password —
  this is intentional for a zero-backend demo, not a security bug to fix.
- **The AI edit is simulated.** `runFakeEdit()` in `lib/fake-ai-edit.ts`
  recognizes a handful of keywords (leather, wood, remove, logo, colors)
  and draws a corresponding effect at the marker with a `<canvas>` — it
  does not call any model. A "Simulated edit — demo mode" badge is stamped
  on every result so this is never ambiguous to the person using it.
- **Storage quota.** IndexedDB typically allows tens of MB to unlimited
  space depending on the browser, comfortably more than localStorage — but
  very large or many images can still hit browser-specific limits.

## Reconnecting real services later

Each stand-in is isolated in its own file so it's a contained swap if you
want to reintroduce a backend:

- `lib/local-auth.ts` → replace with real auth (Supabase, Clerk, NextAuth, etc.)
- `lib/local-store.ts` → replace with real object storage + a database
- `lib/fake-ai-edit.ts` → replace `runFakeEdit()` with a call to a real
  image-editing model, either directly from the client or via a server
  route if you reintroduce a backend
- `lib/demo-data.ts` is demo-only and can be deleted once real uploads are
  the norm

## Project structure

```
app/
  page.tsx                  Landing page
  (auth)/login, /signup     Local demo "auth" pages
  dashboard/                Image library (IndexedDB) + upload
  editor/                   Marker + instruction editor (?id=... route)
  pricing/                  Plan comparison + local fake upgrade
components/
  AuthGuard.tsx             Client-side route protection
  Canvas.tsx                Click-to-place-marker image canvas
  InstructionPanel.tsx      Instruction input + examples
  UploadZone.tsx             Drag-and-drop upload + generated sample images
  Navbar.tsx                 Shared app header
lib/
  local-auth.ts             localStorage-based fake session
  local-store.ts            IndexedDB wrapper for image persistence
  fake-ai-edit.ts           Canvas-based simulated "AI" edit
  demo-data.ts               Procedurally generated sample images
```
