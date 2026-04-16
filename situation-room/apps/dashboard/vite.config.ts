import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Permettre les connexions depuis l'extérieur (utile en environnement Docker)
    host: '0.0.0.0',
  },
  build: {
    // Optimisation pour les serveurs avec peu de RAM
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les librairies volumineuses pour un meilleur caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          refine: ['@refinedev/core', '@refinedev/react-router-v6'],
        },
      },
    },
  },
});
