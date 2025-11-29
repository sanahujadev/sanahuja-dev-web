# Diseño y Estrategia de Pages y Components para el Blog

Al igual que las categorías, los Tags son otra "puerta de entrada" al mismo contenido. La lógica estructural es idéntica a la de las categorías.
📂 Tu estructura final de archivos (La "Trinidad" de la navegación)
Tu carpeta pages debería verse así para cubrir todos los ángulos de ataque:
src/pages/
  [lang]/
    blog/
      ├── index.astro                <-- (A) Todo el mundo (Paginado)
      ├── [slug].astro               <-- (C) El Artículo (Destino)
      ├── categoria/
      │     └── [category].astro     <-- (B) Filtro por Temática (Silos SEO)
      └── tag/
            └── [tag].astro          <-- (D) Filtro por Etiqueta (Granular)

## 🧠 ¿Cuál es el reto técnico al programarlo?

El único reto es cómo generas las rutas en getStaticPaths:
 * Categorías: Normalmente un post tiene una categoría principal (relación 1:1 o 1:N simple). Es fácil de agrupar.

 * Tags: Un post tiene muchos tags (relación N:M).
   * El reto: Tienes que "aplanar" (flat) todos los tags de todos los posts para saber cuántas páginas únicas de tags tienes que crear.
Ejemplo de lógica para src/pages/[lang]/blog/tag/[tag].astro:
```ts
export async function getStaticPaths() {
  const allPosts = await getCollection('blog');
  
  // 1. Recolectar todos los tags únicos que existen
  const uniqueTags = [...new Set(allPosts.map(post => post.data.tags).flat())];

  // 2. Generar una ruta por cada tag
  return uniqueTags.map(tag => {
    // 3. Filtrar posts que contienen ese tag
    const filteredPosts = allPosts.filter(post => post.data.tags.includes(tag));
    
    return {
      params: { lang: 'es', tag: tag }, // Ojo, aquí deberías manejar el idioma también
      props: { posts: filteredPosts },
    };
  });
}
```

### Contexto de metadatos

 El objeto Collection de Posts va a contar con una estructura similar a la siguiente de atributos y metadatas.

```json
[
  {
    "id": "1",
    "lang": "es",
    "slug": "wpo-99-no-es-magia-es-ingenieria",
    "title": "WPO 99 no es magia. Es ingeniería (y estos son los 5 culpables de tu 40)",
    "excerpt": "Tu web tarda 8 segundos en cargar y Google te castiga. Descubre las 5 causas técnicas reales que destrozan tu WPO y cómo paso del 40 al 99 sin trucos ni plugins milagro.",
    "category": "wpo",
    "categoryLabel": "WPO (Velocidad)",
    "author": {
      "name": "José Javier Sanahuja",
      "role": "Consultor & Socio Digital",
      "avatar": "https://cdn.sanahuja.dev/sanahujadev/perfil-sin-fondo/avif/perfil-sin-fondo-360w.avif"
    },
    "publishedAt": "2025-01-15",
    "readTime": "8 min",
    "featured": true,
    "image": {
      "url": "/web-performance-dashboard.png",
      "alt": "Dashboard mostrando métricas de rendimiento web WPO 99"
    },
    "tags": ["Core Web Vitals", "LCP", "CLS", "Next.js", "Optimización"],
    "seo": {
      "metaTitle": "WPO 99: Cómo optimizar tu web del 40 al 99 | SanahujaDev",
      "metaDescription": "Descubre las 5 causas técnicas que destrozan tu WPO y cómo alcanzar un score de 99 sin trucos. Ingeniería web aplicada."
    }
  }, ...
]
```
Con un map sobre la coleccion y objetos SET que coleccione categories y tags, se resuelve la lógica compleja de las relaciones. Si es que hiciera falta. Honestamente creo que recorriendo todo el array 1 sola vez debe ser suficiente para generar cada componente. No debería ser complicado.

