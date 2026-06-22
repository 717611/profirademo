## Goal
Deploy the PROFIRA demo to Vercel with the **smallest possible change set**, preserving Lovable preview, routing, and publish.

## Approach: inspect first, change minimally

### Step 1 — Inspect the current build (no code changes)
Run `bun run build` in the sandbox and examine the output:
- What directory is produced (`dist/`, `dist/client`, `.output/`, etc.)?
- Is there a static `index.html` + hashed JS/CSS bundle?
- Are the four routes (`/`, `/home`, `/portfolio`, `/about`) prerendered as HTML files, or only `index.html` exists (pure SPA)?
- Is there a Cloudflare Worker bundle (`_worker.js`) or Node server entry that Vercel can't run as-is?

### Step 2 — Decide based on what we find

**Case A — Build already produces deployable static assets (likely)**
The TanStack Start template likely emits a client bundle + prerendered HTML. In that case the only thing Vercel needs is a tiny `vercel.json`:

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "<the directory found in Step 1>",
  "framework": null,
  "cleanUrls": true,
  "rewrites": [{ "source": "/((?!assets/|.*\\..*).*)", "destination": "/index.html" }]
}
```

The rewrite is the SPA fallback so `/home`, `/about`, `/portfolio` work on hard refresh. The negative lookahead avoids rewriting static asset URLs.

**No** changes to `vite.config.ts`, Nitro preset, prerender, SSR, or any source file.

**Case B — Build produces only a Worker bundle with no usable static client**
Stop and report back to the user before changing anything. Discuss whether to:
- (b1) eject from the Lovable wrapper to set Nitro `preset: "static"`, or
- (b2) keep using Lovable Publish instead.

Do **not** touch Nitro / SSR / prerender config without explicit approval at that point.

### Step 3 — Verify the four routes
After adding `vercel.json` (Case A), serve the build output locally (`bunx serve <outputDir>` or equivalent) and confirm:
- `/` renders the index page
- `/home` renders home
- `/portfolio` renders portfolio
- `/about` renders about
- Hard refresh on each works (SPA fallback effective)
- Lovable preview still loads (no regressions — `vercel.json` is ignored by Lovable)

### Step 4 — Document Vercel import steps for the user
1. Push to GitHub via Lovable.
2. Import into Vercel → preset "Other".
3. Vercel reads `vercel.json` — no env vars needed.
4. Deploy.

## Guarantees
- **Lovable preview**: untouched (`vercel.json` is Vercel-only).
- **Routing**: unchanged at the app level; SPA fallback added at the host level only.
- **Publish**: `profirademo.lovable.app` keeps working exactly as today.
- **Config delta**: one new file (`vercel.json`), zero source-code edits — unless Step 2 lands on Case B, at which point I'll pause and confirm.

## Out of scope
- Design/content changes.
- Adding backend or server functions (the app has none; static deploy is appropriate).
- Custom domain on Vercel (do that in Vercel dashboard post-deploy).
