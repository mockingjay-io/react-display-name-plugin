import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteplugin from '@mockingjay-io/webpack-react-component-name/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteplugin()],
})
