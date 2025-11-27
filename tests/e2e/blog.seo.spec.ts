// tests/e2e/blog.seo.spec.ts
import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/blog/index.json' assert { type: 'json' };
import t_en from '../../src/i18n/en/blog/index.json' assert { type: 'json' };

test.describe('E2E/SEO: Blog Hub (ES)', () => {
  const URL = '/es/blog';

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
  });

  test('🔥 Debe cumplir contrato SEO ES completo: title, meta, H1, CTA', async ({ page }) => {
    // TITLE y META DESCRIPTION
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);
    
    // H1: Tecnología con Visión de Negocio.
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    // El H1 tiene HTML, verificamos el texto plano
    await expect(h1.locator('span')).toHaveText('Visión de Negocio.');
    
    // CTA Hero con anchor
    const heroCTA = page.locator('#hero').getByRole('link', { name: t_es.copy.hero.cta.text });
    await expect(heroCTA).toHaveAttribute('href', t_es.copy.hero.cta.anchor);
    
    // HREFLANG alternates
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);
  });

  test('🔥 Debe renderizar categorías con iconos y tooltips', async ({ page }) => {
    const categories = page.locator('[data-testid="category-filter"]');
    await expect(categories).toHaveCount(t_es.copy.categories.items.length);
    
    // Verificar primer categoría (Ver todo)
    const firstCat = categories.nth(0);
    await expect(firstCat).toHaveAttribute('data-category', 'all');
    await expect(firstCat).toHaveAttribute('title', 'Ver todo');
    
    // Verificar categoría WPO con tooltip
    const wpoCat = page.locator('[data-testid="category-filter"][data-category="wpo"]');
    await expect(wpoCat).toHaveAttribute('title', 'Optimización de velocidad y carga');
  });

  test('🔥 Debe mostrar posts iniciales (Mock Data)', async ({ page }) => {
    // Como cargamos stub data, NO debe mostrar empty state inicialmente
    const emptyState = page.locator('[data-testid="empty-state"]');
    await expect(emptyState).not.toBeVisible(); // O espera hidden

    // Debe haber artículos
    const articles = page.locator('article');
    await expect(articles).not.toHaveCount(0);
  });

  test('🔥 Debe tener newsletter con formulario accesible', async ({ page }) => {
    const newsletter = page.locator('[data-testid="newsletter"]');
    await expect(newsletter).toBeVisible();
    
    // Input email con placeholder
    const emailInput = newsletter.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('placeholder', t_es.copy.newsletter.placeholder);
    
    // Botón con texto correcto
    const submitBtn = newsletter.getByRole('button', { name: t_es.copy.newsletter.button });
    await expect(submitBtn).toBeVisible();
  });

  test('🔥 Debe tener CTA final con tracking de fuente', async ({ page }) => {
    const finalCTA = page.locator('[data-testid="cta-final"]');
    await expect(finalCTA).toBeVisible();
    
    const ctaBtn = finalCTA.getByRole('link', { name: t_es.copy.ctaFinal.button });
    await expect(ctaBtn).toHaveAttribute('href', t_es.copy.ctaFinal.url);
    await expect(ctaBtn).toHaveAttribute('href', /source=blog_footer/); // URL parametrizada
  });
});

test.describe('E2E/SEO: Blog Hub (EN)', () => {
  const URL = '/en/blog';

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
  });

  test('🔥 Debe cumplir contrato SEO EN completo', async ({ page }) => {
    await expect(page).toHaveTitle(t_en.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_en.metadata.description);
    
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1.locator('span')).toHaveText('Business Vision.'); // Traduces esto en tu JSON EN
    
    // HREFLANG español
    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    await expect(hreflangEs).toHaveAttribute('href', 'https://sanahuja.dev' + t_en.alternateUrl);
  });

  test('🔥 Debe tener categorías en inglés', async ({ page }) => {
    const categories = page.locator('[data-testid="category-filter"]');
    await expect(categories).toHaveCount(t_en.copy.categories.items.length);
  });
});