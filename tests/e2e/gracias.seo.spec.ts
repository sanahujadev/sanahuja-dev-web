// tests/e2e/gracias.seo.spec.ts
// ¡ESTA PÁGINA ES TU META, PERO NO DEBE INDEXARSE!
import { test, expect } from '@playwright/test';
import t from '../../src/i18n/es/gracias-proyecto.json' assert { type: 'json' };

test.describe('E2E/SEO: Gracias Proyecto (ES)', () => {
  const URL = '/es/gracias-proyecto';

  test('Debe cumplir contrato SEO: title, meta, H1, NOINDEX, CTA loop', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    
    // 📍 METADATA HEAD
    await expect(page).toHaveTitle(t.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t.metadata.description);
    
    // 🤖 ROBOTS META (¡NOINDEX NOFOLLOW OBLIGATORIO!)
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
    
    // 🏴‍☠️ H1 HERO
    await expect(page.locator('main section#hero h1')).toHaveCount(1);
    const h1Text = await page.locator('main section#hero h1').innerText();
    expect(h1Text).toContain(t.copy.hero.title);
    
    // 🎯 BADGE Y REFERENCIA
    await expect(page.locator('#hero')).toContainText(t.copy.hero.badge);
    await expect(page.locator('#hero')).toContainText('Referencia: #LEAD_ID');
    
    // 💬 MENSAJE DE CONFIRMACIÓN
    await expect(page.locator('#hero')).toContainText('Tus datos han llegado a mi sistema de forma segura');
    await expect(page.locator('#hero')).toContainText('José Javier');
    
    // ⏱️ TIMELINE (3 pasos)
    await expect(page.locator('#timeline')).toBeVisible();
    await expect(page.locator('#timeline h2')).toContainText('Próximos Pasos');
    await expect(page.locator('#timeline article')).toHaveCount(3);
    
    // 🔄 LOOP DE FIDELIZACIÓN
    await expect(page.locator('#loop')).toBeVisible();
    await expect(page.locator('#loop')).toContainText('¿Quién va a leer tu mensaje?');
    
    // 🧑‍💻 CTA A SOBRE-MÍ (¡LOOP!)
    const ctaSobreMi = page.locator('#loop a[href="/es/sobre-mi"]');
    await expect(ctaSobreMi).toBeVisible();
    await expect(ctaSobreMi).toHaveAttribute('target', '_self');
    
    // ⚖️ LEGAL NOTICE
    await expect(page.locator('#legal')).toContainText('Tus datos son confidenciales');
    await expect(page.locator('#legal')).toContainText('Política de Privacidad');
    
    // 🌐 SI HREFLANG (esta página si tiene versión EN)
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveCount(1); // ¡NO HAY VERSIÓN EN!
  });

  test('Debe tener solo un H1 (SEO Canonical)', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    const h1Count = await page.locator('main h1').count();
    expect(h1Count).toBe(1);
  });

  test('No debe estar enlazada en navegación (solo acceso por redirección)', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'networkidle' });
    
    // Verifica que NO hay link en el menú principal
    const navLink = page.locator('nav a[href*="/es/gracias-proyecto"]');
    await expect(navLink).toHaveCount(0);
    
    // Verifica que NO hay link en el footer
    const footerLink = page.locator('footer a[href*="/es/gracias-proyecto"]');
    await expect(footerLink).toHaveCount(0);
  });
});
