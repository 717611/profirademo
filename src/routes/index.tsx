import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Eyebrow, GlassPanel, HeroOrb, PremiumButton, useReveal } from "@/components/profira/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PROFIRA — Private Wealth For The Next Generation" },
      {
        name: "description",
        content:
          "Apply for private access to PROFIRA — institutional-grade wealth strategies delivering consistent monthly distributions.",
      },
      { property: "og:title", content: "PROFIRA — Apply For Private Access" },
      {
        property: "og:description",
        content: "Private wealth for the next generation. Applications reviewed within 24 hours.",
      },
    ],
  }),
  component: Waitlist,
});

function Waitlist() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <main className="profira-container pt-10 pb-16">
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <div>
          <div className="font-display text-[22px] tracking-[0.28em] text-[var(--color-champagne)]">
            PROFIRA
          </div>
          <div className="mt-1 eyebrow text-[10px]">Trade · Intelligence · Wealth</div>
        </div>
        <span className="glass-panel rounded-full px-3 py-1.5 text-[10px] tracking-[0.22em] uppercase text-white/75 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-champagne)] pulse-dot" />
          Private Access
        </span>
      </header>

      <div ref={ref} className="mt-12 flex flex-col items-center text-center">
        <HeroOrb size={240} />

        <p className="eyebrow mt-10">A Private Wealth Platform</p>
        <h1 className="text-hero mt-5 max-w-[14ch]">
          Private Wealth For The Next <span className="gold-italic">Generation</span>
        </h1>
        <p className="mt-6 max-w-[38ch] text-white/65 text-[15px] leading-relaxed">
          Institutional-grade strategies, transparent reporting, and consistent monthly
          distributions — engineered for serious capital.
        </p>

        {/* Trust metrics — single panel */}
        <GlassPanel className="mt-10 w-full px-0 py-0">
          <div className="grid grid-cols-3">
            {[
              { v: "₹4.8 Cr+", l: "Capital Deployed" },
              { v: "320+", l: "Private Investors" },
              { v: "24+", l: "Months Track" },
            ].map((m, i) => (
              <div key={m.l} className={`px-5 py-6 text-center ${i !== 0 ? "border-l border-[rgba(231,201,138,0.14)]" : ""}`}>
                <div className="font-display text-[22px] gold-text">{m.v}</div>
                <div className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/55">{m.l}</div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <div className="mt-10 flex w-full flex-col gap-3">
          <PremiumButton onClick={() => toast.success("Application received", { description: "We'll review within 24 hours." })}>
            Join The Waitlist <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </PremiumButton>
          <PremiumButton variant="outline" onClick={() => toast("Concierge will be in touch shortly.")}>
            Become A Customer
          </PremiumButton>
        </div>

        <p className="mt-5 flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-white/45">
          <Lock className="h-3 w-3" strokeWidth={1.5} /> Applications reviewed within 24 hours
        </p>
      </div>

      {/* Footer trust */}
      <div className="mt-16 flex flex-col items-center text-center">
        <p className="eyebrow">Trusted By Professionals, Entrepreneurs & Growth Investors</p>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["#3a1320", "#5A1022", "#C89A63", "#8a6a3f"].map((c) => (
              <span
                key={c}
                className="inline-block h-7 w-7 rounded-full border border-white/20"
                style={{ background: c }}
              />
            ))}
          </div>
          <span className="text-[12px] text-white/65">+316 verified members</span>
        </div>

        <div className="mt-12 flex items-center justify-between w-full text-[10px] tracking-[0.22em] uppercase text-white/35">
          <span>01 / 04</span>
          <Link to="/home" className="flex items-center gap-2 text-[var(--color-champagne)]/80 hover:text-[var(--color-champagne)]">
            Enter Platform <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </main>
  );
}
