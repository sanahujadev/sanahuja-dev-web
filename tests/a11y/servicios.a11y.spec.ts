// tests/a11y/servicios.a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11Y: /es/servicios (Hub)', () => {
  test('No violaciones críticas WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/es/servicios');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Grid de servicios es navegable completamente por teclado', async ({ page }) => {
    await page.goto('/es/servicios');
    
    // Tab al primer servicio
    const firstService = page.locator('[data-service-card] a').first();
    await firstService.focus();
    await expect(firstService).toBeFocused();
    
    // Tab al segundo
    await page.keyboard.press('Tab');
    const secondService = page.locator('[data-service-card] a').nth(1);
    await expect(secondService).toBeFocused();
  });

  test('Cada servicio tiene icono decorativo con aria-hidden', async ({ page }) => {
    await page.goto('/es/servicios');
    
    const serviceCards = page.locator('[data-service-card]');
    const firstCardIcon = serviceCards.first().locator('svg').first();
    await expect(firstCardIcon).toHaveAttribute('aria-hidden', 'true');
  });

  test('Headings mantienen jerarquía H1→H2→H3', async ({ page }) => {
    await page.goto('/es/servicios');
    
    const h1Count = await page.locator('main h1').count();
    expect(h1Count).toBe(1);
    
    const sectionH2 = page.locator('#intro h2');
    await expect(sectionH2).toHaveCount(1);
    
    const cardH2 = page.locator('[data-service-card] h2');
    await expect(cardH2).toHaveCount(6);
  });
});