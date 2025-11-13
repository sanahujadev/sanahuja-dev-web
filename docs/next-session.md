# `docs/next-session.md`: Próximos Pasos

## 🎯 Misión Actual

Estamos en plena **Fase 3 (COMPOSICIÓN)** del ciclo TDD-VFD para la página "Punta de Lanza": `/es/servicios/diseno-web-tenerife`.

La Fase VERDE (funcional) está completada, pero estamos **bloqueados** en la fase de estilos de BrandStyler (Brook).

## 🛑 Bloqueo Crítico: Configuración de Tailwind

* **Problema:** Los estilos de Tailwind CSS (como `p-4`, `rounded-lg`) se están aplicando correctamente, pero los **colores personalizados** (ej. `bg-neutral-800`, `text-primary-600`) no funcionan.
* **Hipótesis:** El archivo `tailwind.config.mjs` está incompleto. Es probable que la sección `theme.extend.colors` no esté bien definida o no esté siendo leída por el motor de Tailwind.

## ✅ Checklist Siguiente Sesión

1.  **[Brook]  investigar `tailwind.config.mjs`:**
    * [ ] Revisar la documentación oficial de Astro + Tailwind.
    * [ ] Asegurarse de que `tailwind.config.mjs` esté siendo importado correctamente en `astro.config.mjs`.
    * [ ] Validar que la paleta de colores (`#FF6F00`, etc.) esté definida bajo `theme: { extend: { colors: { ... } } }`.
    * [ ] Purgar cualquier caché (`rm -rf node_modules/.vite/`) después de arreglar la config.

2.  **[Brook] Terminar Fase 3 (COMPOSICIÓN):**
    * [ ] Una vez arreglada la config, aplicar los estilos de Brook a `diseno-web-tenerife.astro`.
    * [ ] Obtener la aprobación visual del Director (SanahujaDev).

3.  **[Deadpool] Iniciar Fase 4 (VERIFICACIÓN):**
    * [ ] Cuando Brook dé luz verde, ejecutar los tests de Accesibilidad (`pnpm run test:a11y`).
    * [ ] Ejecutar el Refactor Lógico (conectar `BaseLayout.astro` y añadir `hreflang`).

4.  **[Deadpool] Cerrar Página:**
    * [ ] Conseguir el **VERDE COMPLETO** (E2E + A11y) y marcar el `TODO.md` como ✅.