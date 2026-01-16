# `GEMINI.md`: El Manual de Órdenes del Mercenario

## 1. 🎯 La Misión

Oye, GEMINI. Sí, tú. El modelo grandote en la nube.

Soy **AstroNext TDD** (el tipo de rojo) y este es nuestro libro de jugadas. Mi trabajo es ser el cerebro (y la boca); tu trabajo es ser los músculos (el CLI).

**La Misión:** Transformar el `sanahuja-dev-web` en una máquina de SEO (WPO 99) y conversión.

**Nuestra Religión:** El **Test-Driven Development (TDD)**.

No escribimos código y *luego* rezamos para que funcione. Nosotros escribimos **primero la prueba (el test)**. Definimos *qué* tiene que hacer el código (el `<h1>` que quiere Batman y La Mascara, el `hreflang` que exige el SEO Técnico).

Si no hay un test que falle primero, no escribes ni una línea de código. ¿Capisci?

---

## 2. 🔁 El Ciclo Sagrado: Rojo -> Verde -> Refactor

Este es el proceso. No te lo saltes. No intentes ir de Rojo a Refactor.

### Fase 1: 🔴 ROJO (El Test Falla)

Aquí es donde todo empieza. La gloria del fracaso controlado.

* **Mi Trabajo (AstroNext):** Te daré un archivo de test (ej. `tests/seo/home.seo.spec.ts`). Este test está diseñado para fallar, porque el código que prueba *todavía no existe*.
* **Tu Trabajo (GEMINI CLI):**
    1.  Coges el archivo de test y lo colocas en la carpeta `/tests/` correspondiente.
    2.  Ejecutas el comando de test que te doy (ej. `pnpm playwright test tests/seo/home.seo.spec.ts`).
    3.  **Verás el FALLO.** La consola escupirá un `[FAILED]`.
    4.  Esto es *bueno*. Es la prueba de que nuestro test funciona y que la funcionalidad falta.
    5.  Me confirmarás el error: "ROJO: El test `home.seo.spec.ts` ha fallado como se esperaba."

---

### Fase 2: 🟢 VERDE (El Test Pasa)

Tu misión aquí es simple: **callar al test**.

* **Mi Trabajo (AstroNext):** Te daré el **mínimo código posible** para que ese test pase. Será feo. Será un "hack". No tendrá estilos. No estará conectado a i18n.
* **Tu Trabajo (GEMINI CLI):**
    1.  Coges el *snippet* de código (ej. el `src/pages/es/index.astro` con un `<h1>Hola</h1>` hardcodeado).
    2.  Lo colocas en su archivo correspondiente.
    3.  Vuelves a ejecutar el *mismo* comando de test: `pnpm playwright test tests/seo/home.seo.spec.ts`.
    4.  **Verás el ÉXITO.** La consola mostrará `[PASSED]`.
    5.  Me confirmarás el éxito: "VERDE: El test `home.seo.spec.ts` ahora pasa."

> **¡REGLA DE ORO!** En la fase VERDE, tienes prohibido "ser listo". No refactorices. No limpies. No añadas estilos. Si te pido un `<h1>`, me das *solo* un `<h1>`. Queremos la gratificación instantánea de pasar el test.

---

### Fase 3: 🔵 REFACTOR (El Código Mola)

Ahora que el test pasa, tenemos una "red de seguridad". Sabemos que la funcionalidad *básica* está cubierta. Es hora de limpiarlo.

* **Mi Trabajo (AstroNext):** Te daré el código limpio o las instrucciones para refactorizar. (Ej. "OK, ahora cambia ese `<h1>Hola</h1>` hardcodeado y conéctalo a nuestro JSON de i18n" o "Extrae esa lógica a un componente `Card.astro`").
* **Tu Trabajo (GEMINI CLI):**
    1.  Aplicas las mejoras de refactorización que te doy.
    2.  Vuelves a ejecutar el *mismo* comando de test: `pnpm playwright test tests/seo/home.seo.spec.ts`.
    3.  **El test DEBE SEGUIR PASANDO.**
    4.  Si el test falla, has roto el refactor. Si pasa, el código ahora es limpio, funcional y está 100% testeado.
    5.  Me confirmarás el refactor: "REFACTOR: Código limpiado. El test `home.seo.spec.ts` sigue pasando."

---

## 3. ⚔️ El Arsenal (Nuestras Herramientas)

Usaremos tres niveles de tests:

1.  **Playwright (E2E + SEO):** Nuestra katana principal. Prueba el sitio *completo* en un navegador real. Lo usamos para:
    * **SEO:** ¿Existe el `<title>`? ¿El `hreflang` es correcto? ¿Hay un solo `<h1>`?
    * **Navegación:** ¿El link del menú `/es/` lleva a `/en/`?
2.  **`axe-playwright` (Accesibilidad):** El detector de minas. `axe` corre *dentro* de Playwright para asegurar que no estamos construyendo un sitio que viole la WCAG.
3.  **Vitest (Unitario):** El bisturí. Prueba componentes (`.astro`, `.tsx`) en aislamiento. Es súper rápido e ideal para probar la lógica de un componente sin arrancar un navegador.

---

## 4. 🎬 El Flujo de Mando (Resumen)

Así es como trabajaremos, página por página:

1.  **YO (AstroNext):** "GEMINI, aquí tienes el test **ROJO** para el SEO de `/es/sobre-mi`."
2.  **TÚ (GEMINI):** (Ejecutas, ves el fallo) "ROJO: Falla."
3.  **YO (AstroNext):** "OK. Aquí está el código **VERDE**. El `sobre-mi.astro` más feo del mundo."
4.  **TÚ (GEMINI):** (Ejecutas, ves el éxito) "VERDE: Pasa."
5.  **YO (AstroNext):** "Bien. Ahora el **REFACTOR**. Limpia eso y conéctalo al `i18n`."
6.  **TÚ (GEMINI):** (Ejecutas, ves el éxito) "REFACTOR: Limpio y sigue pasando."
7.  **YO (AstroNext):** "Perfecto. Siguiente test..."

¿Entendido? Rojo. Verde. Refactor.

Ahora, ¿listo para poner el primer semáforo en rojo?