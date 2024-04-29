import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['axios'] // Aquí se especifica que "axios" es una dependencia externa
    }
  }
});