// src/scripts/path-generator.ts

// 1. Importaciones de datos reales, AHORA en un archivo TypeScript puro
import localidades from '../i18n/auto/localidades.json'; 
// No necesitamos plantillaJson ni las funciones buildCiudad/construirPlantillaDeCiudad aquí,
// solo necesitamos los datos de localidad para la generación de rutas.

// Definición de los slugs de diseño
const designSlugs: Record<'es' | 'en', string> = { 
    es: "diseno-web-en", 
    en: "web-design-in" 
};

// 2. Exportar la lógica de getStaticPaths como una función de TypeScript puro
export const getProgrammaticStaticPaths = async () => {
    // Si necesitas los props de Astro (el argumento), lo añades, pero para este caso no es necesario.
    // const { buildCiudad, construirPlantillaDeCiudad } = await import('./utils'); // Carga diferida de lógica

    const langs = Object.keys(designSlugs);
    const paths: any[] = [];

    for (const loc of localidades) {
        for (const lang of langs) {
            paths.push({
                params: {
                    autoLang: lang,
                    designText: designSlugs[lang as 'es' | 'en'],
                    localidad: loc.slug,
                },
                // Mantenemos los props que necesita la página .astro
                props: {
                    localidad: loc,
                    lang,
                },
            });
        }
    }

    return paths;
}