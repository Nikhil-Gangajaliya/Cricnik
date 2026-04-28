import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: ['favicon.png'],

      // 🔥 IMPORTANT (fix service worker in localhost)
      devOptions: {
        enabled: true
      },

      manifest: {
        name: 'Cricnik',
        short_name: 'Cricnik',

        start_url: '/',
        display: 'standalone',

        background_color: '#0f172a',
        theme_color: '#0f172a',

        orientation: 'portrait',

        icons: [
          {
            src: '/icon-192.png',   // ✅ correct
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',   // ✅ correct
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})