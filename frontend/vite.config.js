import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // or '0.0.0.0'
    //By default, Vite only trusts: localhost and 127.0.0.1
    allowedHosts: [
      'chat.rishabhkanojiya.in'
    ]
  }
})