import { defineCollection, z } from "astro:content";

// Colección para el "Plan de Autoridad Mensual"
const blogCollection = defineCollection({
  type: "content", // Usaremos .md o .mdx
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
