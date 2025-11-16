// src/tests/integration/AppHeader.spec.ts
import { test, expect } from '@playwright/test';
import t from '../../src/i18n/es/componentes/header.json' assert { type: 'json' };

test.describe('Fase 1 (ROJO): Test de Integración para AppHeader', () => {
  
  test('El header debe renderizar todos los elementos funcionales y de navegación', async ({ page }) => {
    // 1. NAVEGACIÓN:
    // Vamos a una página cualquiera que sepamos que usa el BaseLayout,
    // ya que el AppHeader es parte de él.
    await page.goto('/es/servicios/diseno-web-tenerife');
    
    // 2. LOCALIZACIÓN:
    // Acotamos la búsqueda al elemento <header> para más precisión y robustez.
    const header = page.locator('header');

    // 3. ASERCIONES (VERIFICACIÓN):
    
    // A. Links de Navegación Principales
    await expect(header.getByRole('link', { name: t.nav.home, exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: t.nav.about, exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: t.nav.packs, exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: t.nav.blog, exact: true })).toBeVisible();

    // B. Link "Gancho" con su Badge específico
    const ganchoLink = header.getByRole('link', { name: new RegExp(t.nav.gancho.label) });
    await expect(ganchoLink).toBeVisible();
    await expect(ganchoLink.getByText(t.nav.gancho.badge)).toBeVisible();

    // C. Botón de Call to Action (CTA)
    const ctaButton = header.getByRole('link', { name: t.cta.getStarted });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', '/es/formulario-inicial/');

    // D. Controles de Accesibilidad (ARIA)
    await expect(header.getByLabel(t.aria.logo, { exact: true })).toBeVisible();
    await expect(header.getByLabel(t.aria.menuToggle, { exact: true })).toBeHidden();

    // E. Link de cambio de idioma
    const langSwitchLink = header.getByRole('link', { name: t.nav.language.label });
    await expect(langSwitchLink).toBeVisible();
    // Verificamos que el link apunte a la versión en inglés de la home.
    await expect(langSwitchLink).toHaveAttribute('href', '/en/services/web-design-tenerife');
  });
});