## ⚠️ Advertencia de "La Máscara" (SEO Warning)

Tener páginas de Tags es genial para la usabilidad, PERO puede ser peligroso para el SEO si te pasas de frenada.
 * El peligro: El "Thin Content" (Contenido delgado).
 * El escenario: Si creas un tag "magia" y solo tienes 1 post con ese tag, estás creando una página entera (/blog/tag/magia) que solo tiene 1 título y 1 resumen. A Google eso no le gusta mucho si tienes 500 tags así.
 * La Regla de Oro: Usa Tags para agrupaciones reales (ej: "javascript", "react", "tutorial"), no para descripciones (ej: "mi-opinion", "post-del-martes").
Resumen:
Sí, añade tag/[tag].astro. Es el complemento perfecto para que el usuario navegue horizontalmente por temas específicos.
¿Empezamos a codificar el [slug].astro (el post) que es la pieza central, y luego montamos los listados (Index, Categoría, Tag) alrededor? 🚀

## Sobre Componentes

Para lograr una web que respire "Ingeniería y Diseño" (como SanahujaDev), necesitas trabajar en dos capas. No es "o una cosa o la otra", son ambas bailando juntas.
Aquí te explico la diferencia táctica y cómo vamos a romper esa verticalidad.

1. El Layout (BlogPost.astro): El Escenario 🏟️
El Layout es la estructura rígida, el "marco" que rodea al contenido. Aquí diseñas lo que se repite en todos los posts.
¿Qué rompe la verticalidad aquí?
 * Hero Section: Un H1 gigante con una imagen de fondo o un degradado chulo antes de empezar a leer.
 * Sidebar Sticky: Una barra lateral (en desktop) que te sigue mientras bajas, mostrando la Tabla de Contenidos (TOC) o botones de compartir.
 * Ancho de lectura: Limitar el ancho del texto (prose-lg en Tailwind) para que la línea no sea kilométrica, mientras dejas que las imágenes o bloques de código se "desborden" y ocupen más ancho.

2. MDX: Los Actores y Efectos Especiales 🎬
Aquí es donde MDX destroza al Markdown tradicional. MDX te permite inyectar Componentes Interactivos en medio del flujo del texto.
En lugar de escribir solo párrafos, tú "llamas" a componentes que has diseñado.
Ejemplo de verticalidad aburrida (.md):
> Nota: Ten cuidado con borrar la base de datos.
> 
Ejemplo de MDX "Rich Content" (.mdx):
<Alert type="danger" title="¡Zona de Peligro!">
  Si ejecutas este comando, **no hay vuelta atrás**. Asegúrate de tener un backup.
</Alert>

🎨 La Estrategia: Tu "Kit de Legos" (Design System)
Para no tener que diseñar cada post desde cero (lo cual mataría tu productividad), vamos a crear un Set de Componentes Globales para tu blog.
No necesitas diseñar templates para cada post. Diseñas el Layout Base una vez, y luego usas tus Piezas de Lego (MDX) para darle ritmo a la lectura.
Tus Componentes Imprescindibles (Sugiero empezar con estos 4):
 * <Callout /> o <Alert />:
   * Para destacar avisos, consejos (verde) o peligros (rojo). Rompe el ritmo visual del texto plano.
 * <ProsCons />:
   * Una tabla o grid de dos columnas. Izquierda: Lo bueno (check verde). Derecha: Lo malo (cruz roja). Visualmente impactante para comparativas.
 * <YouTube id="..." />:
   * Un componente que cargue el vídeo de forma diferida (Lite YouTube Embed) para no matar el WPO.
 * <CodeWindow />:
   * En lugar del bloque de código negro estándar, un marco que parezca una ventana de VS Code, con el nombre del archivo arriba (src/utils/magia.ts) y botones de "Copiar".
🛠️ Cómo se ve esto en código
Tu archivo Layout (src/layouts/BlogPost.astro):
Aquí manejas el "Macro-Diseño"

