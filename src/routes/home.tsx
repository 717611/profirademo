import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, ShieldCheck, BarChart3, FileText, Headphones, ChevronDown, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { GlassPanel, GoldRing, HeroOrb, PremiumButton, useReveal } from "@/components/profira/primitives";
import { HeroBackdrop } from "@/components/profira/hero-backdrop";
import { LineChart, Sparkline } from "@/components/profira/charts";
import { chartSeries, getSeedMarkets } from "@/lib/market-data";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "PROFIRA — Turn Capital Into Monthly Income" },
      {
        name: "description",
        content:
          "Investment platform engineered for consistent monthly income. Calculate returns, track performance, and access private intelligence.",
      },
      { property: "og:title", content: "PROFIRA Home — Consistent Monthly Income" },
      { property: "og:description", content: "A premium wealth engine for serious investors." },
    ],
  }),
  component: HomePage,
});

const features = [
  { Icon: ShieldCheck, title: "Capital Preservation", body: "Risk is the first metric. Every allocation is sized against drawdown limits before return targets." },
  { Icon: BarChart3, title: "Professional Execution", body: "A disciplined team and rules-based systems remove emotion from every decision cycle." },
  { Icon: FileText, title: "Transparent Reporting", body: "Monthly statements, audited returns, and a clear view of where every rupee is working." },
  { Icon: Headphones, title: "Dedicated Support", body: "A private relationship manager, on call — never a ticket queue." },
];

const faqs = [
  { q: "What is the minimum investment?", a: "Private accounts open at ₹10,00,000. Larger allocations unlock concierge bands." },
  { q: "How are returns distributed?", a: "Net profits are distributed monthly on the 5th, directly to your registered bank account." },
  { q: "Is my capital locked?", a: "No mandatory lock-in. A 30-day notice ensures orderly exits without market impact." },
  { q: "How is risk managed?", a: "Position sizing, hard stops, and portfolio-level VaR are reviewed daily by our risk committee." },
];

