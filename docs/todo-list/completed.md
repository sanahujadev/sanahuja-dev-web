# TODO LIST Completados

1.  🔴 **ROJO** (Deadpool: Test funcional/SEO falla)
2.  🟢 **VERDE** (Deadpool: Test funcional/SEO pasa con código mínimo)
3.  🎼 **COMPOSICIÓN** (Brook: Ciclo VFD de Estilizado y Aprobación del Director)
4.  🔵 **VERIFICACIÓN** (Deadpool: Test A11y pasa + Refactor Lógico)
5.  ✅ **CERRADO** (Listo para producción)

---

## 🚀 Fase 0: Configuración Inicial (El Arsenal)

La tarea actual de `next-session.md`. Hay que amueblar el taller antes de construir el cohete.

### Configuración (Deadpool - TDD)
- [✅] Inicializar `pnpm`.
- [✅] Instalar dependencias: `astro`, `playwright`, `vitest`, `@axe-core/playwright`, `sitemap`, `mdx`.
- [✅] Crear `astro.config.mjs` (con `output: 'static'`, `i18n` y `sitemap`).
- [✅] Crear `playwright.config.ts` (¡sin `webServer`!).
- [✅] Crear `vitest.config.ts` (con `getViteConfig` y alias).
- [✅] Crear `src/content/config.ts` (definiendo colecciones `blog` y `localities`).
- [✅] Crear estructura `src/i18n/` (modular, con carpetas `/es/` y `/en/`).

### Configuración (Brook - VFD)
- [✅] Instalar `tailwindcss`.
- [✅] Crear `tailwind.config.mjs` (definir colores primarios `#FF6F00`, `neutral-800`, y la tipografía `Montserrat`).
- [✅] Crear `src/styles/global.css` (para estilos globales y fuentes).
- [✅] Crear `src/layouts/BaseLayout.astro` (layout raíz con `app.css`, `lang`, `dir`, y `<head>` SEO básico).

---

## 🏗️ Fase 1: El Funnel y las Tuberías (Prioridad Técnica)

Lo que no se ve, pero nos salva de demandas y mide el éxito.

### Página: `index.astro (Redirect)` (¡NUEVA!)
- [✅] 🔴 **ROJO**: Test E2E que `/` (la raíz) devuelve un `302` (Redirect) y la `Location` header apunta a `/es/`.
- [✅] 🟢 **VERDE**: Crear `src/pages/index.astro` con el `RedirectLayout` que me has enseñado.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar el `RedirectLayout.astro` (¡el spinner y el texto que me mostraste!).
- [✅] 🔵 **VERIFICACIÓN**: Test A11y (contraste del link "haz clic aquí").
- [✅] ✅ **CERRADO**

### Página: `formulario-inicial --> cambiado a contacto`
- [✅] 🔴 **ROJO**: Test E2E que `/es/contacto/` carga, tiene `no-index`, y contiene el `iframe` del Google Form.
- [✅] 🟢 **VERDE**: Crear `src/pages/es/contacto.astro` con `meta no-index` y un `iframe` pelado.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la página (centrado, padding) para que el formulario sea usable.
- [✅] 🔵 **VERIFICACIÓN**: Test A11y (el `iframe` necesita un `title`).
- [✅] ✅ **CERRADO**

### Página: `gracias-proyecto`
- [✅] 🔴 **ROJO**: Test E2E que `/es/gracias-proyecto/` carga, tiene `no-index`, y contiene el texto de agradecimiento.
- [✅] 🟢 **VERDE**: Crear `src/pages/es/gracias-proyecto.astro` con `meta no-index` y texto hardcodeado.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la "Thank You Page" (¡clave para la confianza!).
- [✅] 🔵 **VERIFICACIÓN**: Test A11y. Refactor del texto a `i18n/es/common.json`.
- [✅] ✅ **CERRADO**

### Páginas: Legales (Privacidad, Terminos, Cookies)
- [✅] 🔴 **ROJO**: Test E2E que `/es/politica-de-privacidad`, `/es/terminos-y-condiciones`, y `/es/politica-de-cookies` existen.
- [✅] 🟢 **VERDE**: Crear los 3 archivos `.astro` con `BaseLayout` y texto *lorem ipsum*.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la plantilla legal (texto legible, layout simple).
- [✅] 🔵 **VERIFICACIÓN**: Test A11y (legibilidad).
- [✅] ✅ **CERRADO**

