// tests/a11y/home.a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: Home', () => {
  test('No violaciones críticas WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/es');
    await page.waitForLoadState('networkidle');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Navegación por teclado: Tab llega al CTA primario', async ({ page }) => {
    await page.goto('/es');
    
    const primaryCTA = page.locator('#hero a[data-cta="primary"]');
    
    await expect(async () => {
      await page.keyboard.press('Tab');
      const isFocused = await primaryCTA.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }).toPass({ timeout: 15000 });
    
    // VALIDA RING u OUTLINE (Brook usa ring, no outline)
    const hasIndicator = await primaryCTA.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return parseInt(styles.outlineWidth) > 0 || styles.boxShadow !== 'none';
    });
    expect(hasIndicator).toBe(true);
  });

  test('SVG decorativos no molestan a screen readers', async ({ page }) => {
    await page.goto('/es');
    const svgs = page.locator('main svg');
    const count = await svgs.count();
    for (let i = 0; i < count; i++) {
      const ariaHidden = await svgs.nth(i).getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('Imagen del logo tiene alt descriptivo', async ({ page }) => {
    await page.goto('/es');
    const logoImg = page.locator('img[alt*="Logo"]');
    await expect(logoImg).toHaveAttribute('alt', 'SanahujaDev Logo');
  });
});