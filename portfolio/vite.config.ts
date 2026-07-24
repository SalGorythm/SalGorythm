import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writingRssPlugin } from './vite.writingRss'

const statsPort = process.env.STATS_PORT || '3001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), writingRssPlugin()],
  server: {
    proxy: {
      '/api/stats': {
        target: `http://localhost:${statsPort}`,
        changeOrigin: true,
      },
    },
  },
})
