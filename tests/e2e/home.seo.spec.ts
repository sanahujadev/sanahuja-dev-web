// tests/e2e/sobre-mi.seo.spec.ts (versión final con ambos idiomas)
import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/sobre-mi.json' assert { type: 'json' };
import t_en from '../../src/i18n/en/sobre-mi.json' assert { type: 'json' }; // ✅ DESCOMENTA ESTO

test.describe('E2E/SEO: Sobre Mí (ES)', () => {
  const URL = '/es/sobre-mi';

  test('Debe cumplir contrato SEO ES: title, meta, H1, pruebas, CTAs', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(`${t_es.copy.hero.h1_part1} ${t_es.copy.hero.h1_part2}`);

    const proofCard = page.locator('[data-proof-card]');
    await expect(proofCard).toBeVisible();
    await expect(proofCard).toContainText(t_es.copy.sections.proof.proofCard.rating);
    await expect(proofCard).toContainText(t_es.copy.sections.proof.proofCard.platform);

    const diplomasSection = page.locator('[data-diplomas-api]');
    await expect(diplomasSection).toBeVisible();

    const primaryCTA = page.locator('#cta-final').getByRole('link', { name: t_es.copy.ctas.primary.text });
    await expect(primaryCTA).toHaveAttribute('href', t_es.copy.ctas.primary.url);

    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);

    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"ProfilePage"');
  });
});

test.describe('E2E/SEO: About Me (EN)', () => {
  const URL = '/en/about-me'; // ✅ CAMBIA EL ENDPOINT

  test('Debe cumplir contrato SEO EN: title, meta, H1, proof, diplomas, CTAs', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 1. SEO Básico (EN)
    await expect(page).toHaveTitle(t_en.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_en.metadata.description);

    // 2. H1 Autoridad (EN)
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(`${t_en.copy.hero.h1_part1} ${t_en.copy.hero.h1_part2}`);

    // 3. Proof Card (EN)
    const proofCard = page.locator('[data-proof-card]');
    await expect(proofCard).toBeVisible();
    await expect(proofCard).toContainText(t_en.copy.sections.proof.proofCard.rating);
    await expect(proofCard).toContainText(t_en.copy.sections.proof.proofCard.platform);

    // 4. Diplomas Grid (EN)
    const diplomasSection = page.locator('[data-diplomas-api]');
    await expect(diplomasSection).toBeVisible();

    // 5. CTA Final (EN)
    const primaryCTA = page.locator('#cta-final').getByRole('link', { name: t_en.copy.ctas.primary.text });
    await expect(primaryCTA).toHaveAttribute('href', t_en.copy.ctas.primary.url);

    // 6. Hreflang (INVERSO: apunta a ES)
    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    await expect(hreflangEs).toHaveAttribute('href', 'https://sanahuja.dev' + t_en.alternateUrl);

    // 7. Schema (EN)
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"ProfilePage"');
  });
});