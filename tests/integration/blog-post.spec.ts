import { test, expect } from '@playwright/test';

test.describe('🧪 Blog Post: "Soluciones Digitales vs Páginas Web" (Rojo)', () => {

    const postUrl = '/es/blog/soluciones-digitales-vs-paginas-web';
    const expectedTitle = 'Soluciones Digitales vs. Páginas Web: Por qué 5 páginas no bastan';
    const expectedMetaDesc = '¿Tu web es un fantasma digital? Descubre la diferencia matemática entre una \'Web Tarjeta\' y un Ecosistema Digital que Google ama.';

    test.beforeEach(async ({ page }) => {
        await page.goto(postUrl);
    });

    // ==================== SEO CRÍTICO ====================
    test('SEO: Debe tener <title> correcto y único', async ({ page }) => {
        await expect(page).toHaveTitle(expectedTitle);
    });

    test('SEO: Debe tener meta description', async ({ page }) => {
        const metaDesc = page.locator('meta[name="description"]');
        await expect(metaDesc).toHaveAttribute('content', expectedMetaDesc);
    });

    test('SEO: Debe renderizar Article Schema JSON-LD', async ({ page }) => {
        const script = page.locator('script[type="application/ld+json"]');
        await expect(script).toHaveCount(1); // Mínimo Article

        const articleSchema = await script.first().textContent();
        const json = JSON.parse(articleSchema || '{}');

        expect(json['@type']).toBe('Article');
        expect(json.headline).toBe(expectedTitle);
        expect(json.author.name).toBe('José Sanahuja');
        // Verificamos que contenga la URL de imagen (la estructura puede variar, pero debe estar)
        // El usuario ha configurado el schema para usar la imagen del autor actualmente
        // Ojo: Esto podría ser un bug en el código, pero si el usuario dice "he cambiado la imagen en el schema", ajustamos el test.
        expect(JSON.stringify(json.image)).toContain('perfil-sin-fondo');
    });

    test('SEO: Debe tener canonical URL correcta', async ({ page }) => {
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute('href', /soluciones-digitales-vs-paginas-web/);
    });

    // ==================== CONTENIDO MDX ====================
    test('Contenido: Debe renderizar H1 con el título del post', async ({ page }) => {
        const h1 = page.locator('main h1');
        await expect(h1).toHaveText(expectedTitle);
    });

    test('Contenido: Debe renderizar <Split> con slots', async ({ page }) => {
        const split = page.locator('[data-testid="post-split"]');
        await expect(split).toBeVisible();
        await expect(split.getByText(/El Problema: La .Web Tarjeta./)).toBeVisible();
        await expect(split.getByText(/Tu web actual: un grito en el vacío/)).toBeVisible();
    });

    test('Contenido: Debe renderizar <Callout> tipo info', async ({ page }) => {
        const callout = page.locator('[data-testid="callout-bibliotecario"]');
        await expect(callout).toBeVisible();
        await expect(callout.getByText(/Google no posiciona .webs., posiciona RESPUESTAS/)).toBeVisible();
    });

    test('Contenido: Debe renderizar <BentoGrid> con 4 items', async ({ page }) => {
        const grid = page.locator('[data-testid="bento-solucion"]');
        await expect(grid).toBeVisible();
        // Ajustado al setup real de BentoItem selector
        await expect(grid.locator('[data-testid^="bento-item"]')).toHaveCount(4);
        await expect(grid.getByText('Profundidad Temática')).toBeVisible();
    });

    test('Contenido: Debe renderizar <Accordion> abierto/cerrado', async ({ page }) => {
        const accordion = page.locator('[data-testid="accordion-objeciones"] details'); // Selector ajustado Details
        await expect(accordion).toHaveCount(3);

        // El primero debe estar ABIERTO inicialmente (cambio de usuario)
        const first = accordion.first();
        const isOpenFirst = await first.evaluate((node) => node.hasAttribute('open'));
        expect(isOpenFirst).toBe(true);

        // El tercero debe estar CERRADO (cambio de usuario)
        const last = accordion.last();
        const isOpenLast = await last.evaluate((node) => node.hasAttribute('open'));
        expect(isOpenLast).toBe(false);
    });

    // ==================== AUTHOR & METADATA ====================
    test('Metadata: Debe mostrar autor, avatar y fecha', async ({ page }) => {
        const header = page.locator('article header'); // Scoping helps avoid duplicates/ambiguity
        await expect(header.getByText('José Sanahuja')).toBeVisible();
        await expect(header.getByText('Socio Digital')).toBeVisible();
        // Avatar debe estar presente (picture > img) de OptimizedImage
        // Buscamos por alt que contiene el nombre del autor
        await expect(header.locator('picture img[alt*="José Sanahuja"]')).toBeVisible();
        await expect(header.locator('time')).toHaveText(/14 de enero de 2026/);
    });

    test('Metadata: Debe mostrar tags como links', async ({ page }) => {
        const tags = page.locator('[data-testid="post-tags"] a');
        await expect(tags).toHaveCount(4);
        await expect(tags.first()).toHaveAttribute('href', /\/es\/blog\/tag\/seo-local/);
    });

    // ==================== IMAGENES (OptimizedImage) ====================
    test('Imágenes: Deben ser responsivas (picture)', async ({ page }) => {
        // Verificamos imagenes específicas del post
        const imgDesierto = page.locator('picture img[alt="Un folleto perdido en el desierto digital"]');
        await expect(imgDesierto).toBeVisible();
        await expect(imgDesierto).toHaveAttribute('loading', 'lazy');

        // La imagen conectada está dentro del 3er acordeón, debemos abrirlo para verla (o verificar que existe en el DOM al menos)
        // Playwright .toBeVisible() requiere que esté visible en viewport y no display:none.
        // Como está en un <details> cerrado, fallará.

        // 1. Abrimos el acordeón container
        const lastAccordion = page.locator('[data-testid="accordion-objeciones"] details').last();
        await lastAccordion.locator('summary').click(); // Hacemos click para abrir

        const imgConectada = page.locator('picture img[alt="Visualización de tráfico web en Tenerife"]');
        await expect(imgConectada).toBeVisible();
    });
});
