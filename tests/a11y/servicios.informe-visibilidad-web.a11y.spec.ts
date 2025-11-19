// tests/a11y/servicios.informe-visibilidad-web.a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: /es/servicios/informe-visibilidad-web', () => {
  test('No violaciones críticas WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/es/servicios/informe-visibilidad-web');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Enlace al mantenimiento-web es accesible por teclado', async ({ page }) => {
    await page.goto('/es/servicios/informe-visibilidad-web');
    
    const mantenimientoLink = page.locator('#next-step a[href*="/servicios/mantenimiento-web"]');
    await expect(mantenimientoLink).toBeVisible();
    
    await mantenimientoLink.focus();
    await expect(mantenimientoLink).toBeFocused();
  });

  test('Herramientas grid tiene headings correctos (h2 → h3)', async ({ page }) => {
    await page.goto('/es/servicios/informe-visibilidad-web');
    
    const methodologyH2 = page.locator('#methodology h2');
    await expect(methodologyH2).toHaveCount(1);
    
    const toolNames = page.locator('#methodology h3');
    await expect(toolNames).toHaveCount(4); // Search Console, Lighthouse, GA4, Looker
  });

  test('Iconos de síntomas son decorativos (aria-hidden)', async ({ page }) => {
    await page.goto('/es/servicios/informe-visibilidad-web');
    
    const symptomCards = page.locator('#symptoms [data-symptom-card]');
    const firstCardIcon = symptomCards.first().locator('svg');
    await expect(firstCardIcon).toHaveAttribute('aria-hidden', 'true');
  });
});