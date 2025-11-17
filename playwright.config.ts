import { defineConfig, devices } from '@playwright/test';

// La URL base de nuestro servidor de desarrollo
const baseURL = 'http://localhost:4321';

export default defineConfig({
  // ¡Tests en paralelo!
  workers: '100%',
  
  // Directorio de los tests (como en nuestra arquitectura)
  testDir: './tests',

  // Timeout global (5 segundos por test es generoso)
  timeout: 5 * 1000,
  
  // El comando para levantar el servidor
  // webServer: {
  //   command: 'pnpm run dev',
  //   url: baseURL,
  //   reuseExistingServer: !process.env.CI, // Reutiliza el server si estás en local
  //   timeout: 120 * 1000,
  // },

  use: {
    // URL base para todas las acciones (ej. page.goto('/'))
    baseURL: baseURL,
    // Graba trazas solo en el primer reintento fallido (vital para CI)
    trace: 'on-first-retry',
    bypassCSP: true,
    javaScriptEnabled: true,
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache',
    },
  },

  // Configuración de navegadores
  projects: [
    // --- PROYECTOS E2E / INTEGRACIÓN ---
    // (Corren en ambos navegadores)
    { 
      name: 'chromium-e2e', 
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/(e2e|integration)\/.*\.spec\.ts/
    },
    { 
      name: 'firefox-e2e', 
      use: { ...devices['Desktop Firefox'] },
      timeout: 12000,
      testMatch: /tests\/(e2e|integration)\/.*\.spec\.ts/ 
    },

    // --- PROYECTO A11Y ---
    // (¡Solo corre en Chromium, que SÍ funciona!)
    {
      name: 'chromium-a11y',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/a11y\/.*\.spec\.ts/,
      timeout: 12000,
    }
  ],
});