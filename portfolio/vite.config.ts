import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const statsPort = process.env.STATS_PORT || '3001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/stats': {
        target: `http://localhost:${statsPort}`,
        changeOrigin: true,
      },
    },
  },
})
