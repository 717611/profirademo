# Redesign Waitlist Screen (`/`) — Fintech Onboarding, No Scroll

Scope: ONLY `src/routes/index.tsx`. Home, Markets, About, nav, tokens, fonts elsewhere stay untouched.

## Assets

Upload via `lovable-assets` from `/mnt/user-uploads/`:
- `IMG_20260622_005710.png` → `src/assets/profira-logo.png.asset.json`
- `file_0000000067f8723081976b2ba24c50ed.png` → `src/assets/profira-card-hero.png.asset.json`

Both used as `<img src={asset.url}>`. No editing of the artwork.

## Layout (mobile-first, 100dvh, no scroll)

Single full-viewport flex column, `h-[100dvh] overflow-hidden`, max-width 480px centered on larger screens, safe-area padding top/bottom.

```text
┌─────────────────────────────┐
│ [logo]          Enter →     │  header  ~12%
├─────────────────────────────┤
│                             │
│     [ card artwork ]        │  hero    ~48%
│                             │
├─────────────────────────────┤
│ TRADE SECURELY,             │
│ GET MAXIMUM PROFIT          │  copy    ~18%
│ Access professionally …     │
├─────────────────────────────┤
│ [   Join Waitlist     →]    │
│ [   Become Customer   →]    │  CTAs    ~22%
│ 🔒 Applications reviewed…   │
└─────────────────────────────┘
```

Rows use `flex-1` with `basis` ratios (12/48/18/22) so it fits any phone height without scroll. Hero `<img>` uses `h-full w-auto object-contain mx-auto` to scale down on short screens.

## Sections

**Header (h-[12%])** — `flex items-center justify-between px-5`
- Left: PROFIRA logo image, height ~24px
- Right: pill button "Enter Platform →", transparent bg, 1px white/70 border, white text, `text-xs`, `px-4 py-2 rounded-full`, links to `/home`

**Hero (flex-1, ~48%)** — centered card image, no rings/orb/grid/chart overlays. Single soft red radial glow behind it via absolutely-positioned div (`bg-[radial-gradient(...rgba(220,38,38,0.25),transparent_70%)]`). Subtle 6s float animation only.

**Copy (~18%)** — `px-5 text-left`
- H1: "TRADE SECURELY," / "GET MAXIMUM PROFIT" — `font-sans font-semibold tracking-tight text-white text-[30px] leading-[1.1]` (clamp 28–34)
- Sub: "Access professionally managed market strategies through a simple investment." — `text-sm text-[#C8C8C8] mt-3 max-w-[34ch]`

**CTAs (~22%)** — `px-5 flex flex-col gap-3`
- Primary: `Join Waitlist` → `/home`, `bg-white text-black rounded-2xl h-12 w-full font-medium` + arrow
- Secondary: `Become Customer` → `/home`, transparent, `border border-white/60 text-white rounded-2xl h-12 w-full` + arrow
- Footer line: 🔒 lock icon + "Applications reviewed within 24 hours", `text-xs text-white/50 justify-center mt-1`

## Background

Replace existing atmospheric layers on this route only (wrap content in a div that sets its own background, overriding the global atmosphere with a local `bg-black` and a single top-right red radial gradient overlay). Global atmosphere component stays intact for other routes.

```tsx
<div className="fixed inset-0 bg-black">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.35),transparent_55%)]" />
</div>
```

## Typography

Use Tailwind default sans (Manrope is already loaded — it's modern sans, fintech-appropriate). Explicitly set `font-sans` on this page so Playfair never applies. No serif, no gold, no gradient text.

## Removals (this page only)

Remove: HeroOrb, trust metrics, avatar stack, "Private Access" pill, 01/04 indicator, review text, wealth language, all glass panels, FloatingNav (already hidden on `/`).

## Out of scope

Home/Markets/About pages, global tokens, font imports, navigation component, market data logic.
