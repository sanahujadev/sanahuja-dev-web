// tests/e2e/es/servicios/gestion-reputacion-online.seo.spec.ts
import { test, expect } from '@playwright/test';
import t from '../../src/i18n/es/services/gestion-reputacion-online.json' assert { type: 'json' };
import t_en from '../../src/i18n/en/services/gestion-reputacion-online.json' assert { type: 'json' };

test.describe('E2E/SEO: Gestión Reputación Online (/es/) — ROJO', () => {
  const URL = t.endpoint;

  test('El endpoint debe cumplir el contrato establecido por BURRO ES', async ({ page }) => {
    const response = await page.goto(URL);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(t.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t.metadata.description);
    const main = page.locator('main');
    const h1 = main.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(` ${t.copy.h1_part1}  ${t.copy.h1_part2} `);
    const stats = page.locator('#hero-stats .stat-item');
    await expect(stats).toHaveCount(4);
    const cta = page.locator('#hero').getByRole('link', { name: t.copy.ctas.primary.text });
    await expect(cta).toHaveAttribute('href', t.copy.ctas.primary.url);
    const hreflang = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflang).toHaveAttribute('href', `https://sanahuja.dev${t.alternateUrl}`);
    // Por ESTA (garantizada para funcionar):
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Service"');
  });
  test('El endpoint INGLÉS debe cumplir el contrato de Burro EN', async ({ page }) => {
    // 1. NAVEGACIÓN
    await page.goto(t_en.endpoint);

    // 2. VERIFICACIÓN SEO
    await expect(page).toHaveTitle(t_en.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_en.metadata.description);

    // 3. VERIFICACIÓN H1
    const main = page.locator('main');
    const h1 = main.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(` ${t_en.copy.h1_part1}  ${t_en.copy.h1_part2} `);

    // 4. VERIFICACIÓN Stats
    const stats = page.locator('#hero-stats .stat-item');
    await expect(stats).toHaveCount(4);

    // 5. VERIFICACIÓN CTAs
    const cta = page.locator('#hero').getByRole('link', { name: t_en.copy.ctas.primary.text });
    await expect(cta).toHaveAttribute('href', t_en.copy.ctas.primary.url);

    // 6. VERIFICACIÓN HREFLANG (¡El Inglés apunta al Español!)
    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    const esUrl = 'https://sanahuja.dev' + t_en.alternateUrl;
    await expect(hreflangEs).toHaveAttribute('href', esUrl);

    // 7. Schema.org
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Service"');
  });
});