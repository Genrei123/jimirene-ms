import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensure relative paths for assets
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Match tsconfig.json alias
    },
  },
});
