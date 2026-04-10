import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use /safarnama/ base for GitHub Pages deploy
// Use / for Capacitor mobile app (no subdirectory)
const isCapacitor = process.env.CAPACITOR === 'true';

export default defineConfig({
  plugins: [react()],
  base: isCapacitor ? '/' : '/safarnama/',
})
