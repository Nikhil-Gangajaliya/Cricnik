import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },


      manifest: {
        name: "Cricnik",
        short_name: "Cricnik",
        description: "Cricket scoring app",

        start_url: "/",
        display: "standalone",

        background_color: "#0b3d2e",   // dark green bg
        theme_color: "#1db954",        // primary green

        orientation: "portrait",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      }
    }),
  ],
});