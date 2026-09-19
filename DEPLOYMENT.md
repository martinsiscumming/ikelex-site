# Deploying to Vercel

This project is pre-configured for Vercel. `vercel.json` sets `"framework": null` so Vercel doesn't
try to guess the framework, and points at the plain `npm run build`.

Nitro (this app's build tool) auto-detects Vercel via the `VERCEL=1` env var Vercel's build system
sets automatically, and switches its output to Vercel's Build Output API v3 — verified locally by
running `VERCEL=1 npm run build`, which produced a working `.vercel/output/functions/...` bundle.
No special build command juggling needed.

## Environment variables

Add these in Project Settings → Environment Variables before your first deploy:

```
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_PROJECT_ID=...
SUPABASE_SERVICE_ROLE_KEY=...      # required — see note below
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

> `SUPABASE_SERVICE_ROLE_KEY` isn't in the exported `.env` (it's a secret, correctly not committed).
> Without it, published photos/images on the homepage won't render (the page itself won't crash —
> that failure is now handled gracefully — but the image will be missing).

## Deploy

**Via GitHub (recommended):** push this folder to a GitHub repo and import it in Vercel
("Add New… → Project → Import Git Repository"). Every push to the production branch redeploys
automatically.

**Via CLI:**
```
npm install -g vercel
vercel        # first run links/creates the project and deploys a preview
vercel --prod # promotes to production
```
