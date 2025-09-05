// Vite configuration for Vue.js development
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Allow access from Docker containers
    port: 5173, // Default Vite port
    watch: {
      usePolling: true // Enable polling for file watching in Docker
    },
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://backend:3000', // Backend server
        changeOrigin: true
      }
    }
  }
})