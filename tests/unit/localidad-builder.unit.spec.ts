// tests/unit/localidad-builder.unit.spec.ts

import { describe, it, expect } from 'vitest';
import { construirPlantillaDeCiudad, buildCiudad } from '../../src/scripts/utils';
import type { PlantillaCiudad, LocalidadDB } from '../../src/i18n/utils';

// --- Mocks de Datos Reales ---

// 1. Mock de la estructura de Localidad (Adeje)
const MOCK_LOCALIDAD_ADEJE: LocalidadDB = {
    "slug": "adeje",
    "name": "Adeje",
    "zip": "38670",
    "municipality": "Adeje",
    "painPointId": "P2",
    "type": "Ciudad/Núcleo",
    "seoData": {
      "zone": "Sur Turístico",
      "h1_modifier": "para Superar la Saturación Competitiva",
      "usp_focus": "En un mercado saturado de oferta turística, tu web debe cargar al instante en móviles y convertir visitas en reservas. Diseñamos para la alta competencia.",
      "h2_solution": "Diseño Web Premium para el Sector Turístico",
      "cta_text": "Maximizar mis Reservas en Adeje"
    },
    "seoDataEn": {
      "zone": "Touristic South",
      "h1_modifier": "to Outperform Tourist Competition",
      "usp_focus": "In a saturated tourist market, your website must load instantly on mobile and turn visitors into bookings. We design for high-competition zones.",
      "h2_solution": "Premium Web Design for the Tourism Sector",
      "cta_text": "Maximize my Bookings in Adeje"
    }
};

// 2. Mock de la Plantilla Maestra (Solo un fragmento clave)
const MOCK_TEMPLATE_ES: PlantillaCiudad = {
    "metadata": {
      "title": "Diseño Web en {{name}} | Tu Socio Digital en {{municipality}} ({{zip}})",
      "description": "Agencia de Diseño Web en {{name}} ({{zip}}). {{seoData.usp_focus}} Especialistas en WPO y SEO Local.",
      "robots": "index, follow"
    },
    "schema": {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "SanahujaDev - Diseño Web en {{name}}",
      "description": "{{seoData.usp_focus}}",
      "url": "https://sanahuja.dev/es/diseno-web-en/{{slug}}",
      "areaServed": {
        "@type": "City",
        "name": "{{name}}",
        "postalCode": "{{zip}}"
      },
      "priceRange": "$$"
    },
    "copy": {
      "hero": {
        "badge": "Servicio Local en {{name}}",
        "h1_part1": "Diseño Web en {{name}}",
        "h1_part2": "{{seoData.h1_modifier}}",
        "h1_lead": "Olvídate de agencias lejanas que no entienden tu mercado. Soy José Javier, tu consultor tecnológico en <strong>{{municipality}}</strong>. Ayudo a negocios de la zona {{zip}} a vender más.",
        "ctas": {
          "primary": {
            "text": "{{seoData.cta_text}}",
            "url": "/es/contacto?location={{slug}}"
          },
          "secondary": {
            "text": "Ver Casos de Éxito",
            "url": "/es/sobre-mi"
          }
        },
        "heroVisual": {
          "title": "Digitalización en {{name}}",
          "subtitle": "Crecimiento Local",
          "stats": [
            {
              "label": "Zona",
              "value": "{{seoData.zone}}"
            },
            {
              "label": "Código Postal",
              "value": "{{zip}}"
            },
            {
              "label": "Enfoque",
              "value": "SEO Local"
            }
          ]
        }
      },
      "sections": {
        "painPoint": {
          "badge": "La Realidad Local",
          "title": "¿Por qué tu negocio en {{name}} no despega?",
          "content": "{{seoData.usp_focus}}",
          "quote": "En {{name}}, la competencia digital es real. Una web genérica ya no sirve para destacar en {{seoData.zone}}.",
          "author": "José Javier Sanahuja"
        },
        "solution": {
          "badge": "La Estrategia",
          "title": "{{seoData.h2_solution}}",
          "content": "No usamos plantillas baratas. Diseñamos una herramienta de ventas a medida para el mercado de {{name}}.",
          "features": [
            {
              "title": "SEO Local para {{name}}",
              "description": "Optimizamos tu ficha para que salgas primero cuando busquen servicios en el código postal {{zip}}.",
              "icon": "MapPin"
            },
            {
              "title": "Velocidad Extrema (WPO)",
              "description": "Tu web cargará al instante, vital para las conexiones móviles en la zona de {{seoData.zone}}.",
              "icon": "Zap"
            },
            {
              "title": "Trato Directo",
              "description": "Sin intermediarios. Habla con el desarrollador que entiende las necesidades de {{municipality}}.",
              "icon": "UserCheck"
            }
          ]
        },
        "ctaFinal": {
          "title": "¿Listo para liderar en {{name}}?",
          "content": "Lleva tu negocio de {{name}} al siguiente nivel. Deja de perder clientes frente a tu competencia local.",
          "cta": "{{seoData.cta_text}}",
          "url": "/es/contacto?location={{slug}}",
          "cta2": "Quiero más información",
          "url2": "/es/servicios/diseno-web-tenerife"
        }
      }
    }
};

