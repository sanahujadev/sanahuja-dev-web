// tests/a11y/plan-de-autoridad-mensual.a11y.spec.ts
// ♿ ESTE TEST ES PARA HACER LLORAR A BROOK SI MATÓ EL FOCUS!
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: Servicios - Plan de Autoridad Mensual (ES)', () => {
  
  test('No debe tener violaciones críticas WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/es/servicios/plan-de-autoridad-mensual', { waitUntil: 'networkidle' });
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Si hay violaciones, este test hará que Brook se esconda debajo de la mesa
    expect(results.violations).toEqual([]);
  });

  test('Navegación por teclado: Tab llega al CTA primario con indicador visible', async ({ page }) => {
    await page.goto('/es/servicios/plan-de-autoridad-mensual', { waitUntil: 'networkidle' });
    
    // 🎯 Localiza el CTA primario
    const primaryCTA = page.locator('#hero a[data-cta="primary"]');
    
    // 🎹 Tab hasta él
    await expect(async () => {
      await page.keyboard.press('Tab');
      const isFocused = await primaryCTA.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }).toPass({ timeout: 15000 });
    
    // 💍 VERIFICA FOCUS INDICATOR (ring o outline, ¡NO TOCAR!)
    const hasIndicator = await primaryCTA.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return parseInt(styles.outlineWidth) > 0 || 
             styles.boxShadow !== 'none' ||
             styles.outlineStyle !== 'none';
    });
    expect(hasIndicator).toBe(true);
  });

  test('Iconos decorativos no molestan a screen readers', async ({ page }) => {
    await page.goto('/es/servicios/plan-de-autoridad-mensual', { waitUntil: 'networkidle' });
    
    // 🔍 Busca todos los SVGs
    const svgs = page.locator('svg');
    const count = await svgs.count();
    
    for (let i = 0; i < count; i++) {
      const svg = svgs.nth(i);
      const ariaHidden = await svg.getAttribute('aria-hidden');
      const focusable = await svg.getAttribute('focusable');
      
      // ¡Si falta aria-hidden="true", el test EXPLOTA!
      expect(ariaHidden).toBe('true');
      expect(focusable).toBe('false');
    }
  });

  test('Las cards de dolor tienen headings correctos (H2, H3)', async ({ page }) => {
    await page.goto('/es/servicios/plan-de-autoridad-mensual', { waitUntil: 'networkidle' });
    
    // La sección de pain points debe tener un H2
    const sectionHeading = page.locator('#pain-points h2');
    await expect(sectionHeading).toBeVisible();
    
    // Cada card debe tener un H3 (no un div disfrazado)
    const cardHeadings = page.locator('#pain-points .feature-card h3');
    await expect(cardHeadings).toHaveCount(4);
    
    // Verifica que son realmente headings (accesibles)
    for (let i = 0; i < 4; i++) {
      const role = await cardHeadings.nth(i).getAttribute('role');
      expect(role).not.toBe('presentation'); // ¡NO PUEDE SER UN DIV!
    }
  });
});