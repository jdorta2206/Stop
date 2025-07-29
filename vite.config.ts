import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'process.env': import.meta.env, // Opcional, para compatibilidad
  },
  plugins: [react()],
  base: '/', // Ruta base para Netlify
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));