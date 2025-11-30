# `docs/TODO.md`: La Lista Maestra (v2 - ACTUALIZADO)

### Blog: Plantilla de Post `/blog/[...slug]` [cite: 711]
- [ ] 🔴 **ROJO**: Test E2E que `/es/blog/por-que-mi-web-es-lenta` [cite: 788] renderiza el contenido del Markdown.
- [ ] 🟢 **VERDE**: Crear `src/pages/es/blog/[...slug].astro` que renderiza el `entry.body`.
- [ ] 🎼 **COMPOSICIÓN**: Estilizar la plantilla de post (tipografía, legibilidad, ancho de texto)[cite: 88, 923]. *¡Ciclo de Feedback del Director!*
- [ ] 🔵 **VERIFICACIÓN**: Test A11y (contraste, legibilidad).
- [ ] ✅ **CERRADO**

### Analytics: Configuración de Conversiones (GA4 + GTM)
- [ ] 🔴 **ROJO**: Test en GTM Preview mode: Verificar que al cargar `/es/gracias-proyecto` el contenedor GTM se dispara y el `dataLayer` está activo.
- [ ] 🟢 **VERDE**: GTM > Variables: Crear Variable de URL (`url_query_lead_id`).
    - *Tipo:* URL.
    - *Tipo de componente:* Consulta.
    - *Clave de consulta:* `LEAD_ID`.
- [ ] 🟢 **VERDE**: GTM > Activadores (Trigger): Crear "Lead - Success Page (No Bots)".
    - *Tipo:* Vista de una página.
    - *Condiciones:*
        1. `Page Path` coincide con la expresión regular `/(es/gracias-proyecto|en/thank-you-project)`
        2. `url_query_lead_id` **no contiene** `482` (El filtro anti-bot).
        3. `url_query_lead_id` **no es igual a** `undefined` (Evita visitas directas sin envío).
- [ ] 🟢 **VERDE**: GTM > Etiquetas (Tags): Crear etiqueta "GA4 - Event - Generate Lead".
    - *Configuración:* Google Analytics: Evento de GA4.
    - *ID de medición:* Tu ID `G-XXXXXXXX`.
    - *Nombre del evento:* `generate_lead`.
    - *Parámetros:* Añadir `lead_id` -> `{{url_query_lead_id}}` (para cruzar datos con AWS SES si hace falta).
    - *Activador:* Asignar el trigger creado en el paso anterior.
- [ ] 🎼 **COMPOSICIÓN**: GA4 > Admin > Visualización de datos > Eventos.
    - Esperar (o forzar) a que llegue el primer evento `generate_lead`.
    - Marcar el interruptor **"Marcar como conversión"** a ON.
- [ ] 🔵 **VERIFICACIÓN**: Prueba de fuego (DebugView).
    - Caso A (Humano): Ir a `/es/gracias-proyecto?LEAD_ID=aws-message-id-largo-y-valido`. -> **Debe disparar** el tag.
    - Caso B (Bot): Ir a `/es/gracias-proyecto?LEAD_ID=482`. -> **NO debe disparar** el tag.
- [ ] ✅ **CERRADO**

***

### 💡 Nota técnica para el paso "VERDE (Activadores)"
Como vas a usar RegEx para detectar los dos idiomas de golpe, asegúrate de marcar la casilla **"Coincide con la expresión regular"** (matches RegEx) en la condición del Page Path.

La RegEx `/(es/gracias-proyecto|en/thank-you-project)` cubrirá ambas URLs en una sola regla.

---

Si te detienes ahora, caerás en dos trampas clásicas de GA4 por defecto:
1.  **Amnesia de datos:** GA4 borra los datos de usuario a los 2 meses por defecto.
2.  **Ceguera de origen:** Si no vinculas las herramientas, no sabrás si ese lead vino por una búsqueda de "WPO" o "Diseño web".
3.  **Contaminación:** Tus propias pruebas contarán como conversiones si no te filtras a ti mismo.

Para cerrar el círculo y tener una analítica "Pro", añade esta **Fase de Calibración** a tu lista.

---

### Analytics: Fase 2 - Calibración y Gobernanza de Datos
- [ ] ⚠️ **CRÍTICO**: GA4 > Admin > Recogida y modificación de datos > Retención de datos.
    - Cambiar de **"2 meses"** a **"14 meses"**.
    - *Por qué:* Si no haces esto, en un año no podrás comparar "Enero 2025 vs Enero 2026".
- [ ] 🔗 **CONEXIÓN**: GA4 > Admin > Vinculaciones con otros productos > **Search Console**.
    - Vincular tu propiedad de GSC.
    - *Beneficio:* Podrás ver en GA4 qué *queries* orgánicas traen usuarios que *luego* convierten.
- [ ] 🛡️ **FILTRO IP**: GA4 > Admin > Recogida de datos > Filtros de datos.
    - Definir tu IP interna (casa/oficina) como "Internal Traffic".
    - Activar el filtro para que tus pruebas de formularios no inflen las estadísticas.
- [ ] 🧪 **REFERRAL EXCLUSION**: GA4 > Admin > Flujos de datos > Configurar ajustes de etiquetas > **Crear lista de referencias no deseadas**.
    - Añadir `sanahuja.dev` (tu propio dominio).
    - Añadir pasarelas de pago si las tuvieras (Stripe, PayPal) para que no rompan la sesión.
    - *En tu caso:* Probablemente solo necesites asegurarte de que `sanahuja.dev` no cuente como referencia si hay redirecciones raras.

***

### 💡 Un matiz sobre tu "Verdad Absoluta"

Tienes una ventaja enorme: tu **`LEAD_ID`**.

Como usas AWS SES y generas ese ID en el servidor, **tu base de datos (o logs de AWS) es la verdad absoluta**.
GA4 siempre tendrá una discrepancia del 10-20% (gente con AdBlock muy agresivo, navegadores privados, Brave, etc.).

**El flujo mental correcto es:**
1.  **AWS/Email:** "He recibido 10 leads reales este mes". (Dato financiero).
2.  **GA4:** "De esos 10, GA4 capturó 8. De esos 8, veo que 5 vinieron por SEO y 3 por Directo". (Dato de tendencia/marketing).

**Conclusión:**
Implementa la **Retención de 14 meses** HOY mismo (es retroactivo solo desde el momento en que lo activas). Lo demás puedes hacerlo la semana que viene, pero la retención es urgente.
