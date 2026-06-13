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

This app uses **`/`**, **`/sandbox`**, and **`/support`**. The root `vercel.json` includes a **SPA fallback** rewrite to `index.html` so direct visits and hard refreshes on those paths resolve correctly. Vercel still serves built static files (for example under `/assets/`) when they exist on disk.

## Environment variables

Web3Forms needs the key at **build** time for Vite:

- In Vercel → Project → **Settings → Environment Variables**
- Add **`VITE_WEB3FORMS_ACCESS_KEY`** for **Production** (and Preview if you want forms there too)
- Redeploy after saving

## Still seeing 404?

1. Open the deployment **Build Logs** and confirm `portfolio` build finished and `dist` contains `index.html`.
2. Confirm **Output Directory** matches how you configured the project (`portfolio/dist` from root, or `dist` if root is `portfolio`).