// tests/unit/localidad-builder.unit.spec.ts (Continuación)

describe('buildCiudad (Unit)', () => {
    it('Debe reestructurar los datos para el idioma español (es)', () => {
        // En español, seoData debe ser el objeto 'seoData' del mock
        const ciudadES = buildCiudad(MOCK_LOCALIDAD_ADEJE, 'es');
        // El test fallará si:
        // 1. Todavía existe la propiedad 'seoDataEn'
        // 2. La propiedad 'seoData' no contiene los datos en ES
        expect(ciudadES).not.toHaveProperty('seoDataEn');
        expect(ciudadES.seoData.h1_modifier).toBe(MOCK_LOCALIDAD_ADEJE.seoData.h1_modifier);
    });

    it('Debe reestructurar los datos para el idioma inglés (en)', () => {
        // En inglés, seoData debe ser el objeto 'seoDataEn' del mock
        const ciudadEN = buildCiudad(MOCK_LOCALIDAD_ADEJE, 'en');
        // El test fallará si:
        // 1. Todavía existe la propiedad 'seoDataEn'
        // 2. La propiedad 'seoData' no contiene los datos en EN
        expect(ciudadEN).not.toHaveProperty('seoDataEn');
        expect(ciudadEN.seoData.h1_modifier).toBe(MOCK_LOCALIDAD_ADEJE.seoDataEn.h1_modifier);
    });
});

describe('construirPlantillaDeCiudad (Unit)', () => {
    const ciudadES = buildCiudad(MOCK_LOCALIDAD_ADEJE, 'es');

    it('Debe sustituir TODAS las variables del template y devolver un JSON válido', () => {
        const result = construirPlantillaDeCiudad(MOCK_TEMPLATE_ES, ciudadES);

        // Test 1: Comprobar que el JSON final es válido y parseable (implícito por el retorno)
        expect(typeof result).toBe('object');
        expect(Array.isArray(result)).toBe(false);

        // Test 2: Comprobar la sustitución de variables genéricas (slug, name, zip)
        expect(result.metadata.title).toContain('Adeje');
        expect(result.metadata.title).toContain('38670');
        
        // Test 3: Comprobar la sustitución de variables SEO (h1_modifier, usp_focus)
        // El test fallará si alguna variable queda como '{{variable}}'
        expect(result.copy.hero.h1_part2).toBe(ciudadES.seoData.h1_modifier);
        expect(result.copy.sections.painPoint.content).toBe(ciudadES.seoData.usp_focus);
    });

    it('Debe lanzar un error si la plantilla JSON es inválida (ej. sintaxis rota después de la sustitución)', () => {
        // Mockear una plantilla rota
        const MOCK_LOCALIDAD_ADEJE_CORRUPTA: Omit<LocalidadDB, 'seoDataEn'> = {
            ...ciudadES,
            seoData: {
                ...ciudadES.seoData,
                usp_focus: 'Diseñamos para la alta competencia. \"Una ubicación \'ilegal\'',
            },
        };

        // Para romperlo, necesitamos que el campo roto contenga el placeholder.
        const BROKEN_TEMPLATE_WITH_PLACEHOLDER: any = {
             metadata: {
                title: 'Diseño Web en {{name}}',
                description: 'La descripción es válida',
            },
            broken_raw_value: "{{seoData.usp_focus}}" 
        };

        // El test fallará si NO se lanza un error.
        expect(() => {
            const result = construirPlantillaDeCiudad(BROKEN_TEMPLATE_WITH_PLACEHOLDER, MOCK_LOCALIDAD_ADEJE_CORRUPTA);
            console.log(result, "debugging");
        }).toThrow(
            /Error al construir la ciudad Adeje/
        );
    });
});