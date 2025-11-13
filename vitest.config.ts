import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Configuración para simular un navegador
    environment: 'jsdom',
    // Setup para Testing Library (para usar expect(...).toBeInTheDocument())
    globals: true,
    setupFiles: ['./tests/unit/setup.ts'], 
  },
  // Resuelve los alias de TS (ej. `~/components`) en los tests
  resolve: {
    alias: {
      '~': '/src',
    },
  },
});