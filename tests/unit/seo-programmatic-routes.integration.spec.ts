// tests/integration/seo-programmatic-routes.integration.spec.ts

import { it, expect, describe } from 'vitest';
// Importar la función getStaticPaths directamente.
import { getProgrammaticStaticPaths } from '../../src/scripts/path-generator';
// Importar los datos reales para verificar la longitud.
import localidades from '../../src/i18n/auto/localidades.json' with { type: 'json' }; 

interface StaticPathItem {
    params: {
        localidad: string;
        autolang: string;
        designtext: string;
    };
    props: {
        localidad: any;
        alternatePath: any;
        lang: string;
    };
}

const LOCALIDADES_COUNT = localidades.length;
const EXPECTED_ROUTES_COUNT = LOCALIDADES_COUNT * 2; // Español y Inglés
describe('Integración: Generación de Rutas Programáticas', () => {
    
    // Este test fallará si el número de rutas generadas no es 44.
    it('Debe generar el número correcto de rutas (22 localidades x 2 idiomas)', async () => {
        const paths = await getProgrammaticStaticPaths(); // Call without arguments

        expect(paths).toHaveLength(EXPECTED_ROUTES_COUNT);
    });

    // Este test fallará si el slug de Adeje en español no es correcto.
    it('Debe generar la ruta correcta para "Adeje" en Español', async () => {
        const paths = await getProgrammaticStaticPaths(); // Call without arguments
        
        // Buscamos la ruta específica que debe existir
        const adejeES = paths.find((p: StaticPathItem) => 
            p.params.localidad === 'adeje' && 
            p.params.autolang === 'es'
        );

        // El test fallará si no encuentra la ruta (adejeES es undefined)
        expect(adejeES).toBeDefined();

        // El test fallará si el slug (designtext) o el parámetro de idioma es incorrecto.
        expect(adejeES.params.designtext).toBe('diseno-web-en');
        expect(adejeES.params.autolang).toBe('es');
    });

    // Este test fallará si los props no contienen la información de localidad y plantilla.
    it('La ruta debe pasar los props necesarios para la construcción de la página', async () => {
        const paths = await getProgrammaticStaticPaths(); // Call without arguments
        const adejeES = paths.find((p: StaticPathItem) => p.params.localidad === 'adeje' && p.params.autolang === 'es'); // Explicitly type p

        // El test fallará si no incluye los datos de la localidad y la plantilla JSON
        expect(adejeES.props.localidad).toBeDefined();
        expect(adejeES.props.localidad.name).toBe('Adeje');
        expect(adejeES.props.alternatePath).toBeDefined();
        expect(adejeES.props.lang).toBe('es');
    });
});