import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared')
    },
  },
  server: {
    host: '0.0.0.0', // This makes the server accessible from outside localhost
    port: 5000,
    strictPort: true, // Ensures the server only tries to use the specified port
    hmr: true // Enable hot module replacement for development
  }
});