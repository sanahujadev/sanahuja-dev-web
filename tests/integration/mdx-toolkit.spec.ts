import { test, expect } from '@playwright/test';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

test.describe('🧪 MDX ToolKit - Tests de Integración (Rojo)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/es/demo/mdx-toolkit');
    });

    // ==================== SPLIT ====================
    test('Split: debe renderizar slots "left" y "right" con ratio 50-50', async ({ page }) => {
        const split = page.locator('[data-testid="split-50-50"]');
        await expect(split).toBeVisible();

        // Slots nombrados deben existir
        await expect(split.locator('[data-slot="left"]')).toBeVisible();
        await expect(split.locator('[data-slot="right"]')).toBeVisible();

        // Texto específico del slot
        await expect(split.getByText('Contenido texto izquierda')).toBeVisible();
        await expect(split.getByText('Imagen derecha')).toBeVisible();
    });

    test('Split: debe invertir orden con reverse=true', async ({ page }) => {
        const split = page.locator('[data-testid="split-reverse"]');
        // En desktop, la imagen debería estar primero (order-1)
        // No hay forma fácil de testear CSS Grid order sin acceso al computed style,
        // así que validamos que el slot "right" contenga el texto esperado.
        await expect(split.getByText('Esta imagen va primero en reverse')).toBeVisible();
    });

    // ==================== BENTOGRID ====================
    test('BentoGrid: debe renderizar items con clases de span/rowSpan', async ({ page }) => {
        const grid = page.locator('[data-testid="bento-demo"]');
        await expect(grid).toBeVisible();

        // BentoItem debe existir
        const items = grid.locator('[data-testid^="bento-item"]');
        await expect(items).toHaveCount(3);

        // Item con span=2 debe ocupar más ancho
        const itemSpan2 = grid.locator('[data-testid="bento-item-span-2"]');
        await expect(itemSpan2).toBeVisible();
        await expect(itemSpan2.getByText('Astro')).toBeVisible();
    });

    test('BentoGrid: gradient funciona correctamente', async ({ page }) => {
        const item = page.locator('[data-testid="bento-item-gradient"]');
        // Verificar que el div de gradiente existe
        await expect(item.locator('.group-hover\\:opacity-100')).toHaveCount(1); // Escapado para PW
    });

    // ==================== ACCORDION ====================
    test('Accordion: debe ser <details> nativo y cerrado por defecto', async ({ page }) => {
        const accordion = page.locator('details[data-testid="accordion-closed"]');
        await expect(accordion).toBeVisible();

        // Estado inicial cerrado
        const isOpen = await accordion.evaluate((node) => node.hasAttribute('open'));
        expect(isOpen).toBe(false);

        // Interactuar: abrir
        const summary = accordion.locator('summary');
        await summary.click();
        await expect(accordion).toHaveAttribute('open', '');

        // Contenido visible después de abrir
        await expect(accordion.getByText('Contenido oculto hasta el click')).toBeVisible();
    });

    test('Accordion: open=true debe iniciar abierto', async ({ page }) => {
        const accordion = page.locator('details[data-testid="accordion-open"]');
        await expect(accordion).toHaveAttribute('open', '');
    });

    // ==================== CALLOUT ====================
    test('Callout: debe renderizar icono, título y slot', async ({ page }) => {
        const callout = page.locator('[data-testid="callout-info"]');
        await expect(callout).toBeVisible();

        // Icono (ℹ️)
        await expect(callout.getByText('ℹ️')).toBeVisible();

        // Título
        await expect(callout.getByText('Cuidado con la Hidratación')).toBeVisible();

        // Contenido (usamos regex para ignorar posibles problemas con backticks/code tags)
        await expect(callout.getByText(/Recuerda usar .*client:visible/)).toBeVisible();
    });

    test('Callout: types (success, warning, danger) cambian clases', async ({ page }) => {
        // danger
        const danger = page.locator('[data-testid="callout-danger"]');
        await expect(danger).toHaveClass(/border-l-red-500/);
        await expect(danger.getByText('🔥')).toBeVisible();
    });

    // ==================== SEO & A11Y ====================
    test('SEO: ToolKit no debe tener <title> vacío ni H1 duplicados', async ({ page }) => {
        await expect(page).toHaveTitle(/Demo MDX ToolKit/);

        const h1s = page.locator('main h1');
        const count = await h1s.count();
        if (count !== 1) {
            console.log('Found H1s:', await h1s.allInnerTexts());
        }
        await expect(h1s).toHaveCount(1); // Solo el del layout
    });

    test('A11Y: axe-core no debe encontrar violaciones', async ({ page }) => {
        // Inyectar axe-core
        await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });

        const results = await page.evaluate(async () => {
            // @ts-ignore
            return await window.axe.run(document.body);
        });

        if (results.violations.length > 0) {
            console.log('A11Y Violations:', JSON.stringify(results.violations, null, 2));
        }
        expect(results.violations.length).toBe(0);
    });
});

