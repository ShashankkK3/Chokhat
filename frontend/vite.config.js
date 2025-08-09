import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/marketplace': 'http://localhost:5000',
      '/api': 'http://localhost:5000',
      '/dashboard': 'http://localhost:5000',
    }
  }
})