import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      "/api/foodvc": {
      target: "http://localhost:3000",
      changeOrigin: true,
      },
      "/inventory": {
        target: "http://localhost:3000",
        changeOrigin: true,
        },
      }
  },
})
