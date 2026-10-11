import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
    // content/content.js lives one level up and is shared with the server
    fs: { allow: ['..'] },
  },
});
