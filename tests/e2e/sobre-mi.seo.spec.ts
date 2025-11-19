// tests/e2e/sobre-mi.seo.spec.ts
import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/sobre-mi.json' assert { type: 'json' };
// import t_en from '../../src/i18n/en/about-me.json' assert { type: 'json' };

test.describe('E2E/SEO: Sobre Mí (ES)', () => {
  const URL = '/es/sobre-mi';

  test('Debe cumplir contrato SEO ES: title, meta, H1, pruebas, CTAs', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 1. SEO Básico
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // 2. H1 Autoridad (debe incluir "José Javier Sanahuja")
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(`${t_es.copy.hero.h1_part1} ${t_es.copy.hero.h1_part2}`);

    // 3. Prueba Social Visible (Fiverr 5★)
    const proofCard = page.locator('[data-proof-card]');
    await expect(proofCard).toBeVisible();
    await expect(proofCard).toContainText(t_es.copy.sections.proof.proofCard.rating);
    await expect(proofCard).toContainText(t_es.copy.sections.proof.proofCard.platform);

    // 4. Certificaciones Indexables (API o estático)
    const diplomasSection = page.locator('[data-diplomas-api]');
    await expect(diplomasSection).toBeVisible();

    // 5. CTA Post-Pruebas
    const primaryCTA = page.locator('#cta-final').getByRole('link', { name: t_es.copy.ctas.primary.text });
    await expect(primaryCTA).toHaveAttribute('href', t_es.copy.ctas.primary.url);

    // 6. Hreflang
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);

    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"ProfilePage"');
  });
});

test.describe('E2E/SEO: About Me (EN)', () => {
  // IDEM con t_en
});