import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standard Vite + React setup. The dev server runs on :5173 by default.
export default defineConfig({
  plugins: [react()],
})
