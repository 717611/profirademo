import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    pages: [
      { path: "/", prerender: { enabled: true } },
      { path: "/home", prerender: { enabled: true } },
      { path: "/about", prerender: { enabled: true } },
      { path: "/portfolio", prerender: { enabled: true } },
    ],
  },
  nitro: { preset: "static" },
});
