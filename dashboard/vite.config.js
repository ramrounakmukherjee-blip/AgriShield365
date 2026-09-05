import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'

// Stamp the build with the git commit + date so the live site can show/report
// exactly which version is deployed (F12 console / Profile screen).
let buildCommit = 'dev'
try {
  buildCommit = execSync('git rev-parse --short HEAD', { cwd: '..' }).toString().trim()
} catch { /* dev / no-git fallback */ }
const buildDate = new Date().toISOString().slice(0, 10)

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUILD__: JSON.stringify(buildCommit),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Assets are precached via workbox.globPatterns below; listing them again
      // here caused an "add-to-cache-list-conflicting-entries" SW error.
      manifest: {
        name: 'AgriShield 365 — Farmer Protection',
        short_name: 'AgriShield365',
        description:
          'Early disaster & disease warnings, weather forecasts and smart irrigation advice for every farmer, in their language, 365 days a year.',
        theme_color: '#047857',
        background_color: '#052e16',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
