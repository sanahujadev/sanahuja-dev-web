# La Lista Maestra (WIP)

Esta es la hoja de ruta. Es nuestro "contrato de sangre" para construir `sanahuja-dev-web`. Cada ítem debe pasar por nuestro protocolo TDD-VFD:

1.  🔴 **ROJO** (Deadpool: Test funcional/SEO falla)
2.  🟢 **VERDE** (Deadpool: Test funcional/SEO pasa con código mínimo)
3.  🎼 **COMPOSICIÓN** (Brook: Ciclo VFD de Estilizado y Aprobación del Director)
4.  🔵 **VERIFICACIÓN** (Deadpool: Test A11y pasa + Refactor Lógico)
5.  ✅ **CERRADO** (Listo para producción)

---

## 🚀 Fase 0: Configuración Inicial (El Arsenal)

La tarea actual de `next-session.md`. Hay que amueblar el taller antes de construir el cohete.

### Configuración (Deadpool - TDD)
- [ ] Inicializar `pnpm`.
- [ ] Instalar dependencias: `astro`, `playwright`, `vitest`, `axe-core`, `sitemap`, `mdx`.
- [ ] [cite_start]Crear `astro.config.mjs` (con `output: 'static'`, `i18n` [cite: 305, 492] [cite_start]y `sitemap` [cite: 711]).
- [ ] Crear `playwright.config.ts` (con `webServer` y `baseURL`).
- [ ] Crear `vitest.config.ts` (con `jsdom` y alias).
- [ ] [cite_start]Crear `src/content/config.ts` (definiendo colecciones `blog` y `localities`)[cite: 699, 702].
- [ ] Crear estructura `src/i18n/` (`es.json`, `en.json`, `ui.ts`).

### Configuración (Brook - VFD)
- [ ] Instalar `tailwindcss`.
- [ ] [cite_start]Crear `tailwind.config.mjs` (definir colores primarios `#FF6F00` [cite: 87][cite_start], `neutral-800` [cite: 84][cite_start], y la tipografía `Montserrat` [cite: 88]).
- [ ] Crear `src/styles/app.css` (para estilos globales y fuentes).
- [ ] Crear `src/layouts/BaseLayout.astro` (layout raíz con `app.css`, `lang`, `dir`, y `<head>` SEO básico).

---

## 🏗️ Fase 1: El Funnel y las Tuberías (Prioridad Técnica)

Lo que no se ve, pero nos salva de demandas y mide el éxito.

### Página: `formulario-inicial`
- [ ] [cite_start]🔴 **ROJO**: Test E2E que `/es/formulario-inicial/` carga, tiene `no-index` [cite: 711][cite_start], y contiene el `iframe` del Google Form[cite: 711].
- [ ] 🟢 **VERDE**: Crear `src/pages/es/formulario-inicial.astro` con `meta no-index` y un `iframe` pelado.
- [ ] 🎼 **COMPOSICIÓN**: Estilizar la página (centrado, padding) para que el formulario sea usable.
- [ ] 🔵 **VERIFICACIÓN**: Test A11y (el `iframe` necesita un `title`).
- [ ] ✅ **CERRADO**

### Página: `gracias-proyecto`
- [ ] [cite_start]🔴 **ROJO**: Test E2E que `/es/gracias-proyecto/` carga, tiene `no-index` [cite: 711][cite_start], y contiene el texto de agradecimiento[cite: 958].
- [ ] 🟢 **VERDE**: Crear `src/pages/es/gracias-proyecto.astro` con `meta no-index` y texto hardcodeado.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la "Thank You Page" (¡clave para la confianza!)[cite: 91, 94].
- [ ] 🔵 **VERIFICACIÓN**: Test A11y. Refactor del texto a `i18n/es.json`.
- [ ] ✅ **CERRADO**

### [cite_start]Páginas: Legales (Privacidad, Terminos, Cookies) [cite: 711]
- [ ] 🔴 **ROJO**: Test E2E que `/es/politica-de-privacidad`, `/es/terminos-y-condiciones`, y `/es/politica-de-cookies` existen.
- [ ] 🟢 **VERDE**: Crear los 3 archivos `.astro` con `BaseLayout` y texto *lorem ipsum*.
- [ ] 🎼 **COMPOSICIÓN**: Estilizar la plantilla legal (texto legible, layout simple).
- [ ] 🔵 **VERIFICACIÓN**: Test A11y (legibilidad).
- [ ] ✅ **CERRADO**

