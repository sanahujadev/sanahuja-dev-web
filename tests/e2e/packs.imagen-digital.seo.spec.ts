import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/pack/imagen-digital.json' assert { type: 'json' };
// import t_en from '../../src/i18n/en/packs/image-digital-pack.json' assert { type: 'json' };

test.describe('E2E/SEO: /es/packs/imagen-digital (Pack Imagen Digital)', () => {
  const URL = '/es/packs/imagen-digital';

  test('Debe cumplir con los requisitos SEO básicos', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 1. SEO Básico
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // 2. H1 principal
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(/Imagen Digital|Reputación Online|Google My Business/i);

    // 3. Hero Section
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();

    // 4. Hero Badge
    const heroBadge = heroSection.getByText('Reputación Local');
    await expect(heroBadge).toBeVisible();

    // 4. Hero CTA primario: "Proteger mi Reputación" (acción emocional)
    const heroCTA = page.locator('#hero a').getByText('Proteger mi Reputación');
    await expect(heroCTA).toHaveAttribute('href', '/es/contacto/');

    // 5. Hero CTA secundario: "Ver mi perfil actual"
    const demoCTA = page.locator('#hero a').getByText('Comparar Packs');
    await expect(demoCTA).toHaveAttribute('href', '/es/packs/');

    // 6. Dolor de reseñas negativas visible
    const painReviews = page.locator('#desafios');
    await expect(painReviews).toBeVisible();
    await expect(painReviews).toContainText('malas reseñas');
    await expect(painReviews).toContainText('salgo en Google Maps');

    // 9. Interlinking a gestion-reputacion-online (servicio suelto)
    const linkToReputacion = page.locator('#desafios').locator('a[href*="/es/servicios/gestion-reputacion-online"]');
    await expect(linkToReputacion).toBeVisible();
    await expect(linkToReputacion).toContainText('Gestión de Reputación');

    // 9. Interlinking a gestion-reputacion-online (servicio suelto)
    const metodologiPreview = page.locator('#metodologia');
    await expect(metodologiPreview).toBeVisible();
    await expect(metodologiPreview).toContainText('Google My Business');

    // 10. Schema Product con price 110€ y billingIncrement
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Product"');
    expect(scriptContent).toMatch(/"price":\s*"130(\.00)?"/);
    expect(scriptContent).toContain('"billingIncrement":"monthly"');
    expect(scriptContent).toContain('"description":"Servicio mensual de gestión de reputación online y mantenimiento web');

    // 11. Hreflang EN
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);

    // 12. CTA final: "Proteger mi negocio local" (acción emocional)
    const ctaFinal = page.locator('#cta-final').getByText('Quiero el Pack Imagen Digital');
    await expect(ctaFinal).toBeVisible({ timeout: 10000 });
  });
});