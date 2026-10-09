import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En GitHub Pages el sitio vive en /altai-ridge-web/; en desarrollo, en la raíz.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/altai-ridge-web/' : '/',
  plugins: [react()],
  server: { port: 5173 },
}));
