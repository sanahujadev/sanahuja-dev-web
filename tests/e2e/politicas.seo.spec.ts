// tests/e2e/politicas.seo.spec.ts
// ¡ESTAS DOS PÁGINAS SON TU SEGURO DE VIDA ANTE EL RGPD!
import { test, expect } from '@playwright/test';
import privacidad from '../../src/i18n/es/legal/politica-privacidad.json' assert { type: 'json' };
import cookies from '../../src/i18n/es/legal/politica-cookies.json' assert { type: 'json' };

test.describe('E2E/SEO: Legales - Políticas (Privacidad + Cookies) (ES)', () => {
  
  test('Política de Privacidad: cumple RGPD, noindex, datos del formulario', async ({ page }) => {
    await page.goto('/es/politica-de-privacidad', { waitUntil: 'networkidle' });
    
    // 📍 METADATA
    await expect(page).toHaveTitle(privacidad.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', privacidad.metadata.description);
    
    // 🤖 ROBOTS META (¡NOINDEX OBLIGATORIO!)
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, follow');
    
    // 🛡️ CUMPLIMIENTO RGPD
    await expect(page.locator('main')).toContainText(privacidad.copy.hero.title);
    await expect(page.locator('main')).toContainText('Responsable del Tratamiento');
    await expect(page.locator('main')).toContainText('José Javier Sanahuja Ortiz');
    await expect(page.locator('main')).toContainText('NIF: 45981719G');
    
    // 📊 DATOS DEL FORMULARIO (¡EL OBJETO DE CONVERSIÓN!)
    await expect(page.locator('main')).toContainText('Formulario de Contacto');
    await expect(page.locator('main')).toContainText('Evaluación Técnica');
    
    // ✉️ TERCEROS (STRIPE, GA4)
    await expect(page.locator('main')).toContainText('Stripe');
    await expect(page.locator('main')).toContainText('Google Analytics');
    
    // ⚖️ TUS DERECHOS
    await expect(page.locator('main')).toContainText('derecho al olvido');
    await expect(page.locator('main')).toContainText('AEPD');
  });

  test('Política de Cookies: explica Consent Mode v2, noindex, UX clara', async ({ page }) => {
    await page.goto('/es/politica-de-cookies', { waitUntil: 'networkidle' });
    
    // 📍 METADATA
    await expect(page).toHaveTitle(cookies.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', cookies.metadata.description);
    
    // 🤖 ROBOTS META (¡NOINDEX!)
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, follow');
    
    // 🎯 INTRO CLARA (NO LEGALÉS)
    await expect(page.locator('main')).toContainText(cookies.copy.intro);
    await expect(page.locator('main')).toContainText('No te espiamos');
    
    // 🍪 COOKIES TÉCNICAS Y ANALÍTICAS
    await expect(page.locator('main')).toContainText('Cookies Técnicas');
    await expect(page.locator('main')).toContainText('Google Analytics 4');
    
    // 🔥 CONSENT MODE V2 (¡CRÍTICO PARA ADS!)
    await expect(page.locator('main')).toContainText('Consent Mode v2');
    await expect(page.locator('main')).toContainText('no se instalarán hasta que nos des permiso');
    
    // 🔗 INTERLINKING LEGAL
    const linkToPrivacidad = page.locator('a[href*="/es/politica-de-privacidad"]');
    await expect(linkToPrivacidad).toBeVisible();
  });

  test('Ambas páginas deben estar en el footer', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'networkidle' });
    
    const footerPrivacidad = page.locator('footer a[href*="/es/politica-de-privacidad"]');
    const footerCookies = page.locator('footer a[href*="/es/politica-de-cookies"]');
    
    await expect(footerPrivacidad).toBeVisible();
    await expect(footerCookies).toBeVisible();
    await expect(footerPrivacidad).toHaveAttribute('target', '_self');
    await expect(footerCookies).toHaveAttribute('target', '_self');
  });
});