import { test, expect } from '@playwright/test';
// ¡Importamos el contrato de Burro que SÍ tenemos!
import t_es from '../../src/i18n/es/services/mantenimiento-web.json' assert { type: 'json' };
import t_en from '../../src/i18n/en/services/mantenimiento-web.json' assert { type: 'json' };

test.describe('E2E/SEO: Landing Page "Mantenimiento Web" (/es/)', () => {

  const URL = t_es.endpoint; // <-- /es/servicios/mantenimiento-web

  test('Debe cumplir el NUEVO contrato SEO y de contenido de Burro en ES', async ({ page }) => {
    // 1. NAVEGACIÓN
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 2. VERIFICACIÓN SEO (¡NUEVA RUTA DE JSON!)
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // 3. VERIFICACIÓN H1 (¡NUEVA RUTA DE JSON!)
    const main = page.locator('main');
    const h1 = main.locator('h1');
    await expect(h1).toHaveCount(1);
    // ¡El H1 ahora está en dos partes! ¡El test busca el texto completo!
    await expect(h1).toHaveText(`${t_es.copy.h1_part1} ${t_es.copy.h1_part2}`);

    // 4. VERIFICACIÓN CTAs (¡LA VERSIÓN QUIRÚRGICA!)
    
    // ¡Buscamos el CTA primario DENTRO DEL HERO!
    const heroCTA = page.locator('#hero-mantenimiento').getByRole('link', { name: t_es.copy.ctas.primary.text });
    await expect(heroCTA).toHaveAttribute('href', t_es.copy.ctas.primary.url);

    // ¡Buscamos el CTA secundario DENTRO DEL HERO!
    const heroCTASecondary = page.locator('#hero-mantenimiento').getByRole('link', { name: t_es.copy.ctas.secondary.text });
    await expect(heroCTASecondary).toHaveAttribute('href', t_es.copy.ctas.secondary.url);
    
    // ¡Buscamos el CTA (repetido) DENTRO DEL FINAL!
    // (Asumimos que el #cta-final SÍ usa el texto del primario, ¡como dice el log!)
    const finalCTA = page.locator('#cta-final').getByRole('link', { name: t_es.copy.ctas.primary.text });
    await expect(finalCTA).toHaveAttribute('href', t_es.copy.ctas.primary.url);

    // 5. VERIFICACIÓN HREFLANG
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    const enUrl = 'https://sanahuja.dev' + t_es.alternateUrl;
    await expect(hreflangEn).toHaveAttribute('href', enUrl);

    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Service"');

    // 6. VERIFICACIÓN DE CONTENIDO (¡Un H2 para estar seguros!)
    await expect(page.getByRole('heading', { name: t_es.copy.sections.problema.title, level: 2 })).toBeVisible();
  });

  // --- TEST 2: EL INGLÉS ---
  test('Debe cumplir el NUEVO contrato SEO y de contenido de Burro en EN', async ({ page }) => {
    
    const t = t_en; // ¡Usamos el JSON de Inglés!
    const URL = t.endpoint; // <-- /en/services/web-maintenance
    
    // 1. NAVEGACIÓN
    await page.goto(URL);

    // 2. VERIFICACIÓN SEO
    await expect(page).toHaveTitle(t.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t.metadata.description);

    // 3. VERIFICACIÓN H1
    const main = page.locator('main');
    const h1 = main.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(`${t.copy.h1_part1} ${t.copy.h1_part2}`);

    // 4. VERIFICACIÓN CTAs (¡Quirúrgico!)
    const heroCTA = page.locator('#hero-mantenimiento').getByRole('link', { name: t.copy.ctas.primary.text });
    await expect(heroCTA).toHaveAttribute('href', t.copy.ctas.primary.url);
    
    const heroCTASecondary = page.locator('#hero-mantenimiento').getByRole('link', { name: t.copy.ctas.secondary.text });
    await expect(heroCTASecondary).toHaveAttribute('href', t.copy.ctas.secondary.url);
    
    const finalCTA = page.locator('#cta-final').getByRole('link', { name: t.copy.ctas.primary.text });
    await expect(finalCTA).toHaveAttribute('href', t.copy.ctas.primary.url);

    // 5. VERIFICACIÓN HREFLANG (¡El Inglés apunta al Español!)
    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    // ¡Usamos el JSON de Español para la URL correcta!
    const esUrl = 'https://sanahuja.dev' + t_en.alternateUrl;
    await expect(hreflangEs).toHaveAttribute('href', esUrl);

    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Service"');
  });
});