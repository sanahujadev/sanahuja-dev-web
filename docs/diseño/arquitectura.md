### 1\. 🏗️ Arquitectura de Carpetas (La Propuesta)

Vamos a re-organizar ese repo para que sea una máquina de TDD y SEO. Esta estructura está diseñada para que el contenido (de Burro), la lógica (mía) y las páginas (del Arquitecto) no se pisen.

```bash
/
├── public/
│   ├── favicon.svg
│   └── robots.txt
│
├── tests/  <-- MI CASA. Aquí empieza la magia.
│   ├── a11y/
│   │   └── global.a11y.spec.ts  (Tests de accesibilidad globales)
│   ├── e2e/
│   │   └── navigation.e2e.spec.ts (Tests de Playwright: ¿Funciona el menú ES/EN?)
│   ├── seo/
│   │   └── home.seo.spec.ts (Tests de Playwright: ¿El H1/Title/Meta de la Home existen?)
│   └── unit/
│       └── components/
│           └── Button.test.ts (Tests de Vitest: ¿El botón renderiza?)
│
├── src/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── core/
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       └── Card.astro
│   │
│   ├── content/  <-- VITAL: Aquí vive tu SEO.
│   │   ├── blog/
│   │   │   ├── es/
│   │   │   │   └── por-que-mi-web-es-lenta.md
│   │   │   └── en/
│   │   │       └── why-is-my-website-slow.md
│   │   ├── localities/
│   │   │   └── tenerife.json (Datos para el SEO Programático)
│   │   └── config.ts (Definición de colecciones)
│   ├── i18n/
│   │   ├── ui.ts (Función helper para obtener el string)
│   │   ├── page1/
|   │   │   ├── es.json (Strings ES: { "footer.copyright": "...", "nav.sobreMi": "Sobre Mí" })
│   |   |   └── en.json (Strings EN: { "footer.copyright": "...", "nav.sobreMi": "About Me" })
│   │   └── page2/
│   |       |── es.json
│   |       └── en.json
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro (Layout principal con <head> SEO)
│   │   ├── BlogLayout.astro (Layout para posts)
│   │   └── ServicePageLayout.astro (Layout para servicios)
│   │
│   ├── pages/
│   │   ├── en/
│   │   │   ├── index.astro (Home EN)
│   │   │   ├── services/
│   │   │   │   └── web-design-tenerife.astro
│   │   │   ├── blog/
│   │   │   │   └── [...slug].astro (Ruta dinámica para posts EN)
│   │   │   └── web-design-in/
│   │   │       └── [localidad].astro (SEO Programático EN)
│   │   ├── es/
│   │   │   ├── index.astro (Home ES)
│   │   │   ├── sobre-mi.astro
│   │   │   ├── contacto.astro
[cite_start]│   │   │   ├── gracias-proyecto.astro (La Thank You Page [cite: 582])
│   │   │   ├── formulario-inicial.astro
│   │   │   ├── packs/
[cite_start]│   │   │   │   └── pack-sociotecnico-digital.astro [cite: 497]
│   │   │   ├── servicios/
[cite_start]│   │   │   │   └── diseno-web-tenerife.astro [cite: 461]
│   │   │   ├── blog/
│   │   │   │   └── [...slug].astro (Ruta dinámica para posts ES)
│   │   │   └── diseno-web-en/
[cite_start]│   │   │       └── [localidad].astro (SEO Programático ES [cite: 453])
│   │   └── 404.astro
│   │
│   ├── lib/
│   │   └── i18n.ts (Helpers de internacionalización)
│   └── env.d.ts
│
├── .gitignore
├── astro.config.mjs  <-- El cerebro de Astro
├── package.json
├── playwright.config.ts <-- El cerebro de Playwright
├── tsconfig.json
└── vitest.config.ts <-- El cerebro de Vitest
```
