import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: /es/packs/ (Hub)', () => {
  test('No violaciones WCAG 2.1 AA en tabla comparativa', async ({ page }) => {
    await page.goto('/es/packs/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Navegación por teclado: Tab llega a pack recomendado', async ({ page }) => {
    await page.goto('/es/packs/');
    
    const packRecomendado = page.locator('[data-pack-recomendado="todo-en-uno"] a');
    
    await expect(async () => {
      await page.keyboard.press('Tab');
      const isFocused = await packRecomendado.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }).toPass({ timeout: 15000 });
  });

  test('Tabla comparativa tiene caption para screen readers', async ({ page }) => {
    await page.goto('/es/packs/');
    
    const table = page.locator('#comparativa table');
    const caption = table.locator('caption');
    await expect(caption).toBeVisible();
    await expect(caption).toContainText('Comparativa de planes');
  });
});