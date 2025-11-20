import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: /es/packs/pack-imagen-digital', () => {
  test('No violaciones WCAG en sección de reseñas', async ({ page }) => {
    await page.goto('/es/packs/pack-imagen-digital');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Iconos de estrellas tienen aria-label', async ({ page }) => {
    await page.goto('/es/packs/pack-imagen-digital');
    
    const starIcons = page.locator('#gmb-focus svg');
    const count = await starIcons.count();
    for (let i = 0; i < count; i++) {
      const ariaLabel = await starIcons.nth(i).getAttribute('aria-label');
      expect(ariaLabel).toMatch(/estrella|calificación/i);
    }
  });
});