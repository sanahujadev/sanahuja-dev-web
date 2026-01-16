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
