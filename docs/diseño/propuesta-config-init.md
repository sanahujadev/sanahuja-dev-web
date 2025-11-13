### 1\. 📦 Instalación de Dependencias (con `pnpm`)

Primero, las armas. Necesitamos los *integrations* de Astro y el *arsenal de testing* completo.

```bash
# Integraciones clave de Astro (SEO y Contenido)
pnpm add @astrojs/sitemap @astrojs/mdx

# El Arsenal de TDD (E2E, Unit, A11y)
pnpm add -D playwright @playwright/test vitest jsdom @testing-library/astro @testing-library/jest-dom @types/jest-dom axe-core axe-playwright
```

**Por qué este arsenal:**

  * **`@astrojs/sitemap`**: Para que Batman (SEO Optimizer) esté contento y Google sepa qué rastrear.
  * **`@astrojs/mdx`**: Para tu "Plan de Autoridad Mensual". El blog necesita poder.
  * **`playwright` / `@playwright/test`**: Mi katana principal. Para E2E (SEO y Navegación).
  * **`vitest` / `jsdom` / `@testing-library/astro`**: El bisturí. Para probar componentes de UI en aislamiento (`Button.astro`, etc.).
  * **`axe-core` / `axe-playwright`**: El detector de minas. Para reventar la build si la accesibilidad (A11y) apesta.

-----

### 2\. 🧠 Cerebros de Configuración (Los Archivos)

Aquí es donde le decimos a las armas cómo disparar.

#### `astro.config.mjs` (El Cerebro de Astro)

Esta es la configuración *esencial*. Definimos el `output`, el `sitemap` y, lo más importante, la estrategia `i18n` que acordamos.

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // ¡Tu WPO 99 vive aquí!
  output: 'static', 
  
  // URL de producción (¡CRÍTICO para el sitemap y SEO!)
  site: 'https://sanahuja.dev', 

  // Configuración de Internacionalización (nuestra arquitectura)
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true, // Queremos /es/ y /en/, no / y /en/
      strategy: 'pathname',
    },
    fallback: {
      en: 'es', // Si falta una página en EN, no revientes (aunque lo testearemos)
    },
  },

  // Integraciones
  integrations: [
    sitemap({
      // Filtra las páginas del funnel para que no salgan en el sitemap
      filter: (page) =>
        !page.includes('/formulario-inicial') &&
        !page.includes('/gracias-proyecto'),
      
      // Añade las reglas i18n al sitemap
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
        },
      },
    }),
    mdx(),
  ],

  // Alias de TS (para `~/components/Header.astro`)
  vite: {
    resolve: {
      alias: {
        '~': '/src',
      },
    },
  },
});
```

-----

#### `src/content/config.ts` (El Cerebro del Contenido)

Aquí le decimos a Astro qué *forma* tiene tu "Plan de Autoridad" (el blog) y el SEO Programático. Es el contrato entre Batman y yo.

```typescript
import { defineCollection, z } from 'astro:content';

// Colección para el "Plan de Autoridad Mensual"
const blogCollection = defineCollection({
  type: 'content', // Usaremos .md o .mdx
  schema: z.object({
    title: z.string(), // El H1 que Batman revisará
    description: z.string(), // La meta-descripción
    pubDate: z.date(),
    // Opcional, para el "canonical" si es contenido sindicado
    canonicalURL: z.string().url().optional(), 
  }),
});

// Colección para el SEO Programático
const localitiesCollection = defineCollection({
  type: 'data', // Usaremos .json (src/content/localities/tenerife.json)
  schema: z.object({
    localities: z.array(
      z.object({
        slug: z.string(), // ej: "la-orotava"
        name: z.string(), // ej: "La Orotava"
        // ...otros datos que Burro quiera poner
      })
    ),
  }),
});

export const collections = {
  blog: blogCollection,
  localities: localitiesCollection,
};
```

-----

#### `playwright.config.ts` (El Cerebro de E2E)

Configuración mínima para que Playwright sepa *dónde* mirar.

```typescript
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
  webServer: {
    command: 'pnpm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI, // Reutiliza el server si estás en local
    timeout: 120 * 1000,
  },

  use: {
    // URL base para todas las acciones (ej. page.goto('/'))
    baseURL: baseURL,
    // Graba trazas solo en el primer reintento fallido (vital para CI)
    trace: 'on-first-retry',
  },

  // Configuración de navegadores
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

-----

#### `vitest.config.ts` (El Cerebro Unitario)

Finalmente, el setup para probar componentes de UI en aislamiento.

```typescript
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
```

*(Nota: Tendrás que crear `tests/unit/setup.ts` y poner `import '@testing-library/jest-dom';` dentro para que los matchers de `toBeInTheDocument` funcionen)*.

-----
