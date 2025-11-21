import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/services.json' assert { type: 'json' };
import t_en from '../../src/i18n/en/services.json' assert { type: 'json' };

test.describe('E2E/SEO: /es/servicios (Hub - Distribuidor)', () => {
  const URL = '/es/servicios';

  test('Debe cumplir contrato SEO ES: title, meta, H1 genérico, silo estructurado', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 1. SEO Básico
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // 2. H1 genérico (NO canibaliza hijas)
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(/Soluciones Digitales|para Empresas/i);
    await expect(h1).not.toContainText('Diseño Web');

    // 3. Badge "Enfoque Integral" - FIX: Está en el hero, no en #intro
    // Tu componente tiene el badge dentro de #hero
    const introBadge = page.locator('#hero').getByText('Enfoque Integral');
    await expect(introBadge).toBeVisible();

    // 4. Grid con mínimo 5 servicios
    // FIX: Tu componente no tiene data-service-card. Lo añadimos o buscamos por sección
    // Opción A: Modificar componente para añadir data-service-card
    // Opción B: Buscar dentro de #servicios
    const serviceCards = page.locator('#servicios > div > div > div > a'); // Selector más específico
    await expect(serviceCards).toHaveCount(6);

    // 5. SILO: Enlace a bolsa-de-horas con anchor text exacto
    // FIX: Usamos selector de data attribute o buscamos el texto
    const bolsaLink = page.locator('#servicios').getByRole('link', { name: 'Bolsa de Horas' });
    await expect(bolsaLink).toBeVisible();
    await expect(bolsaLink).toHaveAttribute('href', '/es/servicios/bolsa-de-horas');

    // 6. SILO: Enlace a informe-visibilidad-web
    const informeLink = page.locator('#servicios').getByRole('link', { name: 'Informe de Visibilidad' });
    await expect(informeLink).toBeVisible();
    await expect(informeLink).toHaveAttribute('href', '/es/servicios/informe-visibilidad-web');

    // 7. SILO: Enlace a diseño-web con anchor text estratégico
    const disenoLink = page.locator('#servicios').getByRole('link', { name: 'Diseño Web Estratégico' });
    await expect(disenoLink).toHaveAttribute('href', '/es/servicios/diseno-web-tenerife');

    // 8. Schema Service
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Service"');

    // 9. Hreflang EN
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);

    // 10. CTA final del hub
    const ctaFinal = page.locator('#cta-final').getByRole('link', { name: 'Solicitar Asesoramiento' });
    await expect(ctaFinal).toBeVisible();
  });
});

test.describe('E2E/SEO: /en/services (Hub)', () => {
  const URL = '/en/services';

  test('Debe cumplir contrato SEO EN: title, H1, service grid', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(t_en.metadata.title);
    
    const h1 = page.locator('main h1');
    await expect(h1).toContainText(/Digital Solutions/i);
  });
});