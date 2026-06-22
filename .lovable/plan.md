## Root cause

Images on the home/portfolio pages and the homepage credit-card hero are referenced via Lovable's CDN pointer scheme:

```ts
import logoAsset from "@/assets/profira-logo.png.asset.json";
import cardAsset from "@/assets/profira-card-hero.png.asset.json";
<img src={logoAsset.url} />  // → "/__l5e/assets-v1/<uuid>/profira-logo.png"
```

`/__l5e/assets-v1/...` is served only by Lovable's hosting. On Vercel that path doesn't exist, so every `<img>` 404s and renders blank. The Lovable preview works fine because Lovable's edge handles `/__l5e/`.

## Fix

Host the two images as ordinary static files in `public/`. Both Lovable and Vercel serve everything under `public/` at the URL root with no config, so the same URL works in both environments.

### Steps

1. **Copy the re-uploaded images into `public/`:**
   - `/mnt/user-uploads/IMG_20260622_005710-4.png` → `public/profira-logo.png`
   - `/mnt/user-uploads/file_0000000067f8723081976b2ba24c50ed-2.png` → `public/profira-card-hero.png`

2. **Find every reference** to `profira-logo.png.asset.json` and `profira-card-hero.png.asset.json` across the codebase. Confirmed locations to update (will verify with rg in build mode):
   - `src/routes/index.tsx` — uses both
   - `src/routes/home.tsx` — uses logo
   - `src/routes/portfolio.tsx` — uses logo
   - `src/components/profira/floating-nav.tsx` and any other component that imports the logo

   Replace pattern:
   ```ts
   // before
   import logoAsset from "@/assets/profira-logo.png.asset.json";
   <img src={logoAsset.url} />

   // after
   <img src="/profira-logo.png" />
   ```

3. **Delete the now-unused `.asset.json` pointers** (`src/assets/profira-logo.png.asset.json`, `src/assets/profira-card-hero.png.asset.json`) so nothing accidentally references them. Use the assets delete tool so the CDN copies are also cleaned up.

4. **Rebuild & verify**
   - Run `bun run build:static` (the Vercel build).
   - Confirm `dist/client/profira-logo.png` and `dist/client/profira-card-hero.png` exist (Vite copies `public/*` into the build output).
   - Grep the prerendered HTML for `/__l5e/` — should return zero matches.
   - Grep the prerendered HTML for `src="/profira-logo.png"` — should appear in `index.html`, `home/index.html`, `portfolio/index.html`.

## Why this is safe
- **Lovable preview / publish:** unchanged. `public/*` works there too.
- **Vercel:** images now ship inside `dist/client`, served at predictable paths.
- **No build config, Nitro, SSR, or routing changes.** Only image references swap from CDN URLs to root-relative paths.
- **Reversible:** the `.asset.json` deletion is recoverable from chat history if needed.

## Out of scope
- No layout, styling, or copy changes.
- No other asset migrations (only the two images that are broken).
