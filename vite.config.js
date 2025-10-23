import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ['es2015', 'chrome61', 'firefox60', 'safari12', 'edge18'],
    polyfillModulePreload: true,
    cssTarget: ['chrome61', 'firefox60', 'safari12', 'edge18']
  },
  server: {
    port: 3000,
    open: true
  }
})