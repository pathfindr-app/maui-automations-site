import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/maui-automations-site/',
  plugins: [react()],
})
