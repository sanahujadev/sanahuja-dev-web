import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/services/bolsa-de-horas.json' assert { type: 'json' };

test.describe('E2E/SEO: /es/servicios/bolsa-de-horas (Bombero - Cashflow)', () => {
  const URL = '/es/servicios/bolsa-de-horas';

  test('Debe cumplir contrato SEO ES: title, meta, H1 transaccional, CTAs, Product Schema', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 1. SEO Básico
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // 2. H1 con keywords de compra
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(/Soporte Web por Horas|Tu Técnico Bajo Demanda/i);

    // 3. Badge "Sin Permanencia" visible en Hero
    const heroBadge = page.locator('#hero').getByText('Sin Permanencia');
    await expect(heroBadge).toBeVisible();

    // 4. Hero CTA primario apunta a #pricing
    const heroCTA = page.locator('#hero a').getByText('Ver Packs de Horas');
    await expect(heroCTA).toHaveAttribute('href', '#pricing');

    // 5. Hero CTA secundario (WhatsApp)
    const whatsappCTA = page.locator('#hero a').getByText('Consultar por WhatsApp');
    await expect(whatsappCTA).toHaveAttribute('href', /https:\/\/wa\.me\//);

    // 6. Hero stats con valores clave
    await expect(page.locator('#hero')).toContainText('0');
    await expect(page.locator('#hero')).toContainText('<24h');

    // 7. Sección "¿Qué solucionamos?" con use cases
    // FIX: Tu componente usa #pain-points, no #symptoms
    const painPoints = page.locator('#pain-points');
    await expect(painPoints).toBeVisible();
    await expect(painPoints).toContainText('Error Crítico');
    await expect(painPoints).toContainText('Arreglar error 500 o pantalla blanca en WordPress.');

    // 8. Grid de ventajas (benefits)
    const benefits = page.locator('#benefits');
    await expect(benefits).toBeVisible();
    await expect(benefits).toContainText('Sin Ataduras');
    await expect(benefits).toContainText('Control Total');

    // 9. Sección de pricing con packs
    const pricing = page.locator('#pricing');
    await expect(pricing).toBeVisible();
    await expect(pricing).toContainText('Pack Inicio');
    await expect(pricing).toContainText('5 Horas');

    // 10. Pack Pro destacado con data attribute
    // FIX: Añadido data-pack-card="pro" para ser quirúrgico
    const packPro = pricing.locator('[data-pack-card="pro"]');
    await expect(packPro).toBeVisible();
    await expect(packPro).toContainText('Pack Pro');

    // 11. Schema JSON-LD Product para cada pack
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Product"');
    expect(scriptContent).toContain('Pack Inicio');
    expect(scriptContent).toContain('Pack Pro');

    // 12. Hreflang EN
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);

    // 13. CTA final
    const ctaFinal = page.locator('#cta-final').getByRole('link', { name: 'Solicitar Soporte Urgente' });
    await expect(ctaFinal).toBeVisible();
  });
});
/*
test.describe('E2E/SEO: /en/services/hours-bank', () => {
  const URL = '/en/services/hours-bank';

  test('Debe cumplir contrato SEO EN: title, meta, H1, CTAs', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(t_en.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_en.metadata.description);

    const h1 = page.locator('main h1');
    await expect(h1).toContainText(/Web Support|Technician on Demand/i);

    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Product"');
  });
}); */