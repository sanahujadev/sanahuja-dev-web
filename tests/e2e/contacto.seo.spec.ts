// tests/e2e/contacto.seo.spec.ts
// ¡ESTE TEST VA A FALLAR PORQUE EL FORMULARIO NO EXISTE AÚN!
import { test, expect } from '@playwright/test';
import t from '../../src/i18n/es/contacto.json' assert { type: 'json' };

test.describe('E2E/SEO: Contacto (ES)', () => {
  const URL = '/es/contacto';

  test('Debe cumplir contrato SEO completo: title, meta, H1, formulario, schema', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // 📍 METADATA HEAD
    await expect(page).toHaveTitle(t.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t.metadata.description);

    // 🏴‍☠️ H1 HERO
    await expect(page.locator('main section#hero h1')).toHaveCount(1);
    const h1Text = await page.locator('main section#hero h1').innerText();
    expect(h1Text).toContain(t.copy.hero.h1);

    // 🎯 SUBTITULO E INTRO
    await expect(page.locator('#hero')).toContainText(t.copy.hero.subtitle);
    await expect(page.locator('#hero')).toContainText(t.copy.hero.intro);

    // 🧩 FORMULARIO PROGRESIVO (3 PASOS)
    await expect(page.locator('#contact-form')).toBeVisible();

    // Paso 1: Datos de Contacto
    await expect(page.locator('#step_1_identity')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message_basic"]')).toBeVisible();

    // Paso 2: Tipo de Proyecto (cards)
    await expect(page.locator('#step_2_scope')).toBeVisible();
    await expect(page.locator('input[name="project_type"]')).toHaveCount(4); // 4 opciones
    await expect(page.locator('input[name="tech_status"]')).toHaveCount(4); // 4 pills

    // Paso 3: Viabilidad
    await expect(page.locator('#step_3_viability')).toBeVisible();
    // await expect(page.locator('input[name="goal"]')).toBeVisible();
    // await expect(page.locator('select[name="timeline"]')).toBeVisible();
    // await expect(page.locator('select[name="budget_range"]')).toBeVisible();

    // 🧘‍♂️ ANSIOLÍTICO (Reducción de Miedo)
    await expect(page.locator('#contact-form')).toContainText('Sin compromiso');
    await expect(page.locator('#contact-form')).toContainText('No te preocupes, esto no es un examen');
    await expect(page.locator('#contact-form')).toContainText(t.copy.formUI.ansiolitico.text);

    // 🔑 SEO KEY PHRASE
    await expect(page.locator('#contact-form')).toContainText(t.copy.formUI.config.seoKeyPhrase);

    // 🔗 PRIVACIDAD LINK
    const privacyLink = page.getByRole('link', { name: t.copy.formUI.ansiolitico.privacyButton }); // Selector robusto por accesibilidad
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveAttribute('target', '_self');

    // 🌐 HREFLANG A INGLÉS
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/contact/);

    // 📊 SCHEMA.ORG (ContactPage)
    const schemaScript = page.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    const schemaContent = await schemaScript.textContent();
    const schema = JSON.parse(schemaContent || '{}');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('ContactPage');
    expect(schema.contactType).toBe('Sales');
  });

  test('Debe tener solo un H1 (SEO Canonical)', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    const h1Count = await page.locator('main h1').count();
    expect(h1Count).toBe(1);
  });


  test('Formulario debe redirigir a /es/gracias-proyecto tras envío exitoso', async ({ page }) => {
    // 🛡️ MOCK TURNSTILE: Inyectamos un script antes de cargar la página
    // Esto simula que Cloudflare ya cargó y resuelve el captcha automáticamente.
    await page.addInitScript(() => {
        (window as any).turnstile = {
            render: (selector: string, options: any) => {
                console.log('Mock Turnstile rendered on', selector);
                // Simulamos éxito inmediato llamando al callback con un token falso
                if (options.callback) {
                    setTimeout(() => options.callback('mock-token-for-testing'), 100);
                }
                return 'mock-widget-id';
            }
        };
    });

    // 🛡️ MOCK API: Interceptamos el envío del formulario
    await page.route('**/forms', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ messageId: 'test-lead-123' })
        });
    });

    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Espera a que el JS del formulario se haya inicializado para prevenir race conditions.
    await expect(page.locator('#contact-form')).toHaveAttribute('data-form-initialized', 'true', {timeout: 15000});

    // Llena el formulario mínimo
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message_basic"]', 'This is a test message');

    // Marca el consentimiento obligatorio (Nuevo requisito)
    await page.check('input[name="consent"]');

    // Esperamos un momento para asegurar que el mock de Turnstile haya disparado el callback
    // (Aunque el setTimeout de 100ms es rápido, el ciclo de eventos puede variar)
    await page.waitForTimeout(500);

    // Envía
    await page.click('button[type="submit"]');

    // Espera redirección (AJAX + window.location)
    await page.waitForURL(/\/es\/gracias-proyecto/);
    await expect(page).toHaveURL(/\/es\/gracias-proyecto/);
  });
});
