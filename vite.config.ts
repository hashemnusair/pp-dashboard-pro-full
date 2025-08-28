import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a base path suitable for GitHub Pages in production
// and "/" during local development for a smooth DX.
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/pp-dashboard-pro-full/',
  plugins: [react()]
}))
