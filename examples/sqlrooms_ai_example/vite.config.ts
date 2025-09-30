import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'zustand',
      'swr',
      'use-sync-external-store',
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/index.js',
    ],
    exclude: [],
    force: true,
  },
  build: {
    rollupOptions: {
      external: (id) => id === 'ai' || id.startsWith('@ai-sdk/'),
    },
  },
});


