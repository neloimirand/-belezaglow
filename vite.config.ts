
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Essencial para evitar erros de origem em ambientes de preview/sandboxes
  define: {
    // Garante que o SDK do Gemini encontre process.env.API_KEY no browser
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    port: 3000
  }
});