```tsx
---
// Layout Base
const { title, headings } = Astro.props;
---
<div class="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
  <article class="prose prose-slate max-w-none dark:prose-invert">
    <h1>{title}</h1>
    
    <slot /> 
    
    </article>

  <aside class="hidden lg:block sticky top-20 h-fit">
     <TableOfContents headings={headings} />
  </aside>
</div>
```

Tu archivo de Contenido (post.mdx):
Aquí usas tus Legos

```mdx
---
title: "WPO Extremo"
---
import Alert from '../../components/mdx/Alert.astro';
import YouTube from '../../components/mdx/YouTube.astro';

Hola, hoy vamos a optimizar.

<Alert type="info">
  Este tutorial asume que ya sabes Astro básico.
</Alert>

Mira este vídeo donde explico el concepto:

<YouTube id="dQw4w9WgXcQ" />
```

## Conclusión

🧠 Veredicto
Sí, necesitas diseñar ambos.
 * Layout: Diseña una estructura que tenga aire, márgenes y una sidebar (aunque sea vacía o con TOC) para que no parezca un documento de Word infinito.
 * Componentes MDX: Diseña 3 o 4 componentes clave (Alert, Card, Video) para salpicar tus artículos.
¿Quieres que diseñemos primero el componente <Alert /> o el <CodeWindow /> para ver cómo se integran? Son los que más "look de ingeniero" dan.

# Diseño de Componentes aplicado.

Has tocado la columna vertebral del problema. El Markdown es una lista vertical aburrida, y tú quieres una arquitectura dinámica.
A tu pregunta: ¿Cuántos componentes soy capaz de crear?
Respuesta: ¡TODOS! Pero como buen "arquitecto de huesos", sé que no necesitas 50 componentes mediocres, necesitas 5 componentes maestros que se combinen entre sí para crear miles de variantes.

## ToolKit

Vamos a diseñar el "MDX Layout Kit". No son simples decoraciones, son contenedores estructurales que vivirán dentro de tus archivos .mdx.
Aquí tienes la Suite de Layouts (Fase 1):
 * <Split />: El rey de "Texto a la izquierda, Imagen a la derecha" (o código).
 * <BentoGrid />: Para esas galerías estilo Apple/Linear.
 * <Accordion />: Para esconder complejidad y limpiar el post.
 * <Callout />: La evolución del blockquote.

Vamos al código. Copia esto en tu carpeta src/components/mdx/.

### 1. El Rompe-Monotonía: <Split />

Este componente divide el flujo vertical en dos columnas. Ideal para explicar código: a la izquierda explicas, a la derecha muestras el snippet o el resultado.
```tsx
---
// src/components/mdx/Split.astro
interface Props {
  reverse?: boolean; // Para poner la imagen a la izquierda si quieres
  ratio?: '50-50' | '40-60' | '60-40';
}

const { reverse = false, ratio = '50-50' } = Astro.props;

const gridClass = {
  '50-50': 'lg:grid-cols-2',
  '40-60': 'lg:grid-cols-[4fr_6fr]',
  '60-40': 'lg:grid-cols-[6fr_4fr]',
}[ratio];
---

<div class={`grid grid-cols-1 ${gridClass} gap-8 items-center my-12`}>
  {/* Lógica para invertir el orden en Desktop */}
  <div class={`prose-content ${reverse ? 'lg:order-2' : ''}`}>
    <slot name="left" /> {/* Si no usas slots nombrados, el contenido fluye, pero mejor forzar orden */}
    <slot />
  </div>
  
  <div class={`visual-content ${reverse ? 'lg:order-1' : ''}`}>
    <slot name="right" />
  </div>
</div>
```

2. El Escaparate Moderno: <BentoGrid />
Para tus puntos 1, 7 y 9 (Grid, Multimedia, Autor). Un contenedor flexible que acepta "items" que pueden ocupar diferentes tamaños.

