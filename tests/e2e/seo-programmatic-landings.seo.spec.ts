// tests/e2e/seo-programmatic-landings.seo.spec.ts

import { test, expect } from '@playwright/test';
// Usamos una URL de prueba para verificar la inyección de datos
const TEST_URL_ES = '/es/diseno-web-en/adeje';
const LOCALIDAD_NAME = 'Adeje';
const LOCALIDAD_SLUG = 'adeje'; 
const MUNICIPALITY_NAME = 'Adeje';
const ZIP_CODE = '38670';
const DESIGN_SLUG_EN = 'web-design-in';
const EXPECTED_ALTERNATE_URL = `/en/${DESIGN_SLUG_EN}/${LOCALIDAD_SLUG}`;

test.describe('P5: SEO Programático (Ejército de Clones)', () => {

    // Requisito 1: Etiqueta Title y Meta Description Dinámicas
    // Fallará si la palabra clave (Adeje) no está en el <title> o si el H1 no se inyectó.
    test('Debe tener un <title> y <meta description> inyectados y localizados', async ({ page }) => {
        await page.goto(TEST_URL_ES);

        const title = await page.title();
        const description = await page.locator('meta[name="description"]').getAttribute('content');

        // Verificar el Título (debe contener el nombre de la localidad y el municipio)
        expect(title).toContain(LOCALIDAD_NAME);
        expect(title).toContain(MUNICIPALITY_NAME);

        // Verificar la Descripción (debe contener el ZIP y el USP del SEO Data)
        expect(description).toContain(ZIP_CODE);
        expect(description).toContain('Diseñamos para la alta competencia.'); // Fragmento de usp_focus
    });

    // Requisito 2: Etiqueta H1 y H2 Estructurada con Keyword (Requerimiento del Arquitecto)
    // Fallará si el H1 o el H2 no usan la estructura dinámica del JSON.
    test('Debe usar el H1 dinámico y un H2 temático (Keyword Dinámica)', async ({ page }) => {
        await page.goto(TEST_URL_ES);

        const h1Text = await page.locator('main h1').innerText();
        const h2Text = await page.locator('main h2').first().innerText();
        
        // Verificar H1: Debe ser la combinación de h1_part1 + h1_part2
        expect(h1Text).toContain(`Diseño Web en ${LOCALIDAD_NAME}`);
        expect(h1Text).toContain('Superar la Saturación Competitiva'); // Fragmento de h1_modifier
        
        // Verificar H2: Debe ser el título de la Solución (h2_solution)
        expect(h2Text).toContain('¿Por qué tu negocio en '); 
        expect(h2Text).toContain(' no despega?'); 
    });

    // Requisito 3: Schema Markup Dinámico (LocalBusiness/areaServed)
    // Fallará si el JSON-LD no incluye el nombre de la localidad en areaServed.
    test('Debe inyectar el Schema.org ProfessionalService con el areaServed dinámico', async ({ page }) => {
        await page.goto(TEST_URL_ES);
        
        // Extraer el JSON-LD
        const jsonLdContent = await page.locator('script[type="application/ld+json"]').innerText();
        const jsonLd = JSON.parse(jsonLdContent);
        
        // Verificar que el areaServed es la localidad correcta
        expect(jsonLd['@type']).toBe('ProfessionalService');
        expect(jsonLd.areaServed['@type']).toBe('City');
        expect(jsonLd.areaServed.name).toBe(LOCALIDAD_NAME); // Adeje
        expect(jsonLd.areaServed.postalCode).toBe(ZIP_CODE); // 38670
    });
    
    // Requisito 4: Hreflang (SEO Técnico Bilingüe)
    // Fallará si no existe la etiqueta que apunta a la versión en inglés.
    test('Debe incluir la etiqueta hreflang apuntando a la versión en Inglés', async ({ page }) => {
        await page.goto(TEST_URL_ES);

        const hreflangLink = page.locator(`link[rel="alternate"][hreflang="en"]`).first();
        const href = await hreflangLink.getAttribute('href');

        // Verificar que el href es el slug esperado (designtext en inglés + localidad)
        expect(href).toContain(EXPECTED_ALTERNATE_URL);
        expect(href).toBeDefined();
    });

    // Requisito 5: Canonical y Robots (Técnico/Contenido)
    // Fallará si se usa una etiqueta robots diferente a 'index, follow'.
    test('Debe tener la etiqueta robots "index, follow" (no es contenido duplicado)', async ({ page }) => {
        await page.goto(TEST_URL_ES);
        const robots = await page.locator('meta[name="robots"]').getAttribute('content');
        
        // Estas son páginas de valor que queremos indexar.
        expect(robots).toBe('index, follow');
    });
});