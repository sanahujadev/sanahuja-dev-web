import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; // ¡Usando el paquete bueno!

test.describe('A11Y: Test de Accesibilidad para "Mantenimiento Web"', () => {
  
  test('No debe tener violaciones de accesibilidad (A11y)', async ({ page }) => {
    // 1. Ir a la página
    await page.goto('/es/servicios/mantenimiento-web');

    // 2. Esperar a que el DOM esté listo
    await page.waitForLoadState('domcontentloaded');

    // 3. ¡Preparar el hacha!
    // ¡Analizamos la página ENTERA!
    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();

    // 4. ¡Verificar!
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});