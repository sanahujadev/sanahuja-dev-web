// tests/e2e/pack-sociotecnico-digital.seo.spec.ts
import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/pack/pack-sociotecnico-digital.json' assert { type: 'json' };
import t_en from '../../src/i18n/en/pack/pack-sociotecnico-digital.json' assert { type: 'json' };

test.describe('E2E/SEO: Pack Sociotécnico Digital (ES)', () => {
  const URL = '/es/packs/pack-sociotecnico-digital';

  test('Debe cumplir contrato SEO ES: title, meta, H1, hero, stats, features, valor, CTAs', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // ── SEO BÁSICO ──
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // ── HERO ──
    await expect(page.getByText(t_es.copy.heroBadge)).toBeVisible();
    
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(`${t_es.copy.h1_part1} ${t_es.copy.h1_part2}`);
    await expect(page.getByText(t_es.copy.h1_lead)).toBeVisible();

    // ── HERO STATS ──
    const statsContainer = page.locator('[data-testid="hero-stats"]');
    await expect(statsContainer).toBeVisible();
    for (const stat of t_es.copy.heroVisual.stats) {
      const statItem = statsContainer.locator(`[data-stat-label="${stat.label}"]`);
      await expect(statItem).toContainText(stat.label);
      await expect(statItem).toContainText(stat.value);
    }

    // ── FEATURE CARDS ──
    const featuresGrid = page.locator('[data-testid="feature-cards"]');
    await expect(featuresGrid).toBeVisible();
    for (const card of t_es.copy.sections.incluye.featureCards) {
      const cardLocator = featuresGrid.locator(`[data-feature="${card.title}"]`);
      await expect(cardLocator).toBeVisible();
      await expect(cardLocator.locator('h3')).toHaveText(card.title);
      await expect(cardLocator).toContainText(card.description);
      await expect(cardLocator).toContainText(card.price);
      await expect(cardLocator.locator('svg')).toBeVisible();
    }

    // ── VALOR BREAKDOWN ──
    const valorSection = page.locator('[data-testid="valor-breakdown"]');
    for (const item of t_es.copy.sections.valor.breakdown) {
      const row = valorSection.locator(`[data-breakdown-label="${item.label}"]`);
      await expect(row).toContainText(item.label);
      await expect(row).toContainText(item.value);
    }

    // ── CTAs QUIRÚRGICOS ──
    // CTA primario en HERO
    const heroPrimaryCTA = page.locator('#hero-pack').getByRole('link', { name: t_es.copy.ctas.primary.text });
    await expect(heroPrimaryCTA).toHaveAttribute('href', t_es.copy.ctas.primary.url);
    await expect(heroPrimaryCTA).toHaveAttribute('data-cta', 'primary');

    // CTA secundario en HERO
    const heroSecondaryCTA = page.locator('#hero-pack').getByRole('link', { name: t_es.copy.ctas.secondary.text });
    await expect(heroSecondaryCTA).toHaveAttribute('href', t_es.copy.ctas.secondary.url);
    await expect(heroSecondaryCTA).toHaveAttribute('data-cta', 'secondary');

    // CTA primario en FINAL (repetido, pero válido)
    const finalPrimaryCTA = page.locator('#cta-final').getByRole('link', { name: t_es.copy.ctas.primary.text });
    await expect(finalPrimaryCTA).toHaveAttribute('href', t_es.copy.ctas.primary.url);
    await expect(finalPrimaryCTA).toHaveAttribute('data-cta', 'primary');

    // ── HREFLANG ──
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);
  });

  test('Debe tener Schema.org JSON-LD para Product (precio, rating, etc.)', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain('"@type":"Product"');
    expect(jsonLd).toContain('"name":"Pack Sociotécnico Digital"');
    expect(jsonLd).toContain('"price":"145.00"');
    expect(jsonLd).toContain('"priceCurrency":"EUR"');
  });

  // ingles
  test.describe('E2E/SEO: Sociotechnical Pack (EN)', () => {
    const URL = '/en/packs/technical-partner-pack';

    test('Must fulfill EN SEO contract: title, meta, H1, hero, stats, features, value, CTAs', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // ── BASIC SEO ──
      await expect(page).toHaveTitle(t_en.metadata.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_en.metadata.description);

      // ── HERO ──
      await expect(page.getByText(t_en.copy.heroBadge)).toBeVisible();
      
      const h1 = page.locator('main h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(`${t_en.copy.h1_part1} ${t_en.copy.h1_part2}`);
      await expect(page.getByText(t_en.copy.h1_lead)).toBeVisible();

      // ── HERO STATS ──
      const statsContainer = page.locator('[data-testid="hero-stats"]');
      await expect(statsContainer).toBeVisible();
      for (const stat of t_en.copy.heroVisual.stats) {
        const statItem = statsContainer.locator(`[data-stat-label="${stat.label}"]`);
        await expect(statItem).toContainText(stat.label);
        await expect(statItem).toContainText(stat.value);
      }

      // ── FEATURE CARDS ──
      const featuresGrid = page.locator('[data-testid="feature-cards"]');
      await expect(featuresGrid).toBeVisible();
      for (const card of t_en.copy.sections.incluye.featureCards) {
        const cardLocator = featuresGrid.locator(`[data-feature="${card.title}"]`);
        await expect(cardLocator).toBeVisible();
        await expect(cardLocator.locator('h3')).toHaveText(card.title);
        await expect(cardLocator).toContainText(card.description);
        await expect(cardLocator).toContainText(card.price);
        await expect(cardLocator.locator('svg')).toBeVisible();
      }

      // ── VALUE BREAKDOWN ──
      const valorSection = page.locator('[data-testid="valor-breakdown"]');
      for (const item of t_en.copy.sections.valor.breakdown) {
        const row = valorSection.locator(`[data-breakdown-label="${item.label}"]`);
        await expect(row).toContainText(item.label);
        await expect(row).toContainText(item.value);
      }

      // ── SURGICAL CTAs ──
      const heroPrimaryCTA = page.locator('#hero-pack').getByRole('link', { name: t_en.copy.ctas.primary.text });
      await expect(heroPrimaryCTA).toHaveAttribute('href', t_en.copy.ctas.primary.url);
      await expect(heroPrimaryCTA).toHaveAttribute('data-cta', 'primary');

      const heroSecondaryCTA = page.locator('#hero-pack').getByRole('link', { name: t_en.copy.ctas.secondary.text });
      await expect(heroSecondaryCTA).toHaveAttribute('href', t_en.copy.ctas.secondary.url);
      await expect(heroSecondaryCTA).toHaveAttribute('data-cta', 'secondary');

      const finalPrimaryCTA = page.locator('#cta-final').getByRole('link', { name: t_en.copy.ctas.primary.text });
      await expect(finalPrimaryCTA).toHaveAttribute('href', t_en.copy.ctas.primary.url);
      await expect(finalPrimaryCTA).toHaveAttribute('data-cta', 'primary');

      // ── HREFLANG ──
      const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
      await expect(hreflangEs).toHaveAttribute('href', 'https://sanahuja.dev' + t_en.alternateUrl);
    });

    test('Must have Schema.org JSON-LD for Product', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
      expect(jsonLd).toContain('"@type":"Product"');
      expect(jsonLd).toContain('"name":"Technical Partner Pack"');
      expect(jsonLd).toContain('"price":"145.00"');
      expect(jsonLd).toContain('"priceCurrency":"EUR"');
    });
  });
});