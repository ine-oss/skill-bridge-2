import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      // In development, "/api/*" is forwarded to the Next.js backend, so the browser
      // talks to one origin and no CORS setup is needed.
      proxy: {
        '/api': { target: env.BACKEND_URL || 'http://localhost:4000', changeOrigin: true },
      },
    },
  }
})
