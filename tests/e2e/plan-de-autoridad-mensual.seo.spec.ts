// tests/e2e/servicios/plan-de-autoridad-mensual.seo.spec.ts
// ¡ESTE TEST VA A FALLAR COMO UN NOVATO EN LA NBA!
import { test, expect } from '@playwright/test';
import t from '../../src/i18n/es/services/plan-autoridad-mensual.json' assert { type: 'json' };
// import t_en from '../../src/i18n/en/services/plan-autoridad-mensual.json' assert { type: 'json' };

test.describe('E2E/SEO: Servicios - Plan de Autoridad Mensual (ES)', () => {
  const URL = '/es/servicios/plan-de-autoridad-mensual';

  test('Debe cumplir contrato SEO ES completo: title, meta, H1, badges, CTAs, Schema', async ({ page }) => {
    // FIX: Go full slow-mo para que Firefox no se suicide
    await page.goto(URL, { waitUntil: 'networkidle' });
    
    // 📍 METADATA HEAD
    await expect(page).toHaveTitle(t.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t.metadata.description);
    
    // 🏴‍☠️ H1 HERO
    await expect(page.locator('main section#hero h1')).toHaveCount(1);
    const h1Text = await page.locator('main section#hero h1').innerText();
    expect(h1Text).toContain(t.copy.hero.h1_part1);
    expect(h1Text).toContain(t.copy.hero.h1_part2);
    
    // 🎯 BADGE Y LEAD
    await expect(page.locator('main section#hero')).toContainText(t.copy.hero.badge);
    await expect(page.locator('main section#hero')).toContainText(t.copy.hero.h1_lead);
    
    // 🚀 CTAS QUIRÚRGICOS
    const primaryCTA = page.locator('#hero').getByRole('link', { name: t.copy.hero.ctas.primary.text });
    await expect(primaryCTA).toHaveAttribute('href', t.copy.hero.ctas.primary.url);
    await expect(primaryCTA).toHaveAttribute('data-cta', 'primary');
    
    const secondaryCTA = page.locator('#hero').getByRole('link', { name: t.copy.hero.ctas.secondary.text });
    await expect(secondaryCTA).toHaveAttribute('href', t.copy.hero.ctas.secondary.url);
    await expect(secondaryCTA).toHaveAttribute('data-cta', 'secondary');
    
    // 🌐 HREFLANG
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/services\/authority-plan/);
    
    // 📊 SCHEMA.ORG (Service)
    const schemaScript = page.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    const schemaContent = await schemaScript.textContent();
    const schema = JSON.parse(schemaContent || '{}');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Service');
    expect(schema.serviceType).toBe('Content Marketing & SEO Strategy');
    
    // 🎴 FEATURE CARDS (Pain Points Section)
    await expect(page.locator('#pain-points .feature-card')).toHaveCount(4);
    // Verifica que cada card tiene título y descripción
    for (const card of t.copy.sections.painPoints.cards) {
      await expect(page.locator('#pain-points')).toContainText(card.title);
      await expect(page.locator('#pain-points')).toContainText(card.description);
    }
    
    // 💰 PRICING CTA
    await expect(page.locator('#pricing')).toContainText(t.copy.sections.pricing.cta);
    await expect(page.locator('#pricing a[href*="pack-sociotecnico-digital"]')).toBeVisible();
    
    // 🎯 FINAL CTA
    await expect(page.locator('#cta-final')).toContainText(t.copy.sections.ctaFinal.title);
    await expect(page.locator('#cta-final a[href*="/formulario-inicial"]')).toBeVisible();
  });

  test('Debe tener solo un H1 por página (SEO Canonical)', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // ¡UNO SOLO, COMO MI PAIR PROGRAMMER IDEAL!
  });
});
/*
test.describe('E2E/SEO: Services - Authority Plan (EN)', () => {
  const URL = '/en/services/authority-plan';

  test('Must comply with full EN SEO contract: title, meta, H1, badges, CTAs, Schema', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    
    // 📍 METADATA HEAD
    await expect(page).toHaveTitle(t_en.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_en.metadata.description);
    
    // 🏴‍☠️ H1 HERO
    await expect(page.locator('main section#hero h1')).toHaveCount(1);
    const h1Text = await page.locator('main section#hero h1').innerText();
    expect(h1Text).toContain(t_en.copy.hero.h1_part1);
    expect(h1Text).toContain(t_en.copy.hero.h1_part2);
    
    // 🎯 BADGE Y LEAD (ENGLISH VERSION)
    await expect(page.locator('main section#hero')).toContainText(t_en.copy.hero.badge);
    await expect(page.locator('main section#hero')).toContainText(/Digital Assets/); // Partial check for HTML in lead
    
    // 🚀 CTAS QUIRÚRGICOS
    const primaryCTA = page.locator('#hero').getByRole('link', { name: t_en.copy.hero.ctas.primary.text });
    await expect(primaryCTA).toHaveAttribute('href', t_en.copy.hero.ctas.primary.url);
    await expect(primaryCTA).toHaveAttribute('data-cta', 'primary');
    
    // 🌐 HREFLANG BACK TO ES
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', /\/es\/servicios\/plan-de-autoridad-mensual/);
    
    // 📊 SCHEMA.ORG (Service)
    const schemaScript = page.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    const schemaContent = await schemaScript.textContent();
    const schema = JSON.parse(schemaContent || '{}');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Service');
    expect(schema.serviceType).toBe('Content Marketing & SEO Strategy');
  });
});*/