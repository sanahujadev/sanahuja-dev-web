import { test, expect } from '@playwright/test';

// ¡Importamos desde la NUEVA ruta modular!
import copy_es from '../../src/i18n/es/services/diseno-web-tenerife.json' with { type: 'json' };
import copy_en from '../../src/i18n/en/services/diseno-web-tenerife.json' with { type: 'json' };

test.describe('E2E/SEO: "Diseño Web Tenerife" (/es/ y /en/)', () => {
  
  
  test('Debe cumplir el contrato SEO de Burro en Español', async ({ page }) => {
    const URL = copy_es.endpoint;
    // 1. Ir a la URL (Esto fallará con un 404)
    await page.goto(URL);

    // 2. Validar Title y Meta Description
    await expect(page).toHaveTitle(copy_es.title);
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', copy_es.meta_description);

    // 3. Validar H1 (¡Quirúrgico! Solo buscar dentro de <main>)
    const main = page.locator('main');
    const h1 = main.locator('h1'); // <-- ¡BUSCA EL H1 DENTRO DE MAIN!
    
    await expect(h1).toHaveCount(1); // <-- ¡Ahora SÍ encontrará 1!
    await expect(h1).toHaveText(copy_es.h1);

    // 4. Validar los CTAs (Versión Estricta)
    
    // El CTA primario del Hero
    const heroCTA = page.locator('#hero-diseno-web').getByRole('link', { name: copy_es.ctas[0].text });
    await expect(heroCTA).toHaveAttribute('href', copy_es.ctas[0].url);

    // El CTA secundario del Hero
    const secondaryCTA = page.locator('#hero-diseno-web').getByRole('link', { name: copy_es.ctas[1].text });
    await expect(secondaryCTA).toHaveAttribute('href', copy_es.ctas[1].url);
    
    // El CTA primario del Final
    const finalCTA = page.locator('#cta-final').getByRole('link', { name: copy_es.ctaFinal.buttonText });
    await expect(finalCTA).toHaveAttribute('href', copy_es.ctaFinal.buttonUrl);

    // ¡¡NUEVA VALIDACIÓN DE REFACTOR!!
    // 5. Validar Hreflang (SEO Bilingüe)
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    // Asumimos que la URL en inglés será la misma pero con /en/
    const enUrl = 'https://sanahuja.dev' + copy_en.endpoint;
    await expect(hreflangEn).toHaveAttribute('href', enUrl);

    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Service"');
  });

  test('Debe cumplir el contrato SEO de Burro en Ingles', async ({ page }) => {
    const URL = copy_en.endpoint;
    // 1. Ir a la URL (Esto fallará con un 404)
    await page.goto(URL);

    // 2. Validar Title y Meta Description
    await expect(page).toHaveTitle(copy_en.title);
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', copy_en.meta_description);

    // 3. Validar H1 (¡Quirúrgico! Solo buscar dentro de <main>)
    const main = page.locator('main');
    const h1 = main.locator('h1'); // <-- ¡BUSCA EL H1 DENTRO DE MAIN!
    
    await expect(h1).toHaveCount(1); // <-- ¡Ahora SÍ encontrará 1!
    await expect(h1).toHaveText(copy_en.h1);

    // 4. Validar los CTAs (Versión Estricta)
    
    // El CTA primario del Hero
    const heroCTA = page.locator('#hero-diseno-web').getByRole('link', { name: copy_en.ctas[0].text });
    await expect(heroCTA).toHaveAttribute('href', copy_en.ctas[0].url);

    // El CTA secundario del Hero
    const secondaryCTA = page.locator('#hero-diseno-web').getByRole('link', { name: copy_en.ctas[1].text });
    await expect(secondaryCTA).toHaveAttribute('href', copy_en.ctas[1].url);
    
    // El CTA primario del Final
    const finalCTA = page.locator('#cta-final').getByRole('link', { name: copy_en.ctaFinal.buttonText });
    await expect(finalCTA).toHaveAttribute('href', copy_en.ctaFinal.buttonUrl);

    // ¡¡NUEVA VALIDACIÓN DE REFACTOR!!
    // 5. Validar Hreflang (SEO Bilingüe)
    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');    // Asumimos que la URL en inglés será la misma pero con /en/
    const enUrl = 'https://sanahuja.dev' + copy_es.endpoint;
    await expect(hreflangEs).toHaveAttribute('href', enUrl);

    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Service"');
  });
});