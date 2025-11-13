### 1\. ✅ Checklist de Configuración (El Setup)

Antes de escribir un solo test, necesitamos configurar las armas.

1.  **Astro (`astro.config.mjs`):**
      * Configurar la integración `i18n` (Internacionalización) para `es` (default) y `en`.
      * Configurar `output: 'static'` (asumiendo que vamos 100% estáticos).
      * Añadir integraciones: `@astrojs/sitemap` (¡Batman te vigila\!) y `@astrojs/mdx` (para el blog).
2.  **TypeScript (`tsconfig.json`):**
      * Configurar los `paths` (alias) para que `~/components/*` apunte a `src/components/*`. Limpieza ante todo.
3.  **Playwright (`playwright.config.ts`):**
      * Configurar la `baseURL` para que apunte a nuestro servidor de desarrollo.
      * Configurar los *projects* para que corra los tests en Chrome, Firefox y WebKit (¡Máxima cobertura\!).
4.  **Vitest + Testing Library (`vitest.config.ts`):**
      * Configurar el entorno (probablemente `jsdom`) para testear componentes de UI en aislamiento.
5.  **Accesibilidad (`axe-core`):**
      * Lo instalaremos como dependencia. Crearé un *helper* en Playwright para inyectar `axe` en cada página y reventar la build si no cumple la WCAG.