### Página: `404.astro` (¡Plan Actualizado!)
- [✅] 🔴 **ROJO**: Test E2E que una ruta inexistente (`/chimichanga`) renderiza el `<h1>` del JSON de `404`.
- [✅] 🟢 **VERDE**: Crear `src/pages/404.astro` usando `BaseLayout` y el `HeroSection` (feo) como me has enseñado.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar el `HeroSection` de la 404.
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### Página: `500.astro` (¡NUEVA!)
- [✅] 🔴 **ROJO**: Test E2E (mockeado) que un error de servidor renderiza el `<h1>` del JSON de `500`.
- [✅] 🟢 **VERDE**: Crear `src/pages/500.astro` usando `BaseLayout` y el `HeroSection` (feo) como me has enseñado.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar el `HeroSection` de la 500.
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

---

## 🏛️ Fase 2: El "Core" (La Fachada Principal)

Las páginas que definen la marca. Prioridad P2.

### Componentes: `Header` y `Footer`
- [✅] 🔴 **ROJO**: Test de Integración (`tests/integration/AppHeader.spec.ts`) falla porque el `BaseLayout` no lo renderiza.
- [✅] 🟢 **VERDE**: Crear `AppHeader.astro` y `AppFooter.astro` (feos, stubs) e importarlos en `BaseLayout.astro`.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar Header/Footer (fondo oscuro, acento naranja). *¡Ciclo de Feedback del Director aquí!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y (contraste, `aria-label`s, `aria-expanded`). Refactor de `AppHeader.astro` para consumir el JSON de Burro.
- [✅] ✅ **CERRADO**

### Página: `Sobre Mí (/sobre-mi)`
- [✅] 🔴 **ROJO**: Test SEO (`<title>`, `<h1>` "Mi Historia: De la teoría a la trinchera", `hreflang`).
- [✅] 🟢 **VERDE**: Crear `src/pages/es/sobre-mi.astro` con el `<h1>` y los párrafos de BIO y Hobbies hardcodeados.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la página (¡clave para la confianza!). *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y. Refactor de todo el copy a `i18n`.
- [✅] ✅ **CERRADO**

### Página: `Contacto (/contacto)`
- [✅] 🔴 **ROJO**: Test SEO (`<title>`, `<h1>`, `hreflang`). Test E2E (Debe tener 3 CTAs: link a `/formulario-inicial/`, link `mailto:`, link `whatsapp:`).
- [✅] 🟢 **VERDE**: Crear `src/pages/es/contacto.astro` con los 3 links hardcodeados.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la página, destacando el formulario como la conversión clave. *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y. Refactor de copy a `i18n`.
- [✅] ✅ **CERRADO**

---

## 💰 Fase 3: La Oferta (Servicios y Packs)

El "gancho" y los productos recurrentes. Aquí es donde ganamos dinero.

### Landing: `Diseño Web Tenerife (Gancho)`
- [✅] 🔴 **ROJO**: Test SEO (KW Principal: "diseño web tenerife"), `<h1>`, `hreflang`, y CTA (¡Pasado!).
- [✅] 🟢 **VERDE**: Creado `diseno-web-tenerife.astro`, arreglados `<h1>`s, arreglado `BaseLayout` (¡Pasado!).
- [✅] 🎼 **COMPOSICIÓN**: Estilos de Brook aplicados (¡Pasado!).
- [✅] 🔵 **VERIFICACIÓN**: Test A11y (`2 passed`) y Test Refactor (`hreflang`) (`2 passed`) (¡Pasado!).
- [✅] **CERRADO** (¡OBJETIVO ABATIDO!)