### Página: `404.astro`
- [ ] 🔴 **ROJO**: Test E2E que una ruta inexistente (`/chimichanga`) renderiza el contenido del 404.
- [ ] 🟢 **VERDE**: Crear `src/pages/404.astro` con un `<h1>404</h1>`.
- [ ] 🎼 **COMPOSICIÓN**: Estilizar la página 404 (¡tiene que molar!).
- [ ] 🔵 **VERIFICACIÓN**: Test A11y. Refactor del texto a `i18n`.
- [ ] ✅ **CERRADO**

---

## [cite_start]🏛️ Fase 2: El "Core" (La Fachada Principal) [cite: 711]

Las páginas que definen la marca. Prioridad P2.

### Componentes: `Header` y `Footer`
- [ ] 🔴 **ROJO**: Test E2E (Navigation) que el `Header` tiene links (Home, Sobre Mí, Contacto) y el `Footer` tiene links legales.
- [ ] 🟢 **VERDE**: Crear `Header.astro` y `Footer.astro` feos, con links `<a>` hardcodeados, e importarlos en `BaseLayout.astro`.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar Header/Footer (fondo oscuro [cite: 84][cite_start], acento naranja [cite: 87]). *¡Ciclo de Feedback del Director aquí!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y (contraste, `aria-label`s). Refactor de todos los links/texto a `i18n`.
- [ ] ✅ **CERRADO**

### [cite_start]Página: `Home (/)` [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test SEO (`<title>`, `<meta desc>`, `hreflang`) y Test E2E (debe tener UN `<h1>` con el texto del HeroSection [cite: 131]).
- [ ] [cite_start]🟢 **VERDE**: Crear `src/pages/es/index.astro` con el `<h1>` hardcodeado[cite: 131].
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la Home (Hero [cite: 131][cite_start], secciones "Tecnología y estrategia" [cite: 134][cite_start], "Solución Diferente"[cite: 136], etc.). *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y (estructura de headings). Refactor de todo el copy a `i18n`.
- [ ] ✅ **CERRADO**

### [cite_start]Página: `Sobre Mí (/sobre-mi)` [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test SEO (`<title>`, `<h1>` "Mi Historia: De la teoría a la trinchera"[cite: 149], `hreflang`).
- [ ] [cite_start]🟢 **VERDE**: Crear `src/pages/es/sobre-mi.astro` con el `<h1>` y los párrafos de BIO [cite: 149] [cite_start]y Hobbies [cite: 155] hardcodeados.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la página (¡clave para la confianza!)[cite: 94]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y. Refactor de todo el copy a `i18n`.
- [ ] ✅ **CERRADO**

### [cite_start]Página: `Contacto (/contacto)` [cite: 711]
- [ ] 🔴 **ROJO**: Test SEO (`<title>`, `<h1>`, `hreflang`). [cite_start]Test E2E (Debe tener 3 CTAs: link a `/formulario-inicial/` [cite: 178][cite_start], link `mailto:`, link `whatsapp:`)[cite: 176, 177].
- [ ] 🟢 **VERDE**: Crear `src/pages/es/contacto.astro` con los 3 links hardcodeados.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la página, destacando el formulario como la conversión clave[cite: 173]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y. Refactor de copy a `i18n`.
- [ ] ✅ **CERRADO**

---

## [cite_start]💰 Fase 3: La Oferta (Servicios y Packs) [cite: 711]

[cite_start]El "gancho" [cite: 324] y los productos recurrentes. Aquí es donde ganamos dinero.

### [cite_start]Landing: `Diseño Web Tenerife (Gancho)` [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test SEO (KW Principal: "diseño web tenerife" [cite: 724][cite_start]), `<h1>`, `hreflang`, y un CTA principal apuntando a `/formulario-inicial/`[cite: 740].
- [ ] 🟢 **VERDE**: Crear `src/pages/es/servicios/diseno-web-tenerife.astro` con H1 y CTA.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la landing (¡agresiva, clara, WPO 99 visible!)[cite: 737]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**

### [cite_start]Landing: `Mantenimiento Web` [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test SEO (KW Principal: "mantenimiento web tenerife" [cite: 749][cite_start]), `<h1>`, CTA a formulario[cite: 763].
- [ ] 🟢 **VERDE**: Crear `src/pages/es/servicios/mantenimiento-web.astro` con H1 y CTA.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "Socio Digital" y "No abandono")[cite: 752, 761]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**

### [cite_start]Landing: `Gestión Reputación Online` [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test SEO (KW: "gestion reputacion online tenerife" [cite: 772][cite_start]), `<h1>`, CTA a formulario[cite: 785].
- [ ] 🟢 **VERDE**: Crear `src/pages/es/servicios/gestion-reputacion-online.astro` con H1 y CTA.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en GMB y "competencia dormida")[cite: 779, 783]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**

