import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; // ¡Usando el paquete bueno!

test.describe('A11Y: Test de Accesibilidad para AppHeader', () => {
  
  test('No debe tener violaciones de accesibilidad (A11y)', async ({ page }) => {
    // 1. Ir a la página que USA el header
    // (Usamos nuestra página "Punta de Lanza" que ya funciona)
    await page.goto('/es/servicios/diseno-web-tenerife');

    // 2. Esperar a que el DOM esté listo
    await page.waitForLoadState('domcontentloaded');

    // 3. ¡Preparar el hacha!
    // Esta vez, acotamos el análisis SOLO al <header>
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('header') // ¡Analiza SÓLO dentro del tag <header>!
      .analyze();

    // 4. ¡Verificar!
    // El test fallará si hay CUALQUIER violación en el array 'violations'
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});