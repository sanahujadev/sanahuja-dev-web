import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/services/informe-visibilidad-web.json' assert { type: 'json' };

test.describe('E2E/SEO: /es/servicios/informe-visibilidad-web (Médico Diagnosta)', () => {
  const URL = '/es/servicios/informe-visibilidad-web';

  test('Debe cumplir contrato SEO ES: title, meta, H1 diagnóstico, herramientas, interlinking', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 1. SEO Básico
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // 2. H1 de autoridad técnica
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(/Informe de Visibilidad|Deja de Adivinar/i);

    // 3. Badge "Diagnóstico Profesional"
    const heroBadge = page.locator('#hero').getByText('Diagnóstico Profesional');
    await expect(heroBadge).toBeVisible();

    // 4. Hero CTA primario (URL absoluta a formulario)
    const heroCTA = page.locator('#hero a').getByText('Solicitar mi Diagnóstico');
    await expect(heroCTA).toHaveAttribute('href', '/es/formulario-inicial/');

    // 5. Hero CTA secundario (#ejemplo)
    const exampleCTA = page.locator('#hero a').getByText('Ver Ejemplo de Informe');
    await expect(exampleCTA).toHaveAttribute('href', '#ejemplo');

    // 6. Hero stats mencionan herramientas clave
    await expect(page.locator('#hero')).toContainText('Core Web Vitals');
    await expect(page.locator('#hero')).toContainText('LCP/CLS');

    // 7. Sección "Síntomas" con cards de problemas
    const symptoms = page.locator('#symptoms');
    await expect(symptoms).toBeVisible();
    await expect(symptoms).toContainText('Síntomas de una Web Enferma');
    await expect(symptoms).toContainText('¿Por qué mi web no vende?');

    // 8. Grid de herramientas técnicas
    const methodology = page.locator('#methodology');
    await expect(methodology).toBeVisible();
    await expect(methodology).toContainText('Google Search Console');
    await expect(methodology).toContainText('Lighthouse / PageSpeed');

    // 9. Interlinking a mantenimiento-web
    const nextStep = page.locator('#next-step');
    await expect(nextStep).toBeVisible();
    const mantenimientoLink = nextStep.locator('a[href*="/servicios/mantenimiento-web"]');
    await expect(mantenimientoLink).toBeVisible();
    await expect(mantenimientoLink).toContainText('Mantenimiento Web');

    // 10. Schema ProfessionalService
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"ProfessionalService"');

    // 11. Hreflang EN
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);

    // 12. CTA final (FIX: Aseguramos texto exacto del JSON)
    // El texto es "Solicitar mi Auditoría" (tal cual en tu JSON)
    const ctaFinal = page.locator('#cta-final').getByRole('link', { name: 'Solicitar mi Auditoría' });
    await expect(ctaFinal).toBeVisible({ timeout: 10000 });
  });
});
/*
test.describe('E2E/SEO: /en/services/web-audit', () => {
  const URL = '/en/services/web-audit';

  test('Debe cumplir contrato SEO EN: title, meta, H1', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(t_en.metadata.title);
    
    const h1 = page.locator('main h1');
    await expect(h1).toContainText(/Web Audit|Stop Guessing/i);

    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"ProfessionalService"');
  });
}); */