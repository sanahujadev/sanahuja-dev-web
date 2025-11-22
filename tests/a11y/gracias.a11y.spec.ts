// tests/a11y/gracias.a11y.spec.ts
// ♿ GRACIAS DEBE SER ACCESIBLE INCLUSO PARA USUARIOS CIELOS
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: Gracias Proyecto (ES)', () => {
  
  test('No debe tener violaciones críticas WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/es/gracias-proyecto', { waitUntil: 'networkidle' });
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Timeline: pasos deben tener headings correctos (H2, H3)', async ({ page }) => {
    await page.goto('/es/gracias-proyecto', { waitUntil: 'networkidle' });
    
    // El título principal debe ser H2
    const timelineTitle = page.locator('#timeline h2');
    await expect(timelineTitle).toContainText('Próximos Pasos');
    
    // Cada step debe tener un H3
    const stepHeadings = page.locator('#timeline h3');
    await expect(stepHeadings).toHaveCount(3);
  });

  test('CTA a sobre-mí debe ser accesible por teclado', async ({ page }) => {
    await page.goto('/es/gracias-proyecto', { waitUntil: 'networkidle' });
    
    const ctaLink = page.locator('#loop a[href="/es/sobre-mi"]');
    
    // Tab hasta el link
    await expect(async () => {
      await page.keyboard.press('Tab');
      const isFocused = await ctaLink.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }).toPass({ timeout: 15000 });
    
    // Verifica focus indicator
    const hasFocusStyle = await ctaLink.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return parseInt(styles.outlineWidth) > 0 || styles.boxShadow !== 'none';
    });
    expect(hasFocusStyle).toBe(true);
  });

  test('Iconos decorativos (check, status) deben ser invisibles para screen readers', async ({ page }) => {
    await page.goto('/es/gracias-proyecto', { waitUntil: 'networkidle' });
    
    // Busca todos los SVGs decorativos
    const decorativeSVGs = page.locator('#hero svg, #timeline svg');
    const count = await decorativeSVGs.count();
    
    for (let i = 0; i < count; i++) {
      const svg = decorativeSVGs.nth(i);
      const ariaHidden = await svg.getAttribute('aria-hidden');
      const focusable = await svg.getAttribute('focusable');
      
      expect(ariaHidden).toBe('true');
      expect(focusable).toBe('false');
    }
  });
});