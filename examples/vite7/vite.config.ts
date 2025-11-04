import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteplugin from 'react-display-name-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteplugin()],
})
