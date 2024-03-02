import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      "/api/foodvc": {
      target: "https://foodvc-server.onrender.com",
      changeOrigin: true,
      },
      "/inventory": {
        target: "https://foodvc-server.onrender.com",
        changeOrigin: true,
        },
      }
  },
})
