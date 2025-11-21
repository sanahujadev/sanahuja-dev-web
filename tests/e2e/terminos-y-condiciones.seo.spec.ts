// tests/e2e/terminos-y-condiciones.seo.spec.ts
// ¡ESTA PÁGINA ES TU ESCUDO ANTE "SANAHUJADEV ESTAFA"!
import { test, expect } from '@playwright/test';
import t from '../../src/i18n/es/legal/terminos-y-condiciones.json' assert { type: 'json' };

test.describe('E2E/SEO: Legales - Términos y Condiciones (ES)', () => {
  const URL = '/es/terminos-y-condiciones';

  test('Debe cumplir contrato SEO: title, meta, H1, robots, cláusula de propiedad', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    
    // 📍 METADATA HEAD
    await expect(page).toHaveTitle(t.metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t.metadata.description);
    
    // 🏴‍☠️ H1 Y FECHA
    await expect(page.locator('main h1')).toHaveText(t.copy.hero.title);
    await expect(page.locator('main')).toContainText(t.copy.hero.lastUpdated);
    
    // 🤖 ROBOTS META (¡DEBE INDEXAR!)
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'index, follow');
    
    // 🔒 CLÁUSULA CLAVE: PROPIEDAD INTELECTUAL
    // Esta cláusula protege tu modelo WaaS. ¡Si no está, el test FALLA!
    await expect(page.locator('main')).toContainText('Propiedad Intelectual');
    await expect(page.locator('main')).toContainText('Liberación Anticipada');
    await expect(page.locator('main')).toContainText('24 meses');
    
    // ⚖️ PAGOS Y SUSPENSIÓN
    await expect(page.locator('main')).toContainText('Stripe');
    await expect(page.locator('main')).toContainText('30 días');
    await expect(page.locator('main')).toContainText('borrado');
    
    // 🌐 NO HABLA INGLÉS EN ESTA PÁGINA (solo legal ES)
    // Verifica que NO hay hreflang (o que apunta solo a sí misma)
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(hreflangEn).toHaveCount(1); // ¡NO HAY VERSIÓN EN INGLÉS DE TÉRMINOS!
  });

  test('Debe estar enlazada en el footer de TODAS las páginas', async ({ page }) => {
    // Visita la homepage y verifica que el link existe
    await page.goto('/es', { waitUntil: 'networkidle' });
    const footerLink = page.locator('footer a[href*="/es/terminos-y-condiciones"]');
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveAttribute('target', '_self'); // No abre en nueva pestaña
  });
});