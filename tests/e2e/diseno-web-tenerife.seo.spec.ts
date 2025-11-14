import { test, expect } from '@playwright/test';

// ¡Importamos desde la NUEVA ruta modular!
import copy from '../../src/i18n/es/services/diseno-web-tenerife.json' with { type: 'json' };

test.describe('E2E/SEO: Landing Page "Diseño Web Tenerife" (/es/)', () => {
  
  const URL = copy.endpoint;

  test('Debe cumplir el contrato SEO de Burro', async ({ page }) => {
    // 1. Ir a la URL (Esto fallará con un 404)
    await page.goto(URL);

    // 2. Validar Title y Meta Description
    await expect(page).toHaveTitle(copy.title);
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', copy.meta_description);

    // 3. Validar H1 (¡Quirúrgico! Solo buscar dentro de <main>)
    const main = page.locator('main');
    const h1 = main.locator('h1'); // <-- ¡BUSCA EL H1 DENTRO DE MAIN!
    
    await expect(h1).toHaveCount(1); // <-- ¡Ahora SÍ encontrará 1!
    await expect(h1).toHaveText(copy.h1);

    // 4. Validar los CTAs (Versión Estricta)
    
    // El CTA primario del Hero
    const heroCTA = page.locator('#hero-diseno-web').getByRole('link', { name: copy.ctas[0].text });
    await expect(heroCTA).toHaveAttribute('href', copy.ctas[0].url);

    // El CTA secundario del Hero
    const secondaryCTA = page.locator('#hero-diseno-web').getByRole('link', { name: copy.ctas[1].text });
    await expect(secondaryCTA).toHaveAttribute('href', copy.ctas[1].url);
    
    // El CTA primario del Final
    const finalCTA = page.locator('#cta-final').getByRole('link', { name: copy.ctaFinal.buttonText });
    await expect(finalCTA).toHaveAttribute('href', copy.ctaFinal.buttonUrl);

    // ¡¡NUEVA VALIDACIÓN DE REFACTOR!!
    // 5. Validar Hreflang (SEO Bilingüe)
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    // Asumimos que la URL en inglés será la misma pero con /en/
    const enUrl = 'https://sanahuja.dev' + copy.endpoint.replace('/es/', '/en/');
    await expect(hreflangEn).toHaveAttribute('href', enUrl);
  });
});