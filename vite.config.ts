import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base: the site works from any sub-path (GitHub Pages serves it under /abakode/).
// Runtime asset paths in src/ are relative too (no leading slash) for the same reason.
export default defineConfig({ base: './', plugins: [react()] })
