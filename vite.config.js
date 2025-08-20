import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
  plugins: [react()],
  base: './', // مهم جداً عشان يحل مشكلة المسارات
  resolve: {
    alias: { 
      '@': path.resolve(__dirname, './src'),

    },
  },

});
