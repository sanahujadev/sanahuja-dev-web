// tests/e2e/contacto.seo.spec.ts
// ¡ESTE TEST VA A FALLAR PORQUE EL FORMULARIO NO EXISTE AÚN!
import { test, expect } from '@playwright/test';
import t from '../../src/i18n/es/contacto.json' assert { type: 'json' };

test.describe('E2E/SEO: Contacto (ES)', () => {
  const URL = '/es/contacto';

  test('Debe cumplir contrato SEO completo: title, meta, H1, formulario, schema', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    
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
    await expect(page.locator('input[name="goal"]')).toBeVisible();
    await expect(page.locator('select[name="timeline"]')).toBeVisible();
    await expect(page.locator('select[name="budget_range"]')).toBeVisible();
    
    // 🧘‍♂️ ANSIOLÍTICO (Reducción de Miedo)
    await expect(page.locator('#contact-form')).toContainText('Sin compromiso');
    await expect(page.locator('#contact-form')).toContainText('No te preocupes, esto no es un examen');
    await expect(page.locator('#contact-form')).toContainText(t.copy.formUI.ansiolitico.text);
    
    // 🔗 PRIVACIDAD LINK
    const privacyLink = page.locator('a[href*="/es/politica-de-privacidad"]');
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
    await page.goto(URL, { waitUntil: 'networkidle' });
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('Formulario debe redirigir a /es/gracias-proyecto tras envío exitoso', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    
    // Llena el formulario mínimo
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message_basic"]', 'This is a test message');
    
    // Envía
    await page.click('button[type="submit"]');
    
    // Espera redirección (AJAX + window.location)
    await page.waitForURL('/es/gracias-proyecto');
    await expect(page).toHaveURL('/es/gracias-proyecto');
  });
});
