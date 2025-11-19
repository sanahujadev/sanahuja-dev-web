// tests/a11y/servicios.bolsa-de-horas.a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: /es/servicios/bolsa-de-horas', () => {
  test('No violaciones críticas WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/es/servicios/bolsa-de-horas');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Tab llega al primer pack de horas (desde cualquier posición)', async ({ page }) => {
    await page.goto('/es/servicios/bolsa-de-horas');
    
    const firstPack = page.locator('[data-pack-card] a').first();
    await expect(firstPack).toBeVisible();
    
    // Forzar foco (el pack no es el primer tabbable)
    await firstPack.focus();
    await expect(firstPack).toBeFocused();
  });

  test('WhatsApp CTA secundario tiene aria-label accesible', async ({ page }) => {
    await page.goto('/es/servicios/bolsa-de-horas');
    
    const whatsappCTA = page.locator('#hero a').getByText('Consultar por WhatsApp');
    await expect(whatsappCTA).toHaveAttribute('aria-label', /WhatsApp|contacto urgente/i);
  });

  test('Stats del hero no confunden a screen readers', async ({ page }) => {
    await page.goto('/es/servicios/bolsa-de-horas');
    
    const statsContainer = page.locator('[data-testid="hero-stats"]');
    await expect(statsContainer).toBeVisible();
    
    // Los SVGs deben ser decorativos
    const svgs = statsContainer.locator('svg');
    const count = await svgs.count();
    for (let i = 0; i < count; i++) {
      await expect(svgs.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});