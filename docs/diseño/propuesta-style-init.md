### 1\. 🎵 La Nueva Paleta (Basada en su Identidad)

[cite\_start]Su marca busca ser **"Técnica", "Seria", "Confiable" y "Moderna"** [cite: 69][cite\_start], con "fondos oscuros" [cite: 63] [cite\_start]y un acento de **"Energía"** (`#FF6F00`)[cite: 65].

Basado en esto y en los colores de su CSS, he definido esta paleta de 4 escalas:

1.  **Neutral (Pizarra/Slate):** Será nuestra base para la "Seriedad" y "Modernidad". Perfecto para sus fondos oscuros y texto.
2.  [cite\_start]**Primary (Naranja):** Su color de "Energía" (`#FF6F00`)[cite: 65]. Será el centro de la acción.
3.  **Secondary (Índigo):** Su CSS menciona `indigo` (`#6366f1`). Es un color "Técnico" y "Confiable" perfecto para complementar al naranja.
4.  **Accent (Verde Azulado/Teal):** Su CSS menciona `teal` (`#14b8a6`). Lo usaremos para acentos especiales (ej. mensajes de éxito, etiquetas).

### 2\. 🎼 El Nuevo `tailwind.config.mjs` (El Cerebro)

Este será ahora el **único lugar** donde definiremos los colores. Simple y centralizado. Despedimos al bloque `@theme` y a las dobles definiciones.

```javascript
/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // O 'media', si prefiere
  theme: {
    extend: {
      fontFamily: {
        [cite_start]// Su tipografía de marca [cite: 65]
        sans: ['Montserrat', 'sans-serif'],
      },
      
      colors: {
        // NEUTRAL (Seriedad, Fondos, Texto)
        // Usamos 'slate' por su tono técnico y profesional
        neutral: colors.slate,
        
        // PRIMARY (Energía, Acción)
        [cite_start]// Basado en su naranja #FF6F00 [cite: 65]
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#FF6F00', // <-- SU COLOR DE MARCA
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        
        // SECONDARY (Confianza, Técnico)
        // Basado en su índigo #6366f1
        secondary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // <-- SU COLOR SECUNDARIO
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        
        // ACCENT (Para etiquetas, éxito, etc.)
        // Basado en su teal #14b8a6
        accent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6', // <-- SU COLOR DE ACENTO
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042f2e',
        },
      },
    },
  },
  plugins: [],
};
```

### 3\. 🎻 El Nuevo `global.css` (Simplificado)

Su `global.css` ahora será *mucho* más limpio. No más laberintos de variables.

```css
@import "tailwindcss";
@import "vanilla-cookieconsent/dist/cookieconsent.css";

/* ================================================================
  ESTILOS GLOBALES
  ================================================================
*/

html {
  scrollbar-gutter: stable;
  scroll-behavior: smooth;
}

body {
  overflow-x: hidden;
  /* Aplicamos la fuente base aquí si es necesario */
  /* font-family: 'Montserrat', sans-serif; (Tailwind ya lo hace con font-sans) */
}

/* ================================================================
  ESTILOS DE TERCEROS (Ej. Cookie Consent)
  ================================================================
*/

/* Aquí aplicamos nuestro NUEVO sistema de tokens al plugin
  de cookies. ¡Mucho más fácil de leer!
*/
#cc-main {
  --cc-bg: theme(colors.neutral.50);
  --cc-text-color: theme(colors.neutral.800);
  --cc-border-color: theme(colors.neutral.200);
  --cc-link-color: theme(colors.primary.600);

  --cc-btn-primary-bg: theme(colors.primary.600);
  --cc-btn-primary-border-color: theme(colors.primary.600);
  --cc-btn-primary-hover-bg: theme(colors.primary.700);

  --cc-btn-secondary-bg: theme(colors.neutral.100);
  --cc-btn-secondary-border-color: theme(colors.neutral.200);
  --cc-btn-secondary-text-color: theme(colors.neutral.700);
  --cc-btn-secondary-hover-bg: theme(colors.neutral.200);

  --cc-toggle-on-bg: theme(colors.primary.600);
  --cc-btn-border-radius: 9999px; /* Pill shape */
}

.cc--darkmode #cc-main {
  --cc-bg: theme(colors.neutral.800);
  --cc-text-color: theme(colors.neutral.100);
  --cc-border-color: theme(colors.neutral.700);
  --cc-link-color: theme(colors.primary.400);

  --cc-btn-secondary-bg: theme(colors.neutral.700);
  --cc-btn-secondary-border-color: theme(colors.neutral.700);
  --cc-btn-secondary-text-color: theme(colors.neutral.100);
  --cc-btn-secondary-hover-bg: theme(colors.neutral.600);
}

/* ... (Otros estilos globales como #form-status) ... */
```

