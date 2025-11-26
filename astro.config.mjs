import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // ¡Tu WPO 99 vive aquí!
  output: 'static', 
  
  // URL de producción (¡CRÍTICO para el sitemap y SEO!)
  site: 'https://sanahuja.dev', 
  env: {
    schema: {
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      API_URL: envField.string({ context: "client", access: "public" }),
      API_KEY: envField.string({ context: "client", access: "public" }),
      PUBLIC_GTM_ID: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
  // Configuración de Internacionalización (nuestra arquitectura)
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true, // Queremos /es/ y /en/, no / y /en/
      redirectToDefaultLocale: false,
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

    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
    },
    css: {
      transformer: 'lightningcss',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  }
});