// tests/a11y/sobre-mi.a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: Sobre Mí', () => {
  test('No violaciones críticas WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/es/sobre-mi');
    await page.waitForLoadState('networkidle'); // FIX para Firefox

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Fiverr link tiene rel="nofollow noopener noreferrer"', async ({ page }) => {
    await page.goto('/es/sobre-mi');
    const fiverrLink = page.locator('main a[href*="fiverr.com"]');
    await expect(fiverrLink).toHaveAttribute('rel', 'nofollow noopener noreferrer');
  });
});