```tsx
---
// src/components/mdx/BentoGrid.astro
---
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10 auto-rows-[minmax(180px,auto)]">
  <slot />
</div>

---
// src/components/mdx/BentoItem.astro
interface Props {
  span?: '1' | '2' | '3'; // Cuántas columnas ocupa
  rowSpan?: '1' | '2';    // Cuántas filas ocupa (altura)
  title?: string;
  gradient?: boolean;
}

const { span = '1', rowSpan = '1', title, gradient = false } = Astro.props;

// Mapeo de clases para grid
const spanClass = {
  '1': 'md:col-span-1',
  '2': 'md:col-span-2',
  '3': 'md:col-span-3', // Full width
}[span];

const rowClass = {
  '1': '',
  '2': 'row-span-2',
}[rowSpan];
---

<div class={`
    relative group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 
    ${spanClass} ${rowClass} 
    hover:border-primary-500/30 transition-colors duration-300
`}>
  {/* Fondo opcional con degradado sutil */}
  {gradient && (
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  )}

  <div class="relative p-6 h-full flex flex-col z-10">
    {title && <h4 class="text-lg font-bold text-neutral-100 mb-2">{title}</h4>}
    <div class="text-neutral-400 text-sm flex-1">
      <slot />
    </div>
  </div>
</div>
```

3. La Navaja Suiza Interactiva: <Accordion />
Para tus puntos 6 y 10 (Interactivos, Secciones anidadas). Usamos <details> nativo de HTML para no depender de JavaScript pesado, pero lo estilamos como si fuera magia.

```tsx
---
// src/components/mdx/Accordion.astro
interface Props {
  title: string;
  open?: boolean;
}

const { title, open = false } = Astro.props;
---

<details class="group my-4 border border-neutral-800 rounded-lg bg-neutral-900/50 open:bg-neutral-900 open:border-primary-500/30 transition-all duration-300" open={open}>
  <summary class="flex items-center justify-between p-4 cursor-pointer list-none text-neutral-200 font-semibold hover:text-primary-400 transition-colors">
    <span>{title}</span>
    {/* Icono animado con CSS puro */}
    <span class="transform group-open:rotate-180 transition-transform duration-300 text-neutral-500 group-hover:text-primary-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </span>
  </summary>
  
  <div class="px-4 pb-4 pt-0 text-neutral-400 border-t border-transparent group-open:border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200">
    <slot />
  </div>
</details>
```

4. El Amplificador: <Callout />
Para tus puntos 8 (Blockquotes destacados).

```tsx
---
// src/components/mdx/Callout.astro
interface Props {
  type?: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
}

const { type = 'info', title } = Astro.props;

const styles = {
  info:    'border-l-secondary-500 bg-secondary-500/5 text-secondary-200',
  success: 'border-l-accent-500 bg-accent-500/5 text-accent-200',
  warning: 'border-l-amber-500 bg-amber-500/5 text-amber-200',
  danger:  'border-l-red-500 bg-red-500/5 text-red-200',
}[type];

const icons = {
  info:    'ℹ️', // Podrías usar SVGs reales aquí
  success: '✅',
  warning: '⚠️',
  danger:  '🔥',
}[type];
---

<aside class={`my-6 p-4 border-l-4 rounded-r-lg ${styles} relative overflow-hidden`}>
  <div class="flex gap-3">
    <span class="text-xl select-none">{icons}</span>
    <div class="flex-1">
      {title && <strong class="block mb-1 text-white font-bold">{title}</strong>}
      <div class="prose-p:m-0 text-sm leading-relaxed opacity-90">
        <slot />
      </div>
    </div>
  </div>
</aside>
```

🎬 Cómo usas esto en tu post.mdx
¡Aquí es donde ocurre la magia! Mira qué limpio queda el código de tu post y qué potente el resultado visual.

