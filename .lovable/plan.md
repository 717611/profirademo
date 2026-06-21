# PROFIRA — Build Plan (v3, final)

A luxury mobile-first wealth platform. Editorial typography, vast whitespace, fewer-but-larger glass surfaces with layered depth, atmospheric lighting. Feels like Apple Vision Pro × Revolut Ultra × private banking — never a SaaS dashboard or trading app.

## Stack
TanStack Start (React + Vite + TS + Tailwind v4). Routes in `src/routes/`. No backend, no auth.

---

## Design system (`src/styles.css`)

**Palette** (oklch tokens):
`--obsidian` #070809 · `--graphite` #14151A · `--burgundy-deep` #2A0F17 · `--burgundy` #5A1022 · `--rose-gold` #C89A63 · `--champagne` #E7C98A

**Typography** — loaded via `<link>` in `__root.tsx`:
- Headings: Playfair Display (400/500/600 + italic accent)
- Body: Manrope (300/400/500)
- Editorial scale (+35% over default):
  - `--text-hero`: clamp(3.6rem, 12vw, 5.6rem), lh 0.95, tracking -0.02em
  - `--text-display`: clamp(2.8rem, 9vw, 4rem)
  - `--text-eyebrow`: 0.72rem, tracking 0.28em, uppercase
- Italic gold accent word per hero (*Generation*, *Income*, *Center*, *PROFIRA*) using rose-gold → champagne gradient text

**Atmospheric lighting (global, fixed behind content in `__root.tsx`):**
1. Obsidian base
2. Burgundy radial (top-right, 60vw, blur 120px) — opacity drifts 0.35→0.55 over 14s
3. Gold ambient (bottom-left, 40vw, champagne @ 8%, blur 160px) — 18s offset drift
4. Diagonal glass reflection sweep (white @ 4%)
5. SVG fractal noise grain overlay (opacity 0.04, mix-blend-overlay, fixed)
6. Edge vignette ring

**Layered-depth glass utility (`.glass-panel`)** — applied to every panel:
- **Frosted background:** `backdrop-blur(28px) saturate(140%)`, bg `color-mix(black 45%, burgundy 6%)`
- **Inner top highlight:** `inset 0 1px 0 rgba(255,255,255,0.07)`
- **Reflection streak:** `::before` diagonal linear-gradient (white 0% → 6% → 0%) at ~22°, low opacity, pointer-events-none
- **Soft shadow:** `0 30px 60px -20px rgba(0,0,0,0.55)`
- **Burgundy edge glow:** 1px hairline border `color-mix(rose-gold 22%, transparent)` + `0 0 40px -10px rgba(90,16,34,0.45)`; intensifies on hover

Variants: `.glass-panel-lg` (radius 28px, padding 32–40px), `.hairline` (1px champagne→transparent divider).

**Density rule:** one large panel over multiple small ones. Padding ≥28px. Section rhythm 96px mobile / 128px desktop.

---

## Layout & responsive
Mobile-first at 390px, single column. Desktop (≥1024): content capped **680–720px** centered (was 520px), atmospheric layers expand to full viewport — preserves luxury phone-like feel while giving panels more breathing room on desktop.

---

## Routes
```
src/routes/
  __root.tsx     atmosphere, fonts, meta, FloatingNav
  index.tsx      Screen 0 — Waitlist
  home.tsx       Screen 1 — Investor home
  markets.tsx    Screen 2 — Intelligence Terminal
  about.tsx      Screen 3 — About PROFIRA
```
Each route: unique `head()` (title, description, og:title, og:description).

---

## Screen 0 — Waitlist (`/`)
PROFIRA wordmark + "TRADE · INTELLIGENCE · WEALTH" eyebrow · Private Access pill · HeroOrb (burgundy glass sphere, rose-gold orbit ring, 8s float) · oversized headline "Private Wealth For The Next *Generation*" · supporting line (max 38ch) · **single** large glass panel holding 3 trust metrics (₹4.8 Cr+ · 320+ · 24+) divided by hairlines · Join Waitlist + Become A Customer CTAs · lock + "Applications reviewed within 24 hours" · trust footer with avatar stack +316 · "01 / 04" indicator. No floating nav here.

## Screen 1 — Home (`/home`)
- Hero: smaller orb echo, oversized "Turn Capital Into Consistent Monthly *Income*", Start Investing + View Performance CTAs
- **Wealth Status strip** (NEW, directly under hero CTAs) — single full-width premium glass panel:
  - Left: small champagne pulse dot + eyebrow "PRIVATE STATUS · ACTIVE"
  - Center serif line: "Wealth Engine — Performing"
  - Right: live-style chip "+1.84% MTD"
  - Faint inner sparkline behind the row, hairline divider above, tactile and quiet
