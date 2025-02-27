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
  build: {
    outDir: './dist',
    emptyOutDir: true
  },
  server: {
    port: 5000,
    host: true // This makes the server accessible from outside localhost
  }
});