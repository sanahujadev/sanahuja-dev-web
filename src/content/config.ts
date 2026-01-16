import { defineCollection, z } from "astro:content";

// Colección para el "Plan de Autoridad Mensual"
const blogCollection = defineCollection({
  type: "content", // Usaremos .md o .mdx
  schema: ({ image }) => z.object({
    title: z.string(), // El H1 que Batman revisará
    description: z.string(), // La meta-descripción
    lang: z.enum(["es", "en"]), // El idioma es | en
    pubDate: z.date().optional(), // deprecado en favor de publishedAt pero mantenido por compatibilidad si se usa
    publishedAt: z.string().transform(str => new Date(str)).optional(), // Nuevo campo
    canonicalURL: z.string().url().optional(),

    // Nuevos campos para el Post Avanzado
    author: z.object({
      name: z.string(),
      role: z.string(),
      avatar: z.string(), // Path a la imagen
    }),
    image: z.object({
      url: z.string(), // Path a la imagen (usaremos string para OptimizedImage por ahora)
      alt: z.string(),
    }),
    category: z.string(),
    tags: z.array(z.string()),
    seo: z.object({
      metaTitle: z.string(),
      metaDescription: z.string(),
    }).optional(),
    alternateUrl: z.string(),
  }).partial(),
});

// Colección para el SEO Programático
const localitiesCollection = defineCollection({
  type: "data", // Usaremos .json (src/content/localities/tenerife.json)
  schema: z.object({
    localities: z.array(
      z.object({
        slug: z.string(), // ej: "la-orotava"
        name: z.string(), // ej: "La Orotava"
        // ...otros datos que Burro quiera poner
      }),
    ),
  }),
});

export const collections = {
  blog: blogCollection,
  localities: localitiesCollection,
};
