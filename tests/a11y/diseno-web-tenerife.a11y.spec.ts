import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ¡Importamos el JSON para saber a qué URL atacar!
import copy from '../../src/i18n/es/services/diseno-web-tenerife.json' with { type: 'json' };

test.describe('A11Y: Landing Page "Diseño Web Tenerife" (/es/)', () => {
  
  const URL = copy.endpoint;

  test('No debe tener violaciones de accesibilidad (A11y)', async ({ page }) => {
    // 1. Ir a la URL
    await page.goto(URL);

    // 2. Esperar a que la página esté estable (esta vez sí, es una buena práctica)
    await page.waitForLoadState('domcontentloaded');

    // 3. ¡Preparar el hacha!
    const accessibilityScanResults = await new AxeBuilder({ page })
      // .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']) // <-- Podemos ser más estrictos si queremos
      .analyze();

    // 4. ¡Verificar!
    // El test fallará si hay CUALQUIER violación en el array 'violations'
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
