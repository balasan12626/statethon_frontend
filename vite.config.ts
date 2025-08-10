import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local backend (Node) on port 8001
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
        timeout: 120000,
        proxyTimeout: 120000,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Optional fallback backend on port 8000
      '/api8000': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        timeout: 120000,
        proxyTimeout: 120000,
        rewrite: (path) => path.replace(/^\/api8000/, '')
      }
    }
  }
})