### Landing: `Mantenimiento Web`
- [✅] 🔴 **ROJO**: Test SEO (KW Principal: "mantenimiento web tenerife"), `<h1>`, CTA a formulario.
- [✅] 🟢 **VERDE**: Crear `src/pages/es/servicios/mantenimiento-web.astro` con H1 y CTA.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "Socio Digital" y "No abandono"). *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### Landing: `Gestión Reputación Online`
- [✅] 🔴 **ROJO**: Test SEO (KW: "gestion reputacion online tenerife"), `<h1>`, CTA a formulario.
- [✅] 🟢 **VERDE**: Crear `src/pages/es/servicios/gestion-reputacion-online.astro` con H1 y CTA.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en GMB y "competencia dormida"). *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### Landing: `Mantenimiento Web` [cite: 711]
- [✅] 🔴 **ROJO**: Test SEO (KW Principal: "mantenimiento web tenerife" [cite: 749]), `<h1>`, CTA a formulario[cite: 763].
- [✅] 🟢 **VERDE**: Crear `src/pages/es/servicios/mantenimiento-web.astro` con H1 y CTA.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "Socio Digital" y "No abandono")[cite: 752, 761]. *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### Landing: `Gestión Reputación Online` [cite: 711]
- [✅] 🔴 **ROJO**: Test SEO (KW: "gestion reputacion online tenerife" [cite: 772]), `<h1>`, CTA a formulario[cite: 785].
- [✅] 🟢 **VERDE**: Crear `src/pages/es/servicios/gestion-reputacion-online.astro` con H1 y CTA.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en GMB y "competencia dormida")[cite: 779, 783]. *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### Landing: `Plan de Autoridad Mensual` [cite: 711]
- [✅] 🔴 **ROJO**: Test SEO (`<h1>`, CTA a formulario).
- [✅] 🟢 **VERDE**: Crear `src/pages/es/servicios/plan-de-autoridad-mensual.astro`.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en SEO a largo plazo)[cite: 391]. *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### Landing: `Informe Visibilidad Web` [cite: 711]
- [✅] 🔴 **ROJO**: Test SEO (`<h1>`, CTA a formulario).
- [✅] 🟢 **VERDE**: Crear `src/pages/es/servicios/informe-visibilidad-web.astro`.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "interprete de datos")[cite: 379]. *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### Landing: `Bolsa de Horas` [cite: 711]
- [✅] 🔴 **ROJO**: Test SEO (`<h1>`, CTA a formulario).
- [✅] 🟢 **VERDE**: Crear `src/pages/es/servicios/bolsa-de-horas.astro`.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "flexibilidad")[cite: 407]. *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### Packs: `/packs/ (Índice)` [cite: 711]
- [✅] 🔴 **ROJO**: Test E2E (Debe mostrar los 3 packs: "Solución Integral" [cite: 426], "Sociotécnico" [cite: 429], "Todo en Uno" [cite: 432]).
- [✅] 🟢 **VERDE**: Crear `src/pages/es/packs/index.astro` con los 3 packs hardcodeados.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la tabla comparativa de packs. *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y. Refactor a `i18n`.
- [✅] ✅ **CERRADO**

### Packs: Landings de Packs (Sociotécnico, etc.) [cite: 711]
- [✅] 🔴 **ROJO**: Test SEO (`<h1>` "Pack Sociotécnico Digital" [cite: 818]), CTA a formulario[cite: 830].
- [✅] 🟢 **VERDE**: Crear `src/pages/es/packs/pack-sociotecnico-digital.astro` con H1 y CTA.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "ahorro")[cite: 821]. *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**
- [✅] ... (Repetir para los otros 2 packs) ...

---

## 🌎 Fase 4: Autoridad y Dominio (El Juego Largo) [cite: 711]

Aquí es donde aplastamos a la competencia[cite: 635].

### Blog: Índice `/blog` [cite: 711]
- [✅] 🔴 **ROJO**: Test E2E que `/es/blog` renderiza una lista de posts de `src/content/blog/es/`.
- [✅] 🟢 **VERDE**: Crear `src/pages/es/blog/index.astro` usando `getCollection('blog', 'es')`.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar el listado de artículos (cards, layout). *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

### SEO Programático: `[localidad]` [cite: 711]
- [✅] 🔴 **ROJO**: Test E2E que `/es/diseno-web-en/la-orotava` [cite: 702] renderiza una página con el H1 "Diseño Web en La Orotava" (usando datos de `src/content/localities/`).
- [✅] 🟢 **VERDE**: Crear `src/pages/es/diseno-web-en/[localidad].astro` con `getStaticPaths` y `getCollection('localities')`.
- [✅] 🎼 **COMPOSICIÓN**: Estilizar la plantilla programática (debe sentirse única, no spam). *¡Ciclo de Feedback del Director!*
- [✅] 🔵 **VERIFICACIÓN**: Test A11y.
- [✅] ✅ **CERRADO**

---

## 🌍 Fase 5: Internacionalización (El Espejo)

¡El gran duplicado!

- [✅] 🔴 **ROJO**: Test E2E (`i18n.e2e.spec.ts`) que *rastree* la web en `/es/` y verifique que CADA página tiene su gemela en `/en/` y que los `hreflang` son recíprocos y correctos.
- [M] ... (Esto es un meta-ítem que se trabaja en paralelo)...
- [✅] 🔵 **VERIFICACIÓN**: Rellenar `en.json` con todas las traducciones. Crear el contenido en `src/content/blog/en/`.
- [✅] ✅ **CERRADO**: El test E2E de `hreflang` pasa al 100%.