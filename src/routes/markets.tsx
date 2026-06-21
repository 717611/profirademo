import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, ArrowDownRight, Target, TrendingUp } from "lucide-react";
import { GlassPanel, HeroOrb, PremiumButton, useReveal } from "@/components/profira/primitives";
import { LineChart, RadialGauge, DonutChart, Sparkline } from "@/components/profira/charts";
import { fetchMarkets, getSeedMarkets, chartSeries, type Instrument } from "@/lib/market-data";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "PROFIRA — Market Intelligence Center" },
      {
        name: "description",
        content: "Live market intelligence, capital allocation, and strategy performance — a private investment terminal.",
      },
      { property: "og:title", content: "PROFIRA — Market Intelligence" },
      { property: "og:description", content: "Private investment intelligence terminal." },
    ],
  }),
  component: MarketsPage,
});

function MarketsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>(getSeedMarkets());
  const [live, setLive] = useState(false);
  const heroRef = useReveal<HTMLDivElement>();
  const chart = useMemo(() => chartSeries(), []);

  useEffect(() => {
    let cancelled = false;
    fetchMarkets().then((data) => {
      if (cancelled) return;
      setInstruments(data);
      setLive(data.some((d) => d.live));
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="profira-container pt-10">
      {/* Hero */}
      <section ref={heroRef} className="relative">
        <div className="absolute -top-6 -right-10 opacity-80 pointer-events-none">
          <HeroOrb size={160} crescent />
        </div>
        <p className="eyebrow">Intelligence Terminal</p>
        <h1 className="text-hero mt-4 max-w-[14ch]">
          Market Intelligence <span className="gold-italic">Center</span>
        </h1>
        <p className="mt-5 max-w-[36ch] text-white/65 text-[14.5px] leading-relaxed">
          A private read on global markets — curated, contextualised, and quiet by design.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-[var(--color-champagne)] pulse-dot" : "bg-white/30"}`} />
          <span className="text-[10px] tracking-[0.22em] uppercase text-white/50">
            {live ? "Live · Streaming" : "Indicative · Cached"}
          </span>
        </div>
      </section>

      {/* Global Pulse */}
      <Section eyebrow="Global Pulse" title="Markets At A Glance">
        <GlassPanel className="p-0">
          {instruments.slice(0, 3).map((m, i) => (
            <div key={m.symbol} className={`flex items-center gap-3 px-5 py-5 ${i !== 0 ? "border-t border-[rgba(231,201,138,0.10)]" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] text-white truncate">{m.name}</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 mt-1">{m.symbol}</div>
              </div>
              <Sparkline data={m.series} positive={m.change >= 0} width={70} height={26} />
              <div className="text-right shrink-0 min-w-[78px]">
                <div className="font-display text-[16px] text-white">{m.price}</div>
                <div className={`text-[11px] flex items-center justify-end gap-1 ${m.change >= 0 ? "text-[var(--color-champagne)]" : "text-rose-300"}`}>
                  {m.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(m.change).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </GlassPanel>
      </Section>

      {/* Hero chart */}
      <Section eyebrow="Featured Instrument" title="Gold (XAU/USD)">
        <GlassPanel>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-display text-display gold-text leading-none">{instruments[0].price}</div>
              <div className="mt-2 text-[11px] tracking-[0.18em] uppercase text-[var(--color-champagne)]">
                {instruments[0].change >= 0 ? "+" : ""}{instruments[0].change.toFixed(2)}% Today
              </div>
            </div>
            <div className="flex gap-1 text-[10px] tracking-[0.18em] uppercase">
              {["1D", "1W", "1M", "1Y"].map((p, i) => (
                <span key={p} className={`px-2.5 py-1 rounded-full border ${i === 2 ? "border-[rgba(231,201,138,0.5)] text-[var(--color-champagne)]" : "border-white/10 text-white/45"}`}>{p}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 -mx-2">
            <LineChart data={chart} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(231,201,138,0.4)] bg-[rgba(231,201,138,0.06)] px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-[var(--color-champagne)]">
              <TrendingUp className="h-3 w-3" /> Bullish
            </span>
            <span className="text-[10px] tracking-[0.18em] uppercase text-white/35">Data by TradingView</span>
          </div>
        </GlassPanel>
      </Section>

      {/* Today's Insight */}
      <Section eyebrow="Today's Insight">
        <GlassPanel>
          <h3 className="font-display text-[24px] leading-tight text-white">
            Gold extends its quiet ascent as real yields soften.
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-white/65">
            With CPI prints decelerating across major economies and central banks signalling patience,
            allocations are rotating back into long-duration store-of-value assets. We remain
            constructive on XAU through Q3.
          </p>
          <a className="mt-5 inline-flex items-center gap-1.5 text-[12px] tracking-[0.16em] uppercase text-[var(--color-champagne)]" href="#">
            Read Full Analysis <ArrowRight className="h-3 w-3" />
          </a>
        </GlassPanel>
      </Section>

      {/* Strategy Performance */}
      <Section eyebrow="Strategy" title="Performance Vitals">
        <GlassPanel>
          <div className="grid grid-cols-2 gap-y-7 gap-x-4">
            <RadialGauge value={38.7} label="Historical Return" />
            <RadialGauge value={22} label="Risk Score" />
            <RadialGauge value={96} label="Capital Protection" />
            <RadialGauge value={84} label="Win Rate" />
          </div>
        </GlassPanel>
      </Section>

      {/* Live Intelligence Feed */}
      <Section eyebrow="Newsroom" title="Live Intelligence Feed">
        <GlassPanel className="p-0">
          {[
            { t: "08:42", tag: "FX", h: "EUR/USD tests 1.08 ahead of ECB minutes", s: "Traders position for dovish tone after softer PMIs.", up: false },
            { t: "07:15", tag: "COMM", h: "Gold approaches 2,380 as yields ease", s: "Real rate compression underpins the move.", up: true },
            { t: "06:01", tag: "MACRO", h: "China industrial output beats by 30bps", s: "Risk assets in Asia open firmer.", up: true },
            { t: "05:22", tag: "INDEX", h: "S&P futures drift higher into NY open", s: "Volatility compressed across the curve.", up: true },
          ].map((n, i) => (
            <div key={i} className={`flex gap-3 px-5 py-5 ${i !== 0 ? "border-t border-[rgba(231,201,138,0.08)]" : ""}`}>
              <div className="text-[10px] tracking-[0.16em] uppercase text-white/40 w-12 pt-0.5">{n.t}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--color-champagne)]">{n.tag}</div>
                <div className="mt-1 text-[14px] text-white leading-snug">{n.h}</div>
                <div className="mt-1 text-[12px] text-white/55">{n.s}</div>
              </div>
              {n.up ? <ArrowUpRight className="h-4 w-4 text-[var(--color-champagne)] shrink-0" /> : <ArrowDownRight className="h-4 w-4 text-rose-300 shrink-0" />}
            </div>
          ))}
        </GlassPanel>
      </Section>

      {/* Market Sessions */}
      <Section eyebrow="Sessions" title="World Markets">
        <GlassPanel className="p-0">
          {[
            { c: "New York", s: "Open", t: "Closes in 4h 12m", live: true },
            { c: "London", s: "Closed", t: "Opens in 11h", live: false },
            { c: "Tokyo", s: "Closed", t: "Opens in 6h", live: false },
            { c: "Sydney", s: "Pre-Open", t: "Opens in 2h", live: false },
          ].map((c, i) => (
            <div key={c.c} className={`flex items-center justify-between px-5 py-4 ${i !== 0 ? "border-t border-[rgba(231,201,138,0.08)]" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`h-1.5 w-1.5 rounded-full ${c.live ? "bg-[var(--color-champagne)] pulse-dot" : "bg-white/20"}`} />
                <span className="font-display text-[16px] text-white">{c.c}</span>
              </div>
              <div className="text-right">
                <div className={`text-[11px] tracking-[0.16em] uppercase ${c.live ? "text-[var(--color-champagne)]" : "text-white/45"}`}>{c.s}</div>
                <div className="text-[11px] text-white/45 mt-0.5">{c.t}</div>
              </div>
            </div>
          ))}
        </GlassPanel>
      </Section>

      {/* Allocation */}
      <Section eyebrow="Portfolio" title="Capital Allocation">
        <GlassPanel>
          <div className="flex items-center justify-between gap-4">
            <DonutChart
              segments={[
                { label: "Forex", value: 42, color: "#E7C98A" },
                { label: "Commodities", value: 28, color: "#C89A63" },
                { label: "Indices", value: 18, color: "#7a4b2d" },
                { label: "Cash", value: 12, color: "#3a2418" },
              ]}
            />
            <div className="flex-1 space-y-3">
              {[
                { l: "Forex", v: 42, c: "#E7C98A" },
                { l: "Commodities", v: 28, c: "#C89A63" },
                { l: "Indices", v: 18, c: "#7a4b2d" },
                { l: "Cash Reserve", v: 12, c: "#3a2418" },
              ].map((r) => (
                <div key={r.l} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-sm" style={{ background: r.c }} />
                    <span className="text-[12.5px] text-white/75">{r.l}</span>
                  </div>
                  <span className="text-[12.5px] text-white">{r.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </Section>

      {/* Current Opportunity */}
      <Section eyebrow="Live Setup" title="Current Opportunity">
        <GlassPanel>
          <div className="flex items-start gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "radial-gradient(circle, rgba(231,201,138,0.2), transparent 70%)" }}>
              <Target className="h-5 w-5 text-[var(--color-champagne)]" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-[20px] text-white">XAU / USD</span>
                <span className="rounded-full border border-[rgba(231,201,138,0.4)] bg-[rgba(231,201,138,0.06)] px-2 py-0.5 text-[9px] tracking-[0.18em] uppercase text-[var(--color-champagne)]">Bullish</span>
              </div>
              <p className="mt-2 text-[13px] text-white/65 leading-relaxed">
                Reclaim of 2,360 confirms continuation; targets 2,420 with stop below 2,335.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-[10px] tracking-[0.18em] uppercase text-white/45 mb-2">
              <span>Confidence</span>
              <span className="text-[var(--color-champagne)]">82%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
              <div className="h-full" style={{ width: "82%", background: "linear-gradient(90deg, #5A1022, #E7C98A)" }} />
            </div>
          </div>
        </GlassPanel>
      </Section>

      {/* Closing CTA */}
      <Section>
        <GlassPanel className="text-center py-12">
          <p className="eyebrow">From Insight To Income</p>
          <h2 className="text-display mt-4 max-w-[16ch] mx-auto">
            Turn Market Intelligence Into <span className="gold-italic">Performance</span>
          </h2>
          <div className="mt-8">
            <PremiumButton>Activate Your Account <ArrowRight className="h-3.5 w-3.5" /></PremiumButton>
          </div>
        </GlassPanel>
      </Section>

      {/* Ticker */}
      <div className="mt-10 overflow-hidden mask-fade">
        <div className="flex gap-8 text-[11px] tracking-[0.18em] uppercase text-white/45 whitespace-nowrap animate-marquee">
          {[...instruments, ...instruments].map((m, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-[var(--color-champagne)]">{m.symbol}</span>
              {m.price}
              <span className={m.change >= 0 ? "text-[var(--color-champagne)]" : "text-rose-300"}>
                {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
              </span>
              <span className="text-white/15">·</span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

function Section({
  children,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title?: React.ReactNode;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="mt-20">
      {(eyebrow || title) && (
        <header className="mb-5">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 className="text-section mt-2.5">{title}</h2>}
        </header>
      )}
      {children}
    </section>
  );
}
