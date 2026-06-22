# Home Page Redesign — Fintech Dashboard (Revised)

Rewrite `src/routes/home.tsx` end-to-end to match the uploaded mobile reference plus the refinements below. Same route, same metadata shape, no router/nav changes. Scope is strictly `src/routes/home.tsx` plus one tiny SVG helper.

## Visual system (scoped to /home only)

- Background `#070809`, cards `#14151A`, accent `#D61F3A`, success `#22C55E`, text `#FFFFFF`, muted `#B8B8B8`
- Font: Manrope via `font-sans` only. No serif, no italic, no gradient text, no gold
- Container: `max-w-[640px] mx-auto px-5`, sections separated by `space-y-5`
- Cards: `bg-[#14151A] rounded-2xl border border-white/5` with subtle red radial glow where called out

## Sections (top → bottom)

1. **Sticky header** — PROFIRA logo (28px) left; bell + profile circle (36px, `border border-white/10`) right. `bg-[#070809]/90 backdrop-blur`

2. **Hero** — Headline "TRADE NOW FOR / MAXIMUM SECURITY & / MAXIMUM RETURNS." (last line `#D61F3A`). 3-line subhead in `#B8B8B8`.
   - **Hero fintech backdrop (new)**: absolutely-positioned SVG behind text containing faint red candlestick silhouettes + a thin chart line + soft burgundy radial gradient glow. Opacity ~12–18%, `pointer-events-none`, clipped to hero. No orbs/spheres/gold.

3. **Primary CTA** — Full-width 52px button, red gradient (`from-[#D61F3A] to-[#FF3355]`), "Start Investing →"

4. **Feature chips (updated copy)** — 2×2 grid:
   - Managed Forex Strategies
   - Gold Trading Exposure
   - Monthly Profit Distribution
   - 24-Hour Onboarding
   Same card size/styling as before, red-tinted icon square per chip.

5. **Strategy Performance card (upgraded)** — Richer dashboard component:
   - Title: "Average Monthly Return"
   - Primary metric: `+7.0%` (large, white)
   - Secondary: "Last 12 Months Performance" (muted)
   - Status pill: green "Trending Up ↗" (`bg-[#22C55E]/12 text-[#22C55E]`)
   - Mini SVG sparkline (green) on the right, with soft glow
   - Clear hierarchy: metric left, sparkline right, status below metric

6. **Performance chart card** — Inline SVG candlestick chart (~30 deterministic candles, red/white on `#14151A`). Time selectors 1M/3M/6M/1Y/ALL — selected = red pill, others muted. No external chart libs.

7. **Why Investors Choose PROFIRA (new section)** — Inserted between Performance chart and Calculator. Section title + 3 cards stacked on mobile, optional horizontal row at ≥sm:
   - Managed Trading — "Professional strategy execution and portfolio management."
   - Transparent Reporting — "Monthly statements and performance reporting."
   - Capital Management — "Structured investment management with investor support."
   Compact cards, small red-glow icons, consistent with system.

8. **Returns calculator** — Glass card. Title "Calculate Your Monthly Returns". shadcn Slider ₹50,000 → ₹50,00,000. Two stat tiles: Monthly Return (`amount × 0.07`) and 6-Month Projection (`× 6`). INR formatted via `Intl.NumberFormat('en-IN')`.

9. **Why PROFIRA** — 3 stacked cards: Secure Strategy / Transparent Reporting / Fast Onboarding (icons + red glow). Kept distinct from section 7 by focusing on platform features vs. investor trust.

10. **Investor reviews** — Horizontal scroll-snap carousel of 4 compact cards (5 red stars, short quote, "Verified Investor").

11. **Final CTA card** — "Ready To Invest?" + subhead + full-width red "Become Investor →" button, faint PROFIRA P watermark on the right.

## Technical notes

- Single rewrite: `src/routes/home.tsx`. Keep `createFileRoute("/home")`; update `head()` to fintech copy.
- Add `src/components/profira/candles.tsx` — pure SVG candlestick chart (no deps).
- Hero backdrop is an inline SVG inside the hero section (no new file needed).
- Drop imports: `HeroOrb`, `HeroBackdrop`, `GoldRing`, `LineChart`, `chartSeries`, `getSeedMarkets`, `useReveal`, FAQ state. Reuse `Slider` from `@/components/ui/slider`.
- All colors inline via Tailwind arbitrary values, scoped to this page only — no global token/style changes, no impact on Portfolio/About/Waitlist.
- No new npm deps. SPA-safe, Vercel-ready.

## Acceptance

Mobile-first at 390px, max width 640px on larger screens, single fintech-style scroll, hero has subtle candlestick/line backdrop, updated feature chips, upgraded performance card with sparkline + trend pill, new "Why Investors Choose PROFIRA" trust section before the calculator, candlestick chart renders, calculator updates live at 7%, no luxury/gold elements.