```tsx
---
title: "Arquitectura de Componentes en Astro"
---
import Split from '../../components/mdx/Split.astro';
import BentoGrid from '../../components/mdx/BentoGrid.astro';
import BentoItem from '../../components/mdx/BentoItem.astro';
import Accordion from '../../components/mdx/Accordion.astro';
import Callout from '../../components/mdx/Callout.astro';

# Introducción

El layout tradicional ha muerto. Larga vida al MDX.

<Split ratio="40-60">
  <div slot="left">
    ### Diseño Modular
    
    En lugar de escribir párrafos infinitos, dividimos la atención. Aquí explico el concepto teórico de la modularidad...
  </div>
  <div slot="right">
    ![Gráfico de Arquitectura](/images/architecture-diagram.png)
  </div>
</Split>
```

## Mis Herramientas Favoritas

```tsx
<BentoGrid>
  <BentoItem title="Astro" span="2" gradient>
    El framework web para **contenido**. Rápido por defecto.
  </BentoItem>
  <BentoItem title="Tailwind">
    Utilidades atómicas para estilado rápido.
  </BentoItem>
  <BentoItem title="React" rowSpan="2">
    Para la interactividad compleja en las islas.
  </BentoItem>
  <BentoItem title="TypeScript">
    Tipado seguro para dormir tranquilo.
  </BentoItem>
</BentoGrid>

<Callout type="warning" title="Cuidado con la Hidratación">
  Recuerda usar `client:visible` solo cuando sea estrictamente necesario.
</Callout>

### Preguntas Frecuentes

<Accordion title="¿Por qué usar MDX en lugar de un CMS tradicional?">
  Porque te permite mezclar componentes de UI reales (botones, gráficos, simulaciones) directamente con tu narrativa.
</Accordion>

<Accordion title="¿Afecta esto al SEO?">
  Para nada. Al final, Astro renderiza HTML estático puro. Google lo ama.
</Accordion>
```

### 🧠 ¿Por qué este set?

Con estos 4 componentes cubres el 90% de los casos de uso de un blog técnico de alto nivel:
 * Comparar: (Split)
 * Listar características: (BentoGrid)
 * Profundizar sin agobiar: (Accordion)
 * Avisar: (Callout)
¿Te gusta la estructura, Director? Si das luz verde, podemos pasar a crear los componentes de "Layout Global" (Header, Sidebar, Footer) para envolver esta belleza. 🦴

## Ampliando los componentes

¡Yohohoho! ¡Música para mis oídos! 💀🎻
¡Luces, cámara y... ACCIÓN! 🎬
Ya tenemos los actores (los componentes MDX), ahora vamos a construir El Gran Escenario donde van a actuar. Sin un buen escenario, hasta la mejor obra se ve pobre.
Aquí tienes el Layout Global para tus Posts (BlogPost.astro) y su fiel compañero, la Sidebar Inteligente (TableOfContents.astro).
Este diseño cumple con tu requisitos de: "Sidebar sticky", "Hero Section impactante" y "Ancho de lectura optimizado".

1. El Copiloto: TableOfContents.astro 🧭
No es una simple lista. Es una guía que acompaña al lector. Se queda pegada (sticky) mientras bajas y te indica dónde estás.

