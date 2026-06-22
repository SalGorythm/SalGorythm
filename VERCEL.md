# Deploying this repo on Vercel

The **Vite + React** site lives in **`portfolio/`**, not the repository root.

## Option A — Root deploy (recommended with `vercel.json`)

Keep Vercel **Root Directory** as **`.`** (repository root). This repo includes `vercel.json`, which:

1. Runs `npm install` and `npm run build` inside `portfolio/`
2. Publishes static files from **`portfolio/dist`**

In the Vercel UI you can leave **Framework Preset** as **Other**; the JSON overrides install/build/output.

After changing settings, **redeploy** (Redeploy → use latest from Git).

## Option B — Subfolder as project root

If you prefer not to use root `vercel.json`:

1. **Root Directory:** `portfolio`
2. **Framework Preset:** **Vite** (or Other)
3. **Build Command:** `npm run build` (default)
4. **Output Directory:** `dist` (Vite default)
5. **Install Command:** `npm install` (default)

Do **not** use Option A and Option B at the same time (paths would conflict).

## Client-side routing (React Router)

This app uses **`/`**, **`/sandbox`**, **`/tools`**, and **`/support`**. The root `vercel.json` includes a **SPA fallback** rewrite to `index.html` so direct visits and hard refreshes on those paths resolve correctly. Vercel still serves built static files (for example under `/assets/`) when they exist on disk.

## Environment variables

Web3Forms needs the key at **build** time for Vite:

- In Vercel → Project → **Settings → Environment Variables**
- Add **`VITE_WEB3FORMS_ACCESS_KEY`** for **Production** (and Preview if you want forms there too)
- Redeploy after saving

## Visitor & usage counters

Counts are stored in **`data/stats.json`** at the repo root — no Redis or external database.

- **`npm run dev`** starts the Vite site and a tiny local stats API that reads/writes that file.
- Edit **`data/stats.json`** directly anytime if you want to seed or reset numbers.

**What is counted**

| Event | When |
|--------|------|
| Portfolio visit | Once per browser session (first page load) |
| Tool use | Each successful download (PDF unlock or B&W export) |
| Game / lab play | Once per session when a sandbox card is opened |

**Vercel / serverless note:** deployed functions can **read** the bundled `data/stats.json` from git, but the filesystem is **read-only** at runtime — live increments on production won’t persist unless you add a backend (below).

### Live counters on Vercel (free backend)

For **real-time global counts** on production, the simplest free option is **[Upstash Redis](https://upstash.com/)** (10k commands/day on the free tier — plenty for a portfolio).

1. Sign up at [console.upstash.com](https://console.upstash.com/) → **Create database** → choose a region near your Vercel deployment.
2. Copy **REST URL** and **REST TOKEN** from the database page.
3. In Vercel → Project → **Settings → Environment Variables**, add for **Production** (and Preview if you want):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Wire the API to use Redis when those vars exist (see repo `api/stats.ts` — hybrid file + Redis can be added), redeploy.

**Why Upstash:** serverless-friendly (HTTP REST, no TCP), free tier, works with Vercel Edge/Node, ~5 minutes to set up. Alternatives: **Vercel KV** (same Upstash under the hood, one-click in Vercel dashboard), **Supabase Postgres** (heavier but free), **Turso** (SQLite edge).

**Local dev** keeps using **`data/stats.json`** — no Upstash account needed for day-to-day work.

## Still seeing 404?

1. Open the deployment **Build Logs** and confirm `portfolio` build finished and `dist` contains `index.html`.
2. Confirm **Output Directory** matches how you configured the project (`portfolio/dist` from root, or `dist` if root is `portfolio`).
