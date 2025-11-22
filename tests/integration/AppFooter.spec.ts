import { test, expect } from '@playwright/test';
// ¡Importamos el JSON NUEVO!
import t from '../../src/i18n/es/componentes/footer.json' assert { type: 'json' };

test.describe('Fase 4 (VERIFICACIÓN): Test de Integración para AppFooter', () => {
  
  const lang = 'es'; // ¡Estamos testeando 'es'!
  const currentYear = new Date().getFullYear();

  test('El footer debe renderizar el copy "Finalista" de Burro y Brook', async ({ page }) => {
    // 1. NAVEGACIÓN:
    await page.goto(`/${lang}/servicios/diseno-web-tenerife`);

    // 2. LOCALIZACIÓN:
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // 3. ASERCIONES (¡LAS BUENAS!):
    
    // A. Brand y Copyright
    await expect(footer.getByText(t.brand.tagline)).toBeVisible();
    // ¡El test que SÍ entiende el new Date()!
    await expect(footer.getByText(`${t.copyright} ${currentYear}`)).toBeVisible();

    // B. Navegación (¡Probamos el título y el primer link CON la URL bilingüe!)
    await expect(footer.getByText(t.navegacion.titulo)).toBeVisible();
    const navLink = footer.getByRole('link', { name: t.navegacion.links.mantenimiento });
    await expect(navLink).toHaveAttribute('href', `/${lang}/servicios/mantenimiento-web`);

    // C. Social (¡Probamos GitHub con su URL real!)
    await expect(footer.getByText(t.social.titulo)).toBeVisible();
    const socialLink = footer.getByRole('link', { name: t.social.links.github });
    await expect(socialLink).toHaveAttribute('href', t.social.links.github_url);

    // D. Legal (¡Probamos "Cookies" con su URL bilingüe!)
    const legalLink = footer.getByRole('link', { name: t.legal.cookies });
    await expect(legalLink).toHaveAttribute('href', `/${lang}/politica-de-cookies`);

    // E. CTA "Help" (¡Probamos el link bilingüe!)
    await expect(footer.getByText(t.help.text)).toBeVisible();
    const helpLink = footer.getByRole('link', { name: t.help.contact });
    await expect(helpLink).toHaveAttribute('href', `/${lang}/contacto/`);
    
    // F. Botón de Cookies
    await expect(footer.getByRole('button', { name: t.cookieSettings })).toBeVisible();
  });
});