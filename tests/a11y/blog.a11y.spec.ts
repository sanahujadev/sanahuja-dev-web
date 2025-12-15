// tests/a11y/blog.a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: Blog Hub', () => {
  test('🪓 No violaciones críticas WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/es/blog');
    await page.waitForLoadState('domcontentloaded');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
/*
  test('⌨️ Navegación Tab llega a categorías y CTA', async ({ page }) => {
    await page.goto('/es/blog');
    
    // Reset focus context
    await page.locator('#cta-hero').focus();

    // Tab hasta primera categoría
    const firstCategory = page.locator('[data-testid="category-filter"]').first();
    await expect(async () => {
        // Esperar hasta que la primera categoría tenga foco
        const isFocused = await firstCategory.evaluate(el => el === document.activeElement);
        expect(isFocused).toBe(true);
    }).toPass({ timeout: 18000 });

    // Tabular hasta el CTA final
    const finalCTA = page.locator('[data-testid="cta-final"]').getByRole('link', { name: /solicitar/i });
    
    await expect(async () => {
      let found = false;
      for (let i = 0; i < 20; i++) { 
        await page.keyboard.press('Tab');
        const isFocused = await finalCTA.evaluate(el => el === document.activeElement);
        if (isFocused) {
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    }).toPass({ timeout: 15000 });
    
    // Validar indicador de foco
    const hasIndicator = await finalCTA.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return (parseInt(styles.outlineWidth) > 0 && styles.outlineStyle !== 'none') || styles.boxShadow !== 'none';
    });
    expect(hasIndicator).toBe(true);
  }); */
  test('🎨 Empty State debe ser accesible con ARIA labels', async ({ page }) => {
    await page.goto('/es/blog');
    
    // Simular estado vacío ocultando el grid y mostrando el empty state
    await page.evaluate(() => {
        const grid = document.getElementById('posts-grid');
        const empty = document.getElementById('empty-state');
        if(grid) grid.classList.add('hidden');
        if(empty) {
            empty.classList.remove('hidden');
            empty.style.display = 'block';
        }
    });

    const emptyState = page.locator('[data-testid="empty-state"]');
    await expect(emptyState).toHaveAttribute('role', 'region');
    await expect(emptyState.locator('h3')).toBeVisible();
    
    // SVG decorativo debe ser aria-hidden
    const decorativeSVG = emptyState.locator('svg').first();
    await expect(decorativeSVG).toHaveAttribute('aria-hidden', 'true');
  });

  test('📧 Formulario newsletter debe tener labels asociados', async ({ page }) => {
    await page.goto('/es/blog');
    
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('aria-label', 'Email para newsletter');
    
    const submitBtn = page.getByRole('button', { name: /suscribirse/i });
    await expect(submitBtn).toBeEnabled();
  });
});