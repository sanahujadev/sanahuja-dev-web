import * as CookieConsentAPI from "vanilla-cookieconsent";
import type { CookieConsentType } from "../../i18n/utils";

// Tipado para extender window
declare global {
  interface Window {
    gtag: (type: string, action: string, payload: object) => void;
    CookieConsent: typeof CookieConsentAPI; 
  }
}

export interface ConsentConfig {
  lang: string;
  translations: CookieConsentType;
}

export class ConsentManager {
  private config: ConsentConfig;
  private lastConsentState: string = '';

  constructor(configData: ConsentConfig) {
    if (!configData?.lang || !configData?.translations) {
      throw new Error("[ConsentManager] Invalid configuration");
    }
    this.config = configData;
  }

  /**
   * Lee la cookie existente y actualiza GTM inmediatamente
   */
  public syncExistingConsent(): void {
    try {
      // vanilla-cookieconsent v3 usa 'cc_cookie' por defecto
      const cookieValue = this.getCookie('cc_cookie');
      
      if (!cookieValue) return;
      
      const consentData = JSON.parse(cookieValue);
      
      if (consentData?.categories && Array.isArray(consentData.categories)) {
        console.log('[ConsentManager] Cookie existente detectada:', consentData.categories);

        // Si gtag no existe, esperar al evento gtm:loaded
        if (typeof window.gtag !== 'function') {
          console.debug('[ConsentManager] gtag no disponible, esperando gtm:loaded...');
          
          window.addEventListener('gtm:loaded', () => {
            this.updateGTMConsent(consentData.categories);
          }, { once: true });
          
          return;
        }

        this.updateGTMConsent(consentData.categories);
      }
    
    } catch (error) {
      console.error('[ConsentManager] Error leyendo cookie existente:', error);
    }
  }

  public init(): void {
    // Exponer globalmente para debugging y para que funcionen los métodos in-line si los hubiera
    window.CookieConsent = CookieConsentAPI;

    // Sincronizar consentimiento previo
    this.syncExistingConsent();

    // Evitar reinicialización si el modal ya existe en el DOM
    if (document.querySelector("#cc-main")) {
      console.debug('[ConsentManager] Banner ya existente en el DOM');
      return;
    }

    // Inicializar librería usando el módulo importado
    CookieConsentAPI.run({
      autoClearCookies: true,
      manageScriptTags: true,
      
      // Forzar tema oscuro/claro según preferencia del sistema o clases
      // (Se maneja mejor vía CSS global, pero aquí definimos estructura)
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom right",
          equalWeightButtons: false,
          flipButtons: false
        },
        preferencesModal: {
          layout: "box",
          equalWeightButtons: false,
          flipButtons: false
        },
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [
              {
                name: /^(_ga|_gid|_gat)/, // Regex para borrar cookies de Google Analytics
              },
            ],
          },
        },
      },

      // Callback para cuando cambian las preferencias
      onChange: ({ cookie }) => {
        this.updateGTMConsent(cookie.categories);
      },
      
      // Callback para la primera vez que se da consentimiento
      onFirstConsent: ({ cookie }) => {
         this.updateGTMConsent(cookie.categories);
      },

      language: {
        default: this.config.lang,
        autoDetect: "document",
        translations: {
          [this.config.lang]: this.config.translations,
        },
      },
    });
    
    console.log('[ConsentManager] Inicializado correctamente via NPM');
  }

  private updateGTMConsent(categories: string[]): void {
    if (typeof window.gtag !== "function") {
      console.warn('[ConsentManager] gtag no disponible (todavía)');
      return;
    }

    // Deduplicación
    const currentState = JSON.stringify(categories.sort());
    if (currentState === this.lastConsentState) {
      console.debug('[ConsentManager] Consent sin cambios, omitiendo update');
      return;
    }
    this.lastConsentState = currentState;

    const consentUpdate = {
      analytics_storage: categories.includes("analytics") ? "granted" : "denied",
      ad_storage: "denied", // No usamos ads
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: categories.includes("analytics") ? "granted" : "denied", // Vinculado a analytics por practicidad
      security_storage: "granted",
    };

    try {
      window.gtag("consent", "update", consentUpdate);
      console.log("[ConsentManager] GTM updated:", consentUpdate);
    } catch (error) {
      console.error("[ConsentManager] Error updating GTM:", error);
    }
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    
    return null;
  }

  public showSettings(): void {
    CookieConsentAPI.showPreferences();
  }
}
