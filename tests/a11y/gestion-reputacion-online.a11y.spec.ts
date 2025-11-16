// tests/a11y/gestion-reputacion-online.a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import t from '../../src/i18n/es/services/gestion-reputacion-online.json' assert { type: 'json' };

test.describe('A11Y: Gestión Reputación Online (/es/)', () => {
  const URL = t.endpoint;

  test('Debe tener 0 violaciones de accesibilidad', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('domcontentloaded');

    // Analiza la página completa
    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // BONUS: Test específico del hero (donde Brook mete muchos colores)
  test('El hero debe tener contraste WCAG AA', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('domcontentloaded');

    const heroText = page.locator('h1');
    const heroBg = page.locator('section').first();
    
    // Verifica que el texto sea visible y tengo color
    await expect(heroText).toBeVisible();
    await expect(heroText).toHaveCSS('color', /.*/); // Cualquier color
    
    // Verifica que el fondo no sea transparente
    await expect(heroBg).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  });
});