function HomePage() {
  const heroRef = useReveal<HTMLDivElement>();
  const [amount, setAmount] = useState(2500000);
  const monthly = useMemo(() => Math.round(amount * 0.028), [amount]);
  const sixMonth = monthly * 6;
  const markets = getSeedMarkets();
  const series = useMemo(() => chartSeries(), []);
  const [tab, setTab] = useState<"all" | "fx" | "comm" | "idx">("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="profira-container pt-6">
      {/* Hero */}
      <section ref={heroRef} className="relative">
        {/* Full-bleed animated backdrop */}
        <div className="absolute inset-x-[-22px] -top-10 bottom-[-32px] md:inset-x-[-32px]">
          <HeroBackdrop />
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-[42%_1fr] items-center gap-5 sm:gap-7 pt-8 pb-10">
          {/* Visual */}
          <div className="relative flex items-center justify-center sm:justify-start">
            <div className="relative">
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full opacity-30"
                aria-hidden="true"
              >
                {[40, 60, 80, 95].map((r) => (
                  <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(231,201,138,0.35)" strokeWidth="0.4" />
                ))}
                <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(231,201,138,0.18)" strokeWidth="0.3" />
                <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(231,201,138,0.18)" strokeWidth="0.3" />
              </svg>
              <div className="hidden sm:block">
                <HeroOrb size={200} />
              </div>
              <div className="sm:hidden">
                <HeroOrb size={150} />
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="text-center sm:text-left">
            <p className="eyebrow">Private Wealth Engine</p>
            <h1 className="text-hero mt-3 max-w-[14ch] mx-auto sm:mx-0">
              Turn Capital Into Consistent Monthly <span className="gold-italic">Income</span>
            </h1>
            <p className="mt-4 max-w-[38ch] mx-auto sm:mx-0 text-white/65 text-[14px] leading-relaxed">
              A disciplined wealth engine designed for investors who value clarity, consistency, and conviction.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <PremiumButton>Start Investing <ArrowRight className="h-3.5 w-3.5" /></PremiumButton>
              <PremiumButton variant="outline">View Performance</PremiumButton>
            </div>
          </div>
        </div>

        {/* Wealth Status strip */}
        <GlassPanel className="relative mt-2 w-full p-0 overflow-hidden">
          <div className="relative px-5 py-4">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <Sparkline data={series.slice(-16)} width={400} height={56} />
            </div>
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-champagne)] pulse-dot shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] tracking-[0.24em] uppercase text-white/55">Private Status · Active</div>
                  <div className="font-display text-[15px] text-white/90 truncate">Wealth Engine — Performing</div>
                </div>
              </div>
              <div className="shrink-0 rounded-full border border-[rgba(231,201,138,0.35)] bg-[rgba(231,201,138,0.06)] px-3 py-1.5 text-[11px] tracking-[0.12em] text-[var(--color-champagne)]">
                +1.84% MTD
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* Headline metrics — one panel */}
      <Section>
        <GlassPanel className="p-0">
          <div className="grid grid-cols-2">
            {[
              { v: "₹4.8 Cr+", l: "Capital Deployed" },
              { v: "320+", l: "Private Investors" },
              { v: "24+", l: "Months Track" },
              { v: "96%", l: "Profitable Months" },
            ].map((m, i) => (
              <div
                key={m.l}
                className={`px-6 py-7 text-center ${i % 2 === 1 ? "border-l border-[rgba(231,201,138,0.12)]" : ""} ${i >= 2 ? "border-t border-[rgba(231,201,138,0.12)]" : ""}`}
              >
                <div className="font-display text-[26px] gold-text">{m.v}</div>
                <div className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/55">{m.l}</div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </Section>

      {/* Features — one panel */}
      <Section eyebrow="What Sets Us Apart" title={<>Built For Investors Who Expect <span className="gold-italic">More</span></>}>
        <GlassPanel className="p-0">
          {features.map(({ Icon, title, body }, i) => (
            <div key={title} className={`flex gap-5 px-6 py-6 ${i !== 0 ? "border-t border-[rgba(231,201,138,0.10)]" : ""}`}>
              <GoldRing size={44}>
                <Icon className="h-4 w-4" strokeWidth={1.6} />
              </GoldRing>
              <div className="flex-1">
                <h3 className="font-display text-[18px] text-white">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">{body}</p>
              </div>
            </div>
          ))}
        </GlassPanel>
      </Section>

      {/* How it works */}
      <Section eyebrow="The Process" title="How It Works">
        <div className="flex flex-col">
          {[
            { n: "01", t: "Apply For Access", b: "Submit a brief application. Our team reviews within 24 hours." },
            { n: "02", t: "Activate Your Account", b: "Sign your private mandate and fund your dedicated account." },
            { n: "03", t: "Receive Monthly Income", b: "Net profits arrive on the 5th of every month." },
          ].map((s, i) => (
            <div key={s.n} className={`py-7 ${i !== 0 ? "border-t border-[rgba(231,201,138,0.12)]" : ""}`}>
              <div className="font-display text-[40px] gold-text leading-none">{s.n}</div>
              <h3 className="mt-3 font-display text-[22px] text-white">{s.t}</h3>
              <p className="mt-2 text-[14px] text-white/60 leading-relaxed">{s.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Calculator */}
      <Section eyebrow="Income Calculator" title={<>Project Your Monthly <span className="gold-italic">Income</span></>}>
        <GlassPanel>
          <div className="flex items-end justify-between">
            <div>
              <div className="eyebrow">Investment</div>
              <div className="font-display text-[34px] mt-1 gold-text">₹{(amount / 100000).toFixed(1)}L</div>
            </div>
            <div className="text-right text-[11px] tracking-[0.18em] uppercase text-white/45">
              Range<br /><span className="text-white/70">₹1L – ₹1Cr</span>
            </div>
          </div>
          <div className="mt-6">
            <Slider
              value={[amount]}
              min={100000}
              max={10000000}
              step={50000}
              onValueChange={(v) => setAmount(v[0])}
            />
          </div>
          <div className="hairline my-7" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="eyebrow">Estimated Monthly</div>
              <div className="font-display text-[28px] text-white mt-1">₹{monthly.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="eyebrow">6-Month Projection</div>
              <div className="font-display text-[28px] gold-text mt-1">₹{sixMonth.toLocaleString("en-IN")}</div>
            </div>
          </div>
          <p className="mt-5 text-[11px] text-white/40 leading-relaxed">
            Projections based on a 24-month trailing average. Past performance does not guarantee future results.
          </p>
        </GlassPanel>
      </Section>

      {/* Historical performance */}
      <Section eyebrow="Track Record" title="Historical Performance">
        <GlassPanel>
          <div className="flex items-end justify-between">
            <div>
              <div className="eyebrow">Trailing 12 Months</div>
              <div className="font-display text-[34px] gold-text mt-1">+38.7%</div>
            </div>
            <div className="flex gap-1 text-[10px] tracking-[0.18em] uppercase">
              {["3M", "6M", "1Y", "ALL"].map((p, i) => (
                <span key={p} className={`px-2.5 py-1 rounded-full border ${i === 2 ? "border-[rgba(231,201,138,0.5)] text-[var(--color-champagne)]" : "border-white/10 text-white/45"}`}>{p}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 -mx-2">
            <LineChart data={series} />
          </div>
        </GlassPanel>
      </Section>

      {/* Market Intelligence preview */}
      <Section eyebrow="Live Intelligence" title="Market Snapshot">
        <GlassPanel className="p-0">
          <div className="flex border-b border-[rgba(231,201,138,0.10)] text-[11px] tracking-[0.16em] uppercase">
            {([
              ["all", "All"],
              ["fx", "Forex"],
              ["comm", "Commodities"],
              ["idx", "Indices"],
            ] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 px-3 py-3.5 ${tab === k ? "text-[var(--color-champagne)] border-b border-[var(--color-champagne)]" : "text-white/45"}`}
              >
                {l}
              </button>
            ))}
          </div>
          {markets.map((m, i) => (
            <div key={m.symbol} className={`flex items-center gap-3 px-5 py-4 ${i !== 0 ? "border-t border-[rgba(231,201,138,0.08)]" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-white truncate">{m.name}</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 mt-0.5">{m.symbol}</div>
              </div>
              <Sparkline data={m.series} positive={m.change >= 0} />
              <div className="text-right shrink-0">
                <div className="text-[13px] text-white">{m.price}</div>
                <div className={`text-[11px] ${m.change >= 0 ? "text-[var(--color-champagne)]" : "text-rose-300"}`}>
                  {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </GlassPanel>
      </Section>

      {/* Distribution */}
      <Section eyebrow="Monthly Distribution" title="Your Income Calendar">
        <GlassPanel className="p-0">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <div className="text-[11px] tracking-[0.18em] uppercase text-white/55">June 2026</div>
              <div className="font-display text-[20px] text-white mt-1">Distribution Completed</div>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-champagne)]">
              <Check className="h-3.5 w-3.5" /> Paid
            </span>
          </div>
          <div className="hairline mx-6" />
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <div className="text-[11px] tracking-[0.18em] uppercase text-white/55">Next — 05 July</div>
              <div className="font-display text-[20px] text-white mt-1">Scheduled</div>
            </div>
            <span className="text-[11px] text-white/55">T-14 days</span>
          </div>
        </GlassPanel>
      </Section>

      {/* Testimonial */}
      <Section eyebrow="Voices">
        <figure>
          <blockquote className="font-display italic text-[28px] leading-[1.15] text-white/90">
            "PROFIRA replaced three advisors and a portfolio manager. The clarity alone is worth the relationship."
          </blockquote>
          <figcaption className="mt-6 text-[12px] tracking-[0.18em] uppercase text-white/55">
            R. Mehta · Founder, Lumen Capital
          </figcaption>
        </figure>
      </Section>

      {/* FAQ */}
      <Section eyebrow="Common Questions" title="Frequently Asked">
        <div>
          {faqs.map((f, i) => (
            <div key={f.q} className={`py-5 ${i !== 0 ? "border-t border-[rgba(231,201,138,0.10)]" : ""}`}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-display text-[18px] text-white pr-4">{f.q}</span>
                <ChevronDown className={`h-4 w-4 text-[var(--color-champagne)] transition ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <p className="mt-3 text-[14px] text-white/65 leading-relaxed">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <GlassPanel className="text-center py-12">
          <p className="eyebrow">Take The Next Step</p>
          <h2 className="text-display mt-4 max-w-[14ch] mx-auto">
            Ready To Put Your Capital To <span className="gold-italic">Work?</span>
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            <PremiumButton>Become An Investor <ArrowRight className="h-3.5 w-3.5" /></PremiumButton>
            <Link to="/markets" className="text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-[var(--color-champagne)]">
              Explore Intelligence →
            </Link>
          </div>
        </GlassPanel>
      </Section>

      {/* Featured */}
      <section className="mt-20">
        <p className="eyebrow text-center">As Featured In</p>
        <div className="mt-5 flex items-center justify-around opacity-40 text-white/70 font-display text-[14px] tracking-[0.18em]">
          <span>ECONOMIC</span><span>FORBES</span><span>MINT</span><span>BQ</span>
        </div>
      </section>
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
    <section ref={ref} className="mt-24">
      {(eyebrow || title) && (
        <header className="mb-6 text-center">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 className="text-section mt-3 max-w-[18ch] mx-auto">{title}</h2>}
        </header>
      )}
      {children}
    </section>
  );
}