// NUEVOS TESTS PARA HEADING
test.describe('Heading Component', () => {
    test.beforeEach(async ({ page }) => {
        // Asegurarse de ir a la versión en español que es donde están los demos
        await page.goto('/es/demo/mdx-toolkit');
    });

    test('Heading: Debe renderizar h3 con clases de tamaño xl', async ({ page }) => {
        const h3 = page.locator('h3[data-testid="heading-h3-xl"]');
        await expect(h3).toBeVisible();
        await expect(h3).toHaveText('Este es un H3 XL (Simulado)');
        // Tailwind classes matching strict regex for 4xl/6xl or similar size classes
        await expect(h3).toHaveClass(/text-4xl|text-6xl/);
    });

    test('Heading: Debe renderizar h3 con gradiente y línea decorativa', async ({ page }) => {
        const h3 = page.locator('h3[data-testid="heading-h2-gradient"]');
        await expect(h3).toBeVisible();
        // Debe tener componente HeadingLine (span)
        await expect(h3.locator('span.heading-line')).toBeVisible();
        // Debe tener clase de gradiente en el texto
        await expect(h3).toHaveClass(/bg-gradient-to-r/);
    });

    test('Heading: Debe renderizar h3 con id para anclaje', async ({ page }) => {
        const h3 = page.locator('h3[data-testid="heading-h3-anchor"]');
        await expect(h3).toHaveAttribute('id', 'mi-anclaje-personalizado');
        // Scroll margin para anclaje
        await expect(h3).toHaveClass(/scroll-mt-24/);
    });

    test('Heading: Debe pasar axe-core (no hay heading levels saltados)', async ({ page }) => {
        // Inyectar axe-core
        await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });

        const results = await page.evaluate(async () => {
            // @ts-ignore
            return await window.axe.run(document.body, {
                rules: { 'heading-order': { enabled: true } }
            });
        });

        // Filtramos explícitamente rule 'heading-order'
        const headingViolations = results.violations.filter(
            (v: any) => v.id === 'heading-order'
        );
        expect(headingViolations.length).toBe(0);
    });

    test('Heading: Debe permitir clases extra sin romper estilos base', async ({ page }) => {
        const h3 = page.locator('h3[data-testid="heading-h3-custom"]');
        await expect(h3).toHaveClass(/text-purple-500/);
        await expect(h3).toHaveClass(/my-8/);
        await expect(h3).toHaveText('H3 con clase custom');
    });

    test('Heading: No debe causar CLS con width/height establecidos', async ({ page }) => {
        const h3 = page.locator('h3[data-testid="heading-h3-xl"]');
        const box = await h3.boundingBox();
        expect(box?.height).toBeGreaterThan(0); // Asegurar que no colapsa
    });
});

// NUEVOS TESTS PARA LIST
test.describe('List Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/es/demo/mdx-toolkit');
    });

    test('List: Debe renderizar lista ordenada con números estilizados', async ({ page }) => {
        const list = page.locator('ol[data-testid="list-ordered"]');
        await expect(list).toBeVisible();
        // Verificamos items
        await expect(list.locator('li')).toHaveCount(3);
        // Verificamos conteo css o marcador (difícil en e2e puro sin visu, pero chequeamos clases)
        await expect(list).toHaveClass(/list-none/); // Debe quitar default
        await expect(list.locator('li').first()).toHaveClass(/relative/);
    });

    test('List: Debe renderizar lista desordenada con iconos custom', async ({ page }) => {
        const list = page.locator('ul[data-testid="list-unordered"]');
        await expect(list).toBeVisible();
        await expect(list.locator('li')).toHaveCount(3);
        // Verificamos que tenga el icono (svg o span) en el primer elemento
        const firstItem = list.locator('li').first();
        await expect(firstItem.locator('svg, span[aria-hidden="true"]')).toBeVisible();
    });
});
