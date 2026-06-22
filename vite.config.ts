import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    // Prerender all four routes to static HTML for Vercel deployment.
    // Inside Lovable the wrapper forces the Cloudflare preset, so this is
    // a no-op there; outside Lovable the `nitro` override below selects the
    // `static` preset and Nitro runs the prerenderer.
    pages: [
      { path: "/", prerender: { enabled: true } },
      { path: "/home", prerender: { enabled: true } },
      { path: "/about", prerender: { enabled: true } },
      { path: "/portfolio", prerender: { enabled: true } },
    ],
  },
  nitro: { preset: "static" },
});
