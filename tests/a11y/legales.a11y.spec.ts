// tests/a11y/legales.a11y.spec.ts
// ♿ LAS LEGALES DEBEN SER LEGIBLES INCLUSO PARA UN ROBOT CIELO!
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: Páginas Legales (ES)', () => {
  
  test('Términos y Condiciones: WCAG 2.1 AA sin violaciones', async ({ page }) => {
    await page.goto('/es/terminos-y-condiciones', { waitUntil: 'networkidle' });
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Política de Privacidad: WCAG 2.1 AA sin violaciones', async ({ page }) => {
    await page.goto('/es/politica-de-privacidad', { waitUntil: 'networkidle' });
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Política de Cookies: Texto legible, contraste adecuado', async ({ page }) => {
    await page.goto('/es/politica-de-cookies', { waitUntil: 'networkidle' });
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wg21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
    
    // Verifica que el intro es corto y claro (no un muro de texto)
    const introText = await page.locator('main').innerText();
    
    const hasCrawlBudget = introText.includes('No te espiamos');
    expect(hasCrawlBudget).toBe(true); // ¡UX CLARA O MUERTE!
  });
  
 
});