- **Single** glass panel for the 4 headline metrics with internal hairline grid (replaces 2×2 cards)
- "Built For Investors Who Expect More" — **one** large glass panel, 4 stacked feature rows (gold ring icon + copy) separated by hairlines
- How It Works — three large numbered editorial rows (01 / 02 / 03), no card chrome
- Investment Calculator — one tall glass panel, slider ₹1L–₹1Cr, oversized serif outputs "Estimated Monthly Income" + "6-Month Projection", live client-side
- Historical Performance — full-width glass panel, SVG line chart, rose-gold gradient fill, timeframe pills, +38.7% in champagne
- Market Intelligence preview — single panel, segmented tabs, 4 instrument rows with sparklines
- Monthly Distribution — single panel, completed + next, hairline divider
- Testimonials — full-width editorial pull-quote (no card), horizontal scroll on mobile
- FAQ — minimal accordion, hairline dividers, no surrounding card
- Final CTA — editorial glass panel "Ready To Put Your Capital To Work?"
- "As Featured In" — quiet low-opacity wordmark row

## Screen 2 — Markets / Intelligence Terminal (`/markets`)
Framed as a private intelligence terminal. Fewer surfaces, editorial section headers.

- Hero: crescent orb top-right, oversized "Market Intelligence *Center*"
- Global Market Pulse — one wide panel, 3 hairline-divided instrument rows with right-aligned sparklines
- Market Chart — single hero panel, large title, display-scale value, timeframe pills, full-width SVG chart with rose-gold gradient, Bullish badge, "Data by TradingView" attribution
- Today's Market Insight — single banner panel, editorial serif headline, paragraph, Read Full Analysis link
- Strategy Performance — one panel, 4 radial gauges in hairline grid
- Live Intelligence Feed — one panel, 4 stacked news rows
- Market Sessions — one panel, faint SVG world map, city rows
- Capital Allocation — one panel, large SVG donut + legend rows
- Current Opportunity — one panel, instrument, bullish badge, 82% confidence bar, thesis line
- Closing CTA — editorial "Turn Market Intelligence Into Investment *Performance*"
- Subtle ticker strip above floating nav

**Market data flow (UPDATED):**
1. **Attempt live fetch first** — best-effort call to a free public endpoint (e.g. Stooq CSV for FX/indices, no key required) via `fetch` wrapped in try/catch, AbortController with 4s timeout
2. Render skeleton shimmer while pending
3. On success → hydrate sparklines, hero chart, pulse rows, and ticker with live values
4. On failure / timeout / non-OK → silently fall back to deterministic seed data (no error UI)
5. Per-instrument fallback so a single failure doesn't blank the screen
6. No env vars, no secrets required

## Screen 3 — About (`/about`)
Most minimal screen. Crescent orb · oversized "About *PROFIRA*" · hairline · single supporting paragraph · three large stacked glass panels (Philosophy / What Sets Us Apart / Commitment) with circular gold-ring icons · tall Coming Soon panel with hourglass icon + lock-pill CTA.

---

## Floating navigation
Persistent in `__root.tsx`, hidden on `/`. Curved glass pill ~340px mobile / max 420px, fixed bottom-center 24px inset, `backdrop-blur(32px)`, hairline gold border, outer burgundy glow. Three tabs (Home · Markets · About). Active: champagne label + 2px champagne bar; 200ms transitions, scale 0.96 on press.

---

## Components (`src/components/profira/`)
GlassPanel · PremiumButton · WealthStatusStrip · MetricStrip · FeatureList · HeroOrb · Sparkline · ChartPanel · DonutChart · RadialGauge · InsightPanel · AllocationPanel · DistributionPanel · TestimonialQuote · FAQAccordion · FloatingNavigation · AtmosphereLayer · GrainOverlay · useMarketData (live-first, seed fallback)

---

## Animations
Orb 8s float + ring rotation · burgundy glow 14s drift · gold glow 18s offset drift · IntersectionObserver section reveal (fade + 16px translate, 700ms) · rAF counter count-up · SVG path draw-in 1.2s · nav 200ms ease.

---

## Out of scope (MVP)
Auth, backend, real waitlist submission (visual + sonner toast), Strategies/Portfolio/Profile pages.

## Acceptance
- All 4 screens render at 390px with no overflow
- Desktop content caps at 680–720px, atmosphere fills viewport
- Hero typography clearly oversized (+35% scale), strong editorial hierarchy
- Every glass panel shows all 5 depth layers (frost, inner highlight, reflection streak, soft shadow, burgundy edge glow)
- Wealth Status strip sits directly under Home hero CTAs and feels premium/quiet
- Markets attempts live fetch first, falls back to seed silently
- Floating nav switches routes smoothly, hidden on `/`
- Calculator updates live; build succeeds; no console errors
- Visual feel matches uploaded references
