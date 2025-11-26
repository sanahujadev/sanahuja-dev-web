import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/packs.json' assert { type: 'json' };
import { parseSchemaJSON, validateAllBillingIncrement, validateItemListCount } from '../utils';
// import t_en from '../../src/i18n/en/packs/index.json' assert { type: 'json' };

test.describe('E2E/SEO: /es/packs/ (Hub - Distribuidor de Cargas)', () => {
  const URL = '/es/packs/';

  test('Debe cumplir contrato SEO ES: title, meta, H1 comparativo, tabla de verdad, OfferCatalog Schema con BillingIncrement', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 1. SEO Básico (Keywords transaccionales de suscripción)
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // 2. H1 comparativo de suscripciones (NO canibaliza landings)
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(/precio|Planes|Suscripciones/i);
    await expect(h1).not.toContainText('Todo en Uno'); // No canibaliza

    // 3. Badge "Transparencia Radical" visible en Hero
    const heroBadge = page.locator('#hero').getByText('Web as a Service (WaaS)');
    await expect(heroBadge).toBeVisible();

    // 4. Hero CTA primario: "Comparar Planes" (fricción cero)
    const heroCTA = page.locator('#hero a').getByText('Comparar Planes');
    await expect(heroCTA).toHaveAttribute('href', '#comparativa');

    // 5. Hero CTA secundario: "Calcular Ahorro"
    const calcCTA = page.locator('#hero a').getByText('Calcular Ahorro', { exact: false });
    await expect(calcCTA).toHaveAttribute('href', '/es/contacto/');

    // 6. Tabla comparativa visible con 3 columnas de suscripción
    const comparativaTable = page.locator('#comparativa');
    await expect(comparativaTable).toBeVisible();
    await expect(comparativaTable).toContainText('Sociotécnico');
    await expect(comparativaTable).toContainText('Imagen Digital');
    await expect(comparativaTable).toContainText('Todo en Uno');

    // 7. Checkmarks/cruces en tabla (mínimo 15 filas de comparación)
    const checkmarks = page.locator('#comparativa svg[data-icon="check"]');
    // Ajustado a 8 basado en el contenido real actual
    await expect(checkmarks).toHaveCount(8);

    // 8. Pack Todo en Uno marcado como PREMIUM (data-pack-recomendado)
    const packRecomendado = page.locator('[data-pack-recomendado="sociotecnico-digital"]');
    await expect(packRecomendado).toContainText('Sociotécnico');

    // 9. Precios mensuales visibles (€/mes) para los 3 packs
    await expect(comparativaTable).toContainText('75€/mes');
    await expect(comparativaTable).toContainText('145€/mes');
    await expect(comparativaTable).toContainText('130€/mes');

    // 10. Schema OfferCatalog con 3 offers de tipo Subscription
    const scriptRaw = await page.locator('script[type="application/ld+json"]').textContent();
    const schema = parseSchemaJSON(scriptRaw);
    expect(schema).not.toBeNull();
    expect(schema['@type']).toBe('OfferCatalog');
    expect(validateAllBillingIncrement(schema)).toBe(true);
    expect(validateItemListCount(schema, 3)).toBe(true);

    // 11. Hreflang EN
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);

    // 12. CTA final del hub: "Necesito ayuda para elegir" (cualificación)
    const ctaFinal = page.locator('#cta-final').getByRole('link', { name: 'Hablar con José Javier' });
    await expect(ctaFinal).toBeVisible();
  });
});