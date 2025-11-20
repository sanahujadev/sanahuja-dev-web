# ADR-001: Estrategia de entrega de CSS y optimización de fuentes

## Estado
**Aceptado** - 20 de Noviembre, 2025

## Contexto

Sanahuja.dev es una landing page de servicios web con funnel de conversión cuyo objetivo es captar leads. La propuesta de valor comercial incluye "webs rápidas con 99 WPO", por lo que el rendimiento de primera carga es crítico para la credibilidad y conversión.

### Situación inicial
- **Performance score:** 96/100
- **Render blocking CSS:** 310ms (18.8KB de Tailwind compilado)
- **Fuentes:** 5 pesos de Montserrat descargados de Google Fonts Helper con todos los character sets (~630KB total)
- **Score objetivo:** 99-100/100 consistente en todas las páginas

### Opciones evaluadas

Se evaluaron dos estrategias principales:

1. **CSS inline en HTML**
2. **CSS externo con link stylesheet (status quo optimizado)**

## Decisión

**Utilizamos CSS externo con optimizaciones** y **fuentes self-hosted optimizadas solo para latin**.

## Fundamentos

### 1. Análisis comparativo: CSS Inline vs Externo

#### CSS Inline
**Implementado y medido:**
```
- HTML size: 32.68KB (6.73KB → 32.68KB, +385%)
- Network chain latency: 56ms (mejora de 31ms)
- Performance score: 95-99% (inconsistente)
- CLS (Cumulative Layout Shift): 0.119 ❌
- Páginas afectadas: 2 de N con score 95%
```

**Ventajas teóricas:**
- Elimina un round-trip de red
- Reduce latencia de critical path
- CSS disponible inmediatamente

**Desventajas observadas:**
- Layout shift crítico (CLS 0.119) causado por retraso en parsing del HTML pesado
- Inconsistencia en scores (95-99% vs 99% consistente)
- Duplicación de 18.8KB CSS en cada página HTML
- Pérdida total de cacheo entre navegaciones
- HTML 5x más pesado ralentiza parsing inicial

#### CSS Externo (Decisión elegida)
**Medido en producción:**
```
- HTML size: 6.73KB
- CSS size: 18.8KB (cacheado tras primera carga)
- Network chain latency: 87ms
- Performance score: 99% consistente en todas las páginas ✅
- CLS: 0 ✅
- Render blocking: 310ms (mitigable con preload)
```

**Ventajas:**
- Score 99% consistente en todas las páginas
- CLS = 0 (sin layout shifts)
- Cacheo efectivo: segunda y tercera página del funnel cargan CSS desde cache (0ms)
- Separación de responsabilidades (HTML/CSS)
- HTML ligero permite parsing rápido
- Descarga paralela CSS/JS en HTTP/2

**Desventajas:**
- Requiere un request adicional en primera carga
- 310ms de tiempo de descarga + parsing (primera visita únicamente)

### 2. Optimización de fuentes

#### Antes
```
5 archivos × ~126KB = ~630KB total
- montserrat-latin-400.woff2: 126KB (todos los character sets)
- montserrat-latin-500.woff2: 127KB
- montserrat-latin-600.woff2: 128KB
- montserrat-latin-700.woff2: 130KB
- montserrat-latin-800.woff2: 130KB

Impact: Performance score degradado a 80
```

#### Después (Decisión implementada)
```
2 archivos × ~22KB = ~44KB total (93% reducción)
- montserrat-v31-latin-regular.woff2: ~21KB (solo latin)
- montserrat-v31-latin-700.woff2: ~22KB (solo latin)

Impact: Performance score 99%
```

**Rationale:**
- Solo character set latin necesario (español + inglés)
- Solo 2 pesos usados: 400 (body text) y 700 (títulos/CTAs)
- Self-hosted elimina latencia de DNS lookup a Google Fonts (~50-100ms)
- Preload permite carga anticipada

### 3. Análisis de navegación en funnel

En un flujo típico de conversión:

```
Usuario → Landing (/) → Servicios (/servicios) → Contacto (/contacto)
```

#### Con CSS Inline:
```
Página 1: 32KB HTML (incluye CSS)
Página 2: 32KB HTML (CSS duplicado)
Página 3: 32KB HTML (CSS duplicado)
Total transferido: 96KB CSS en 3 páginas
```

#### Con CSS Externo (elegido):
```
Página 1: 6KB HTML + 18KB CSS (primera carga)
Página 2: 6KB HTML + 0KB CSS (cached)
Página 3: 6KB HTML + 0KB CSS (cached)
Total transferido: 18KB CSS + 18KB HTML = 36KB (62% menos)
```

**En funnel de 3-5 páginas, CSS externo es 60% más eficiente.**

### 4. Core Web Vitals Impact

| Métrica | CSS Inline | CSS Externo | Ganador |
|---------|-----------|-------------|---------|
| FCP | ~180ms | ~200ms | Empate técnico |
| LCP | ~400ms | ~420ms | Empate técnico |
| **CLS** | **0.119** ❌ | **0** ✅ | **Externo** |
| TBT | 38ms | 45ms | Inline |
| Performance Score | 95-99% | 99% | **Externo** |
| Consistencia | Variable | Constante | **Externo** |

**CLS es métrica crítica:** Un CLS de 0.119 es "Needs Improvement" según Google y afecta directamente SEO y UX.

## Consecuencias

### Positivas
- ✅ Performance score 99% consistente en todas las páginas
- ✅ CLS = 0 (experiencia visual estable)
- ✅ Cacheo efectivo reduce transferencia en 62% para usuarios que navegan múltiples páginas
- ✅ Fuentes optimizadas reducen payload en 93% (630KB → 44KB)
- ✅ Arquitectura limpia y mantenible
- ✅ Credibilidad: demostramos "webs rápidas" con nuestro propio sitio

