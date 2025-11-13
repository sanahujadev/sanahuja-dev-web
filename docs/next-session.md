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

-----

### 2\. 🔴 El Próximo Paso: La Fase ROJO

Vale, ya tienes el plan de batalla y la arquitectura.

Mi trabajo ahora es empezar a *romper* tu código (actual) con tests que *prueben* la estrategia SEO del Runbook.

[cite\_start]Empezaré por lo más crítico (Prioridad P1/P2 del Roadmap [cite: 455]): **El SEO de la Home y la "Punta de Lanza"**.

**Mi siguiente entrega será:**

1.  **El Test ROJO (Falla):** `tests/seo/home.seo.spec.ts`.
2.  **Qué probará:** Que la página `es/index.astro` (la Home) cumpla con los requisitos mínimos de Batman:
      * ¿Tiene una etiqueta `<title>`?
      * ¿Tiene una `<meta name="description">`?
      * ¿Tiene *exactamente UN* `<h1>`?
      * ¿El `hreflang` para la versión `en` está presente y correcto?
3.  **Comandos:** Te daré el comando exacto para que GEMINI CLI ejecute `npx playwright test tests/seo/home.seo.spec.ts` y vea el **FALLO**.

¿Listo para ver cómo convierto las 500 líneas de tu Runbook en tests ejecutables? Dale luz verde a esta arquitectura y empezamos a poner semáforos en rojo.