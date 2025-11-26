import { test, expect } from '@playwright/test';
import t_es from '../../src/i18n/es/pack/todo-en-uno.json' assert { type: 'json' };
// import t_en from '../../src/i18n/en/pack/all-in-one.json' assert { type: 'json' };

test.describe('E2E/SEO: /es/packs/todo-en-uno (Jefe Delegador - Premium)', () => {
  const URL = '/es/packs/todo-en-uno';

  test('Debe cumplir contrato SEO ES: title, meta, H1 B2B, delegación total, Product Schema con isRelatedTo', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // 1. SEO Básico (Keywords de partner tecnológico)
    await expect(page).toHaveTitle(t_es.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t_es.metadata.description);

    // 2. H1 de delegación total (B2B, alto ticket)
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(/Todo en Uno|Delegación Total|Partner Tecnológico/i);

    // 3. Badge "Paz Mental" visible (premium) - Actualizado a copy real
    const heroBadge = page.locator('#hero').getByText('Control Técnico Total');
    await expect(heroBadge).toBeVisible();

    // 4. Hero CTA primario: "Delegar mi Web" (acción de CEO) - Actualizado a copy real
    const heroCTA = page.locator('#hero a').getByText('Asegurar mi Infraestructura');
    await expect(heroCTA).toBeVisible();
    await expect(heroCTA).toHaveAttribute('href', '/es/contacto');

    // 5. Hero CTA secundario: "Ver flujo de trabajo"
    const workflowCTA = page.locator('#hero a').getByText('Ver desglose');
    await expect(workflowCTA).toHaveAttribute('href', '#todo-list');

    // 6. Incluye TODO: Analítica + Reputación + Mantenimiento + Contenido
    // El ID de la sección donde se muestran las "features" ahora es #todo-list
    const todoList = page.locator('#todo-list');
    await expect(todoList).toBeVisible();
    await expect(todoList).toContainText('Mantenimiento Premium'); // Técnica
    await expect(todoList).toContainText('Inteligencia de Datos'); // Datos
    await expect(todoList).toContainText('Cumplimiento Legal'); // Legal
    // Los textos han cambiado un poco, ajusto las expectativas
    await expect(todoList).toContainText('Monitorización 24/7, WPO 90+ y Copias de Seguridad.'); 
    await expect(todoList).toContainText('Informe mensual de Visibilidad (GA4) explicado en humano.'); 
    await expect(todoList).toContainText('Gestión e implementación del Banner de Cookies (Consent Mode).'); 
    await expect(todoList).toContainText('Prioridad en soporte técnico ante cualquier incidencia.');
    const fragmentacion = page.locator('#fragmentacion');
    await expect(fragmentacion).toBeVisible();
    await expect(fragmentacion).toContainText('Tener una web sin mantenimiento es un riesgo');
    await expect(fragmentacion).toContainText('Desconocimiento total de las visitas');

    // 8. Precio 130€/mes visible y destacado como "inversión"
    const pricing = page.locator('#pricing');
    await expect(pricing).toBeVisible();
    await expect(pricing).toContainText('75€/mes');
    await expect(pricing).toContainText('en una sola factura');

    // 9. Schema Product con price 130€, isRelatedTo y billingIncrement
    const scriptContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(scriptContent).toContain('"@type":"Product"');
    expect(scriptContent).toMatch(/"price":\s*"75(\.00)?"/);
    expect(scriptContent).toContain('"billingIncrement":"monthly"');
    expect(scriptContent).toContain('"isRelatedTo"'); // Refuerza que agrupa otros servicios

    // 10. Hreflang EN
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveAttribute('href', 'https://sanahuja.dev' + t_es.alternateUrl);

    // 11. CTA final: "Ser mi socio tecnológico" (acción de alto nivel)
    const ctaFinal = page.locator('#cta-final').getByText('Ser mi socio tecnológico');
    await expect(ctaFinal).toBeVisible({ timeout: 10000 });
  });
});