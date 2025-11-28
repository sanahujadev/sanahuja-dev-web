// src/scripts/gtag-stub.ts

declare global {
  interface Window {
    __GTM_ID__?: string;
    __GTM_LOADED__?: boolean;
    __GTM_INITIALIZED__?: boolean;
    __CONSENT_DEFAULT_SET__?: boolean;
    dataLayer: any[];
    gtag: (type: string, action: string, payload: object) => void;
  }
}

function initGTM() {
  if (window.__GTM_INITIALIZED__) {
    console.debug('[GTM] Already initialized, skipping');
    return;
  }
  // 1️⃣ Validar que tenemos el ID
  const GTM_ID = window.__GTM_ID__;
  if (!GTM_ID) {
    console.warn('[GTM] No GTM_ID found');
    return;
  }

  // 2️⃣ Inicializar dataLayer (idempotente)
  window.dataLayer = window.dataLayer || [];

  // 3️⃣ Crear gtag stub si no existe
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  // 🔥 CRITICAL: Solo setear consent default UNA VEZ
  if (!window.__CONSENT_DEFAULT_SET__) {
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 500,
    });
    
    window.__CONSENT_DEFAULT_SET__ = true;  // ← Nuevo flag
    console.log('[GTM] Consent default configured: Denied by default');
  }

  window.__GTM_INITIALIZED__ = true;

  // 5️⃣ Cargar GTM script (solo una vez)
  if (!window.__GTM_LOADED__) {
    // Push del evento de inicio (parte del snippet oficial)
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    // Crear e inyectar el script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    script.async = true;
    
    script.onload = () => {
      window.__GTM_LOADED__ = true;
      console.log('[GTM] Script loaded');
      // 🔥 NUEVO: Disparar evento custom para que ConsentManager sepa que GTM está listo
      window.dispatchEvent(new CustomEvent('gtm:loaded'));
    };

    script.onerror = () => {
      console.error('[GTM] Failed to load script');
    };

    // Insertar antes del primer script (patrón GTM oficial)
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  }
}

// 🚀 Estrategia de Ejecución Multi-Modo
// Para carga inicial
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGTM);
} else {
  initGTM();
}

// Para navegaciones SPA de Astro
document.addEventListener('astro:page-load', initGTM);

export {};