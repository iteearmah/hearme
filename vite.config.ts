import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "icons/apple-touch-icon.png",
        "icons/icon-192.png",
        "icons/icon-512.png",
      ],
      manifest: {
        id: "/",
        name: "HearMe — say it so she hears it",
        short_name: "HearMe",
        description:
          "Rewrite blunt, logical messages into warm, emotionally intelligent ones she will actually want to hear.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone"],
        orientation: "portrait",
        background_color: "#fbf7fb",
        theme_color: "#fbf7fb",
        categories: ["lifestyle", "productivity", "utilities"],
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "New rewrite",
            short_name: "Rewrite",
            url: "/?tab=write",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: "NetworkOnly",
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    port: 5173,
    // Dev only: run the serverless handler locally with
    //   node --experimental-strip-types api/chat.ts   (see README)
    // and set DEV_API_TARGET=http://localhost:4199
    proxy: process.env.DEV_API_TARGET
      ? { "/api": { target: process.env.DEV_API_TARGET, changeOrigin: true } }
      : undefined,
  },
  preview: { port: 4173 },
});