```tsx
---
// src/components/layout/TableOfContents.astro
import type { MarkdownHeading } from 'astro';

interface Props {
  headings: MarkdownHeading[];
}

const { headings } = Astro.props;

// Filtramos para mostrar solo H2 y H3 (H1 es el título, H4 es demasiado detalle)
const filteredHeadings = headings.filter((h) => h.depth === 2 || h.depth === 3);
---

<nav class="toc-container">
  <h2 class="text-sm font-bold text-neutral-200 uppercase tracking-wider mb-4 flex items-center gap-2">
    <span class="text-primary-500">#</span> En este artículo
  </h2>
  
  <ul class="flex flex-col space-y-3 text-sm border-l border-neutral-800">
    {filteredHeadings.map((heading) => (
      <li class={`pl-4 transition-all duration-300 hover:border-l-primary-500 ${heading.depth === 3 ? 'ml-4 text-xs' : ''}`}>
        <a 
          href={`#${heading.slug}`} 
          class="block text-neutral-400 hover:text-primary-400 hover:translate-x-1 transition-all leading-snug"
        >
          {heading.text}
        </a>
      </li>
    ))}
  </ul>

  {/* Widget de Compartir (Opcional pero recomendado) */}
  <div class="mt-8 pt-8 border-t border-neutral-800">
     <p class="text-xs text-neutral-500 mb-3">¿Te ha sido útil?</p>
     <div class="flex gap-2">
        {/* Aquí irían tus botones de compartir, por ahora placeholders visuales */}
        <button class="p-2 bg-neutral-800 rounded-lg hover:bg-[#0077b5] hover:text-white transition-colors text-neutral-400" aria-label="LinkedIn">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </button>
        <button class="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors text-neutral-400" aria-label="Copiar Link">
             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        </button>
     </div>
  </div>
</nav>

<style>
  /* Scroll suave para los anclas */
  html {
    scroll-behavior: smooth;
  }
</style>
```

2. El Escenario Principal: BlogPost.astro 🏟️
Este es el archivo que usas como layout en tus .mdx. Combina el Hero (Cabecera), la lógica del Grid (Responsive) y la inyección de estilos de tipografía (prose).

```tsx
---
// src/layouts/BlogPost.astro
import BaseLayout from './BaseLayout.astro';
import TableOfContents from '../components/layout/TableOfContents.astro';
import type { MarkdownLayoutProps } from 'astro';

// Asumimos que la prop frontmatter viene de Astro MDX
type Props = MarkdownLayoutProps<{
  title: string;
  description: string;
  publishedAt: string;
  author: { name: string; avatar: string; role: string };
  image?: { url: string; alt: string };
  category?: string;
  tags?: string[];
}>;

const { frontmatter, headings } = Astro.props;

// Formateo de fecha rápido
const date = new Date(frontmatter.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
});
---

<BaseLayout 
    title={frontmatter.title} 
    description={frontmatter.description} 
    image={frontmatter.image?.url}
    lang="es" // O dinámico según tu lógica
