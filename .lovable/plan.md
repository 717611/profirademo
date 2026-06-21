# Home Hero Redesign

Make the first glance of `/home` feel like a real fintech app: an animated background (subtle globe + market chart grid), and a clear split layout — visual on the left, editorial headline on the right.

## What changes

Only the hero block in `src/routes/home.tsx` and a new background component. Everything below (Wealth Status strip, metrics, features, calculator, performance, FAQ, testimonials) stays as-is.

## 1. New `HeroBackdrop` component

`src/components/profira/hero-backdrop.tsx` — purely decorative, absolutely positioned behind hero content.

Layers (back to front):
- Burgundy radial wash (existing token, slightly intensified locally)
- Faint dotted grid (SVG pattern, 1px dots, 24px spacing, 6% opacity) — gives a "terminal" feel
- Animated **wireframe globe**: SVG sphere with rose-gold latitude/longitude lines, slow 40s rotation via CSS `transform: rotateY`, soft burgundy glow behind it
- Animated **market line chart**: full-width SVG line + area gradient (rose-gold → transparent) drawn along the bottom 40% of the hero, animated `stroke-dashoffset` draw-on (1.4s) then a gentle floating tween
- Top hairline + bottom fade-to-black mask so it blends into the rest of the page

No new deps — all SVG + CSS keyframes.

## 2. Hero layout rebuild

Replace the current centered hero (orb on top, text below) with a two-column composition:

```text
+----------------------------------------+
|  [chart + globe backdrop, full bleed]  |
|                                        |
|  ┌──────────┐   PRIVATE WEALTH ENGINE  |
|  │          │                          |
|  │  Globe + │   Turn Capital Into      |
|  │  Orb     │   Consistent Monthly     |
|  │          │   *Income*               |
|  └──────────┘                          |
|                   [Start Investing →]  |
|                   [View Performance]   |
+----------------------------------------+
```

- Mobile (<520px): stacks — compact globe/orb on top (140px), headline below, CTAs full-width. Backdrop still full-bleed.
- ≥520px: 2-column grid `grid-cols-[40%_1fr] gap-6`, visual left, copy right, text-align left (no longer centered).
- Headline `text-hero` stays, but `max-w-[14ch]` and left-aligned for editorial rhythm.
- Eyebrow sits above the headline on the right column.
- CTAs become inline auto-width on ≥520px, full-width on mobile.

## 3. Hero visual (left column)

Replace bare `HeroOrb` with a composed stack:
- `HeroOrb` (size 140 mobile / 180 desktop) centered
- Wrapped in a soft rose-gold ring + faint orbiting dot (existing primitives)
- Backed by a small concentric SVG grid so the orb reads as a "market sphere", not a floating ball

## 4. Background bleed

Wrap the hero `<section>` in a `relative` container; `HeroBackdrop` is `absolute inset-x-[-24px] top-[-40px] bottom-[-24px]` so it visually breaks out of the 720px content cap without affecting layout below. Pointer-events none.

## Files touched

- `src/components/profira/hero-backdrop.tsx` — new
- `src/routes/home.tsx` — replace hero `<section>` only (lines ~52–86), keep Wealth Status strip and everything below intact
- `src/styles.css` — add `@keyframes globe-spin` and `@keyframes chart-float` (small additions)

Out of scope: Waitlist page hero, Markets, About, color tokens, nav.
