import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; // ¡Usando el paquete bueno!

test.describe('A11Y: Test de Accesibilidad para AppFooter', () => {
  
  test('No debe tener violaciones de accesibilidad (A11y)', async ({ page }) => {
    // 1. Ir a la página que USA el footer
    await page.goto('/es/servicios/diseno-web-tenerife');

    // 2. Esperar a que el DOM esté listo
    await page.waitForLoadState('domcontentloaded');

    // 3. ¡Preparar el hacha!
    // ¡Acotamos el análisis SOLO al <footer>!
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('footer') // ¡Analiza SÓLO dentro del tag <footer>!
      .analyze();

    // 4. ¡Verificar!
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});