>
  
  {/* --- HERO SECTION --- */}
  {/* Un encabezado masivo que grita "Autoridad" */}
  <div class="relative w-full bg-neutral-950 border-b border-neutral-800 overflow-hidden">
      
      {/* Fondo con "Noise" y Gradiente Sutil */}
      <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E');"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-neutral-900/0 via-neutral-900/50 to-neutral-950 pointer-events-none"></div>

      <div class="max-w-4xl mx-auto px-6 py-24 relative z-10 text-center">
          
          {/* Categoría y Fecha */}
          <div class="flex items-center justify-center gap-4 text-sm mb-6 animate-fade-in-up">
              {frontmatter.category && (
                <span class="px-3 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-full font-medium uppercase tracking-wide">
                    {frontmatter.category}
                </span>
              )}
              <time class="text-neutral-400 font-mono">{date}</time>
          </div>

          {/* Título H1 */}
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight text-balance animate-fade-in-up" style="animation-delay: 100ms;">
              {frontmatter.title}
          </h1>

          {/* Autor */}
          <div class="flex items-center justify-center gap-3 animate-fade-in-up" style="animation-delay: 200ms;">
              <img src={frontmatter.author.avatar || "/placeholder.svg"} alt={frontmatter.author.name} class="w-10 h-10 rounded-full border border-neutral-700" />
              <div class="text-left">
                  <p class="text-white text-sm font-semibold leading-none">{frontmatter.author.name}</p>
                  <p class="text-neutral-500 text-xs">{frontmatter.author.role}</p>
              </div>
          </div>
      </div>
  </div>

  {/* --- CONTENIDO PRINCIPAL --- */}
  <main class="relative bg-neutral-950 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          
          {/* GRID: Contenido (izq) + Sidebar (der) */}
          <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 xl:gap-20">
              
              {/* COLUMNA IZQUIERDA: Artículo */}
              <article class="prose prose-invert prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-white prose-headings:scroll-mt-24
                prose-p:text-neutral-300 prose-p:leading-relaxed
                prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300 prose-a:transition-colors
                prose-strong:text-white prose-strong:font-bold
                prose-code:text-secondary-300 prose-code:bg-neutral-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-blockquote:border-l-primary-500 prose-blockquote:bg-neutral-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:text-neutral-400 prose-blockquote:not-italic
                prose-img:rounded-xl prose-img:shadow-2xl prose-img:border prose-img:border-neutral-800
                prose-hr:border-neutral-800">
                  
                  {/* AQUÍ SE INYECTA EL CONTENIDO MDX */}
                  <slot />

                  {/* Tags al final del post */}
                  {frontmatter.tags && (
                    <div class="mt-12 pt-8 border-t border-neutral-800">
                        <p class="text-sm text-neutral-500 mb-3">Etiquetas:</p>
                        <div class="flex flex-wrap gap-2">
                            {frontmatter.tags.map(tag => (
                                <a href={`/tags/${tag}`} class="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-400 hover:border-primary-500 hover:text-primary-400 transition-colors">
                                    #{tag}
                                </a>
                            ))}
                        </div>
                    </div>
                  )}

              </article>

              {/* COLUMNA DERECHA: Sidebar Sticky */}
              <aside class="hidden lg:block">
                  <div class="sticky top-24">
                      <TableOfContents headings={headings} />
                      
                      {/* Espacio para CTA o Banner Promocional */}
                      <div class="mt-12 p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl">
                          <h4 class="font-bold text-white mb-2">¿Necesitas optimizar tu web?</h4>
                          <p class="text-sm text-neutral-400 mb-4">No dejes que tu competencia te gane por velocidad.</p>
                          <a href="/contacto" class="block w-full py-2 bg-neutral-100 text-neutral-950 text-center text-sm font-bold rounded hover:bg-white transition-colors">
                              Auditoría Gratuita
                          </a>
                      </div>
                  </div>
              </aside>

          </div>
      </div>
  </main>

</BaseLayout>
```

### 🎨 3. La Salsa Secreta: El CSS de Typography
Para que el texto (prose) se vea Premium y no como un documento por defecto, asegúrate de tener instalado el plugin oficial de Tailwind si no lo tienes:

`npm install -D @tailwindcss/typography`
Y en tu tailwind.config.mjs, actívalo:

```ts
// tailwind.config.mjs
export default {
  // ...
  plugins: [
    require('@tailwindcss/typography'),
    // ... otros plugins
  ],
}
```

### Nota de Diseño:

He configurado las clases prose-code directamente en el Layout para quitar esas molestas comillas invertidas (`) que Tailwind pone por defecto en el código inline y darle un color Secondary (Índigo) para que destaque sobre el texto normal.
🧠 ¿Cómo usarlo ahora?
Simplemente crea un archivo .mdx y asegúrate de especificar este layout en el frontmatter:

```tsx
---
layout: '../../layouts/BlogPost.astro'
title: "Cómo Optimizar Imágenes en 2024"
description: "Guía definitiva de formatos AVIF, WebP y carga diferida."
publishedAt: "2024-03-20"
author: 
  name: "José Sanahuja"
  role: "Lead Developer"
  avatar: "/tu-foto.jpg"
category: "WPO"
tags: ["images", "performance", "astro"]
---

import Alert from '../../components/mdx/Alert.astro';

¡Hola mundo! Aquí empieza tu post...

## Primeros Pasos...
```

¡Ya tienes el esqueleto, los músculos y la piel! Tu blog ahora es una máquina de comunicar con estilo. 🏴‍☠️