### [cite_start]Landing: `Plan de Autoridad Mensual` [cite: 711]
- [ ] 🔴 **ROJO**: Test SEO (`<h1>`, CTA a formulario).
- [ ] 🟢 **VERDE**: Crear `src/pages/es/servicios/plan-de-autoridad-mensual.astro`.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en SEO a largo plazo)[cite: 391]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**

### [cite_start]Landing: `Informe Visibilidad Web` [cite: 711]
- [ ] 🔴 **ROJO**: Test SEO (`<h1>`, CTA a formulario).
- [ ] 🟢 **VERDE**: Crear `src/pages/es/servicios/informe-visibilidad-web.astro`.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "interprete de datos")[cite: 379]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**

### [cite_start]Landing: `Bolsa de Horas` [cite: 711]
- [ ] 🔴 **ROJO**: Test SEO (`<h1>`, CTA a formulario).
- [ ] 🟢 **VERDE**: Crear `src/pages/es/servicios/bolsa-de-horas.astro`.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "flexibilidad")[cite: 407]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**

### [cite_start]Packs: `/packs/ (Índice)` [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test E2E (Debe mostrar los 3 packs: "Solución Integral" [cite: 426][cite_start], "Sociotécnico" [cite: 429][cite_start], "Todo en Uno" [cite: 432]).
- [ ] 🟢 **VERDE**: Crear `src/pages/es/packs/index.astro` con los 3 packs hardcodeados.
- [ ] 🎼 **COMPOSICIÓN**: Estilizar la tabla comparativa de packs. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y. Refactor a `i18n`.
- [ ] ✅ **CERRADO**

### [cite_start]Packs: Landings de Packs (Sociotécnico, etc.) [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test SEO (`<h1>` "Pack Sociotécnico Digital" [cite: 818][cite_start]), CTA a formulario[cite: 830].
- [ ] 🟢 **VERDE**: Crear `src/pages/es/packs/pack-sociotecnico-digital.astro` con H1 y CTA.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la landing (enfocada en "ahorro")[cite: 821]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**
- [ ] ... (Repetir para los otros 2 packs) ...

---

## [cite_start]🌎 Fase 4: Autoridad y Dominio (El Juego Largo) [cite: 711]

[cite_start]Aquí es donde aplastamos a la competencia[cite: 635].

### [cite_start]Blog: Índice `/blog` [cite: 711]
- [ ] 🔴 **ROJO**: Test E2E que `/es/blog` renderiza una lista de posts de `src/content/blog/es/`.
- [ ] 🟢 **VERDE**: Crear `src/pages/es/blog/index.astro` usando `getCollection('blog', 'es')`.
- [ ] 🎼 **COMPOSICIÓN**: Estilizar el listado de artículos (cards, layout). *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**

### [cite_start]Blog: Plantilla de Post `/blog/[...slug]` [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test E2E que `/es/blog/por-que-mi-web-es-lenta` [cite: 788] renderiza el contenido del Markdown.
- [ ] 🟢 **VERDE**: Crear `src/pages/es/blog/[...slug].astro` que renderiza el `entry.body`.
- [ ] [cite_start]🎼 **COMPOSICIÓN**: Estilizar la plantilla de post (tipografía, legibilidad, ancho de texto)[cite: 88, 923]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y (contraste, legibilidad).
- [ ] ✅ **CERRADO**

### [cite_start]SEO Programático: `[localidad]` [cite: 711]
- [ ] [cite_start]🔴 **ROJO**: Test E2E que `/es/diseno-web-en/la-orotava` [cite: 702] renderiza una página con el H1 "Diseño Web en La Orotava" (usando datos de `src/content/localities/`).
- [ ] 🟢 **VERDE**: Crear `src/pages/es/diseno-web-en/[localidad].astro` con `getStaticPaths` y `getCollection('localities')`.
- [ ] 🎼 **COMPOSICIÓN**: Estilizar la plantilla programática (debe sentirse única, no spam). *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y.
- [ ] ✅ **CERRADO**

---

## 🌍 Fase 5: Internacionalización (El Espejo)

¡El gran duplicado!

- [ ] 🔴 **ROJO**: Test E2E (`i18n.e2e.spec.ts`) que *rastree* la web en `/es/` y verifique que CADA página tiene su gemela en `/en/` y que los `hreflang` son recíprocos y correctos.
- [M] ... (Esto es un meta-ítem que se trabaja en paralelo)...
- [ ] 🔵 **VERIFICACIÓN**: Rellenar `en.json` con todas las traducciones. Crear el contenido en `src/content/blog/en/`.
- [ ] ✅ **CERRADO**: El test E2E de `hreflang` pasa al 100%.