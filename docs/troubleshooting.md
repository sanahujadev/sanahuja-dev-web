# Resolución de Error: `intl-tel-input` y `Ambiguous URL` en LightningCSS

## Contexto

Al integrar la librería `intl-tel-input` (versión 25.x.x) en un proyecto Astro/Vite que utiliza LightningCSS para procesar estilos, se encontró un error durante la fase de build (o desarrollo) relacionado con la resolución de rutas de imágenes en el CSS de la librería.

## Error Reportado

El siguiente error aparecía en la consola de la terminal durante la ejecución de `pnpm dev` o `pnpm build`:

```
[ERROR] [lightningcss] Ambiguous url('../img/flags.webp') in custom property. Relative paths are resolved from the location the var() is used, not where the custom property is defined. Use an absolute URL instead
  Location:
    /home/zitrojj/dev/sanahuja-dev-web/node_modules/.pnpm/intl-tel-input @25.12.5/node_modules/intl-tel-input/build/css/intlTelInput.css:16:23
```

## Causa

El archivo CSS de `intl-tel-input` (específicamente `intlTelInput.css`) define variables CSS como `--iti-path-flags-1x` que utilizan rutas relativas (`../img/flags.webp`) para las imágenes de las banderas. LightningCSS (el procesador de CSS de Vite en este proyecto) interpreta estas rutas relativas de manera ambigua cuando el archivo CSS se importa directamente desde `node_modules` y se procesa en el contexto de la aplicación principal. No puede determinar de forma segura la base de la ruta para las imágenes.

## Solución

La solución implicó tomar control de los assets y las rutas de CSS para evitar la ambigüedad en el procesador:

1.  **Copia de Assets a `public/`:**
    *   Se copiaron todas las imágenes de banderas (`flags.webp`, `flags@2x.webp`, `globe.webp`, `globe@2x.webp`) desde `node_modules/intl-tel-input/build/img/` a la carpeta `public/flags/` del proyecto. Esto las hace accesibles directamente como `/flags/imagen.webp`.

2.  **Creación de CSS Local:**
    *   Se copió el contenido del archivo CSS original de la librería (`node_modules/intl-tel-input/build/css/intlTelInput.css`) a un nuevo archivo local: `src/styles/intl-tel-input.css`.

3.  **Modificación de Rutas en el CSS Local:**
    *   Dentro de `src/styles/intl-tel-input.css`, se modificaron las definiciones de las variables CSS (`--iti-path-flags-1x`, `--iti-path-flags-2x`, `--iti-path-globe-1x`, `--iti-path-globe-2x`) para que apunten a las nuevas rutas absolutas de las imágenes en la carpeta `public/flags/`.
        ```css
        :root {
          /* ... otras variables ... */
          --iti-path-flags-1x: url("/flags/flags.webp");
          --iti-path-flags-2x: url("/flags/flags@2x.webp");
          --iti-path-globe-1x: url("/flags/globe.webp");
          --iti-path-globe-2x: url("/flags/globe@2x.webp");
          /* ... otras variables ... */
        }
        ```

4.  **Actualización de Importación en Astro:**
    *   En `src/components/pages/LandingContacto.astro`, se cambió la importación del CSS para que apuntara al archivo local (`import "../../styles/intl-tel-input.css";`) en lugar del import directo desde `node_modules`.

Esta estrategia asegura que LightningCSS reciba rutas de imagen inequívocas, resolviendo el error y permitiendo que la librería funcione correctamente con los assets visuales.
