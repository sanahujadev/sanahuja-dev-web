import { ConsentManager } from "./ConsentManager";
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import '../../styles/global.css'; // Asegurar estilos globales

// Tipado para la config global
declare global {
  interface Window {
    __CONSENT_CONFIG__?: {
        lang: string;
        translations: any;
    };
    __consentManagerInstance?: ConsentManager;
  }
}

function init() {
    // Recuperar configuración inyectada desde Astro
    const config = window.__CONSENT_CONFIG__;
    
    if (!config) {
        console.error('[CookieConsentInit] No configuration found in window.__CONSENT_CONFIG__');
        return;
    }

    if (window.__consentManagerInstance) {
        // Si ya existe (SPA nav), solo resincronizar
        window.__consentManagerInstance.syncExistingConsent();
        return;
    }

    try {
        const manager = new ConsentManager(config);
        manager.init();
        window.__consentManagerInstance = manager;
    } catch (e) {
        console.error('[CookieConsentInit] Failed to initialize:', e);
    }
}

// Ejecución:
// 1. Intentar inicializar inmediatamente (por si el script carga defer pero el DOM ya está listo)
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

// 2. View Transitions de Astro
document.addEventListener('astro:page-load', init);

// 3. Escuchar evento GTM por si acaso (aunque init maneja la espera internamente)
window.addEventListener('gtm:loaded', () => {
    // Si por alguna razón no se ha inicializado (ej: config tardía), reintentar
    if (!window.__consentManagerInstance) init();
});