### Negativas
- ⚠️ 310ms de render blocking en primera carga (mitigable con preload)
- ⚠️ Dependencia de cacheo del navegador para máximo rendimiento

### Mitigaciones implementadas
- Preload de fuentes críticas con `crossorigin`
- `font-display: swap` para evitar FOIT
- Posibilidad futura de preload del CSS (pending hash dinámico)

## Implementación

### Estructura de archivos
```
/public/fonts/
  ├── montserrat-v31-latin-regular.woff2  (~21KB)
  └── montserrat-v31-latin-700.woff2      (~22KB)

/src/styles/
  └── global.css  (Tailwind compilation target)

/src/layouts/
  └── BaseLayout.astro  (font preload + CSS link)
```

### BaseLayout.astro (fragmento)
```astro
<head>
  <!-- Fuentes optimizadas -->
  <link 
    rel="preload" 
    href="/fonts/montserrat-v31-latin-regular.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  />
  <link 
    rel="preload" 
    href="/fonts/montserrat-v31-latin-700.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  />
  
  <!-- CSS externo (Tailwind compilado) -->
  <link rel="stylesheet" href={Astro.glob('/_astro/*.css')[0]?.url} />
  
  <!-- View Transitions optimizado -->
  <ViewTransitions fallback="none" />
</head>
```

### global.css (fragmento)
```css
/* montserrat-regular - latin */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/montserrat-v31-latin-regular.woff2') format('woff2');
}

/* montserrat-700 - latin */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/montserrat-v31-latin-700.woff2') format('woff2');
}

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Alternativas consideradas

### 1. Critical CSS híbrido
**Descripción:** Inline de ~2-3KB CSS crítico + async load del resto

**Pros:**
- Mejor FCP (~150ms)
- Mantiene cacheo del CSS no-crítico

**Contras:**
- Complejidad de extracción de critical CSS
- Riesgo de FOUC (Flash of Unstyled Content)
- Mayor superficie de mantenimiento

**Razón de descarte:** Complejidad no justificada para delta de 20-30ms en FCP. 99% ya conseguido con solución más simple.

### 2. Google Fonts CDN optimizado
**Descripción:** Usar Google Fonts con preconnect y `&display=swap`

**Pros:**
- Cero mantenimiento
- CDN global de Google

**Contras:**
- Latencia DNS + TLS (~50-100ms)
- Sin control sobre optimizaciones
- Score máximo: 96-98 (no 99+)

**Razón de descarte:** Self-hosting optimizado demostró 99% vs 96% con Google CDN.

### 3. Subsetting extremo de fuentes
**Descripción:** Usar glyphhanger para reducir fonts a ~15KB cada una

**Pros:**
- Fonts aún más ligeras (~30KB total vs 44KB)

**Contras:**
- Complejidad de build pipeline
- Riesgo de missing glyphs para contenido dinámico
- Ganancia marginal (14KB) no justifica complejidad

**Razón de descarte:** 44KB de fuentes es aceptable. Optimization is premature en este caso.

## Métricas de éxito

### Antes de optimización
- Performance: 80-96/100
- Fuentes: 630KB
- CSS: Render blocking 310ms
- CLS: Variable

### Después de optimización (actual)
- **Performance: 99/100 consistente** ✅
- **Fuentes: 44KB (93% reducción)** ✅
- **CSS: Externo cacheado** ✅
- **CLS: 0** ✅

### KPIs de negocio esperados
- Bounce rate: Reducción esperada del 5-10%
- Time to interaction: < 500ms
- Conversión en formulario contacto: Baseline establecido para A/B testing
- Credibilidad de propuesta "webs rápidas": Demostrada con propio sitio

## Revisión

Esta decisión debe revisarse si:
- El número de páginas del sitio supera 100 (considerar critical CSS híbrido)
- Aparecen nuevas páginas con CLS > 0.1 (investigar causas)
- Performance score cae por debajo de 98 en auditorías regulares
- Nuevas tecnologías de entrega CSS emergen (ej: CSS Layers, Container Queries)
- HTTP/3 adoption hace que inline CSS vuelva a ser competitivo

**Próxima revisión programada:** Q2 2026 o cuando se alcancen 50 páginas publicadas.

## Referencias

- [Unlighthouse audit results](localhost) - 20 Nov 2025
- [Google Webfonts Helper](https://gwfh.mranftl.com/fonts/montserrat)
- [Web Vitals - CLS](https://web.dev/cls/)
- [Tailwind CSS Performance](https://tailwindcss.com/docs/optimizing-for-production)
- Conversación de arquitectura: 20 Nov 2025

## Notas adicionales

### Lecciones aprendidas
1. **Medir antes de optimizar:** CSS inline parecía mejor en teoría pero causó regresión de CLS en práctica
2. **Self-hosting != automático win:** Fonts de 126KB auto-hosted son peores que Google Fonts. Optimization matters.
3. **Consistencia > micro-optimización:** 99% consistente > 100% en una página y 95% en otras
4. **Cacheo en funnel es crítico:** En sitios multi-página con navegación, cacheo supera inline

### Comandos útiles para desarrollo

```bash
# Verificar tamaño de fonts
ls -lh public/fonts/

# Build y preview para testing
npm run build && npm run preview

# Audit con Unlighthouse
npx unlighthouse --site http://localhost:4321

# Verificar CSS generado
ls -lh dist/_astro/*.css
```

---

**Aprobado por:** Equipo de desarrollo Sanahuja.dev  
**Fecha de implementación:** 20 de Noviembre, 2025  
**Última actualización:** 20 de Noviembre, 2025