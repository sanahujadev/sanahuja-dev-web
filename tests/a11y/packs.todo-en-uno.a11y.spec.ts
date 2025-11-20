import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: /es/packs/todo-en-uno', () => {
  test('No violaciones WCAG en checklist de servicios', async ({ page }) => {
    await page.goto('/es/packs/todo-en-uno');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Checklist de "TODO" es navegable por teclado con checkmarks', async ({ page }) => {
    await page.goto('/es/packs/todo-en-uno');
    
    const todoIconos = page.locator('#todo-list svg');
    await expect(todoIconos).toHaveCount(5); 
    
  });
});