# Portfolio Page Redesign

Replace the current `/markets` route with a new `/portfolio` route built as a clean fintech investor dashboard, matching the uploaded reference exactly. All luxury/editorial styling on this page is removed.

## Route + Navigation

- Create `src/routes/portfolio.tsx` (full new page). Delete `src/routes/markets.tsx`.
- Update `src/components/profira/floating-nav.tsx`: replace the "Markets" item with "Portfolio" → `/portfolio`, keep Home and About, keep curved floating style, red glow under active tab.
- Any internal `<Link to="/markets">` references → `/portfolio`.

## Assets

- The PROFIRA logo is already uploaded at `src/assets/profira-logo.png.asset.json` — reuse it (no re-upload).

## Page Structure (mobile-first, max-w 520px centered)

Container: `bg-[#070809]` page, content `px-5 pt-6 pb-28`, smooth scroll, no horizontal overflow.

1. **Header row** — PROFIRA logo (left, ~28px) + circular profile icon button (right, `lucide-react` User icon, 1px white/15 border).
2. **Greeting block** — "Good Morning, Aryan" (`text-[#B8B8B8] text-sm`) + "Manage Your Portfolio" (`text-white text-2xl font-semibold`, Manrope).
3. **Portfolio Value hero card** — rounded-2xl, `bg-[#14151A]` with burgundy radial glow on the right (`rgba(214,31,58,0.25)`), 1px white/5 border.
   - Left: "Total Portfolio Value" + eye icon, large `₹4,80,000.00` (32px, decimals dimmer), "Today's Change" + `+₹14,800.00 (3.20%)` in green with arrow.
   - Top-right: `+3.20%` pill (red tint bg, red text).
   - Right side: small inline SVG growth line (red `#D61F3A`) bleeding to the card edge.
4. **Quick Actions** — 2×2 grid, gap-3. Each tile: rounded-xl, `bg-[#14151A]`, white/5 border, left red-tinted icon square (40px, `bg-[#D61F3A]/15`, red icon), 2-line white label. Actions: Download Agreement (Download), Download Invoice (FileDown), Invest More (PlusCircle), Withdraw (ArrowUp). Buttons are non-functional (no backend).
5. **Portfolio Performance card** — rounded-2xl, `bg-[#14151A]`.
   - Header row: "Portfolio Performance" + "View All ›" (red).
   - Time filter row: 1D / 1W / 1M / 6M / 1Y / All. Selected pill = red bg `#D61F3A`/15 with red text; others muted. State via `useState`, default `1M`.
   - SVG line chart (~180px tall): red line + soft red area gradient, dashed Y gridlines at 5.0L/4.5L/4.0L/3.5L, X labels 22 May / 29 May / 5 Jun / 12 Jun / 19 Jun, end-point dot with floating tooltip "₹4,80,000 / 20 Jun".
   - Local seed data per timeframe (no fetch).
6. **Market Watch card** — rounded-2xl, `bg-[#14151A]`.
   - Header: "Market Watch" + "View All ›".
   - Rows: Gold (XAU/USD) / Commodities · 2,365.20 · +0.84%, EUR/USD / Forex · 1.0824 · +0.35%, GBP/USD / Forex · 1.2657 · −0.21%, USD/JPY / Forex · 156.42 · +0.12%.
   - Each row: colored circular icon (Gold=amber, EUR=green, GBP=blue, USD=blue) with symbol glyph, name + category, mini SVG sparkline (red for negative, green for positive), price + colored % with arrow. Divider between rows.
7. **Bottom spacing** so floating nav doesn't overlap.

## Removed on this page

Hero orb, intelligence feed, market sessions, capital allocation, opportunity panels, editorial copy, serif typography, gold accents, glass with rose-gold edges — none of these appear on `/portfolio`. Other pages are untouched.

## Typography + Tokens

- Font stack: Manrope (already loaded) via `font-sans` only. No Playfair, no serif.
- Inline literal color hexes from the spec (`#070809`, `#14151A`, `#D61F3A`, `#B8B8B8`, `#22C55E`, `#EF4444`) — scoped to this page, no global token edits.

## Files Touched

- create `src/routes/portfolio.tsx`
- create `src/components/profira/portfolio/` (split into `ValueCard.tsx`, `QuickActions.tsx`, `PerformanceCard.tsx`, `MarketWatch.tsx` to keep files small)
- delete `src/routes/markets.tsx`
- edit `src/components/profira/floating-nav.tsx` (rename Markets → Portfolio, route `/portfolio`)
- edit any `Link to="/markets"` occurrences (home page CTA if present)

No backend, no new deps, SPA-safe, Vercel-safe.