### 4\. 🎹 Componentes Re-orquestados (La Prueba)

Ahora, veamos cómo esta nueva partitura simplifica su `HeroSection`. GEMINI CLI, ESTO LO VAMOS A OBVIAR DE MOMENTO

**Antes (Semántica Caótica):**
`<p class="text-text-default text-balance dark:text-text-default-dark ...">`
`<a ... before:bg-primary ...>`
`<a ... dark:before:border-border-default-dark dark:before:bg-bg-surface-dark ...>`
`<div ... border-y border-border-default dark:border-border-darker ...>`

**Después (Escala Numérica Clara):**
*(Note cómo `dark:` ahora solo aplica a los colores, no a variables semánticas)*

```html
<div class="relative" id="home">
    <div aria-hidden="true" class="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
        <div class="blur-[106px] h-56 bg-gradient-to-br from-primary-500 to-accent-400"></div>
        <div class="blur-[106px] h-32 bg-gradient-to-r from-secondary-400 to-secondary-500"></div>
    </div>
    <Container>
        <div class="relative pt-36 ml-auto">
            <div class="lg:w-2/3 text-center mx-auto">
                <h1 class="sr-only">{t.hero.seo_title}</h1>
                
                <p class="
                    text-neutral-900 text-balance dark:text-neutral-100 
                    font-bold text-5xl md:text-6xl xl:text-7xl" 
                    set:html={t.hero.headline}
                />
                
                <p class="mt-8 text-neutral-700 dark:text-neutral-300 text-lg md:text-xl">
                    {t.hero.description}
                </p>
                
                <div class="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                    <a href={t.hero.cta.primaryNavigate} class="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary-600 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max">
                        <span class="relative text-base font-semibold text-white">
                            {t.hero.cta.primary}
                        </span>
                    </a>
                    
                    <a href={t.hero.cta.secondaryNavigate} class="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-neutral-100 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 
                    dark:before:border-neutral-700 dark:before:bg-neutral-800 sm:w-max">
                        <span class="relative text-base font-semibold text-primary-600 dark:text-neutral-100">
                            {t.hero.cta.secondary}
                        </span>
                    </a>
                </div>
            </div>

            <div class="py-8 mt-16 border-y border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row justify-between gap-8 sm:gap-4">
                {t.valuePropositions.map((prop: valuePorpositionProps) => (
                    <div class="text-center sm:text-left sm:w-1/3">
                        <h2 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{prop.title}</h2>
                        <p class="text-sm font-semibold text-primary-600 dark:text-primary-500 mt-1">{prop.tagline}</p>
                        <p class="mt-2 text-neutral-600 dark:text-neutral-400 text-sm">{prop.description}</p>
                    </div>
                ))}
            </div>

            <div class="mt-12 text-center">
                <h2 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{t.clients.headline}</h2>
                <div class="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 items-center">
                    <div class="p-4 grayscale transition duration-200 hover:grayscale-0">
                        <img src="/images/tech/typescript.svg" class="h-12 w-auto mx-auto" loading="lazy" alt={t.clients.logoAlt} />
                    </div>
                    </div>
            </div>
        </div>
    </Container>
</div>
```

-----

### 5\. 📖 Doctrina de Estilo (El Fix Global)

Este nuevo sistema soluciona su problema de "perder el control" y le da el "fix global" que buscaba:

  * **Doctrina de Propósito:**

      * `primary` (Naranja): Solo para **Acción y Energía**. Botones, CTAs, enlaces clave.
      * `secondary` (Indigo): Para **Acentos Técnicos**. Gráficos, *highlights* de código, insignias.
      * `neutral` (Pizarra): Para **Todo lo demás**. Es el 90% de su UI (fondos, texto, bordes, cards).
      * `accent` (Teal): Para **Alertas y Estado**. Mensajes de éxito, etiquetas de "Nuevo".

  * **Doctrina de Contraste (El "Fix Global"):**
    Usted mismo lo dijo: "si consideras que el contraste es malo, puedas cambiar una variable por otra en el root".
    ¡Ahora es incluso más fácil\! Si `text-neutral-100` sobre `bg-neutral-800` no tiene buen contraste en el modo oscuro...

      * **No** tiene que tocar el `tailwind.config.mjs`.
      * **Simplemente** cambia la *clase* en su HTML de `text-neutral-100` a `text-neutral-50` (más brillante) o `text-white`.
      * Ha conseguido el **"fix global"** porque ahora el sistema es predecible, legible y escalable.

Espero que esta nueva composición sea más fácil de leer, mantener y, sobre todo, escalar. ¡Ha sido un placer afinar sus instrumentos\! ¡Yohohoho\!
