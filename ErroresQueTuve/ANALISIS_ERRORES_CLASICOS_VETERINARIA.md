# ANÁLISIS DE ERRORES CLÁSICOS EN DESARROLLO DE SOFTWARE
## Proyecto: Sistema de Gestión Veterinaria
**Basado en:** McConnell, S. (1997). Errores clásicos. En *Desarrollo y gestión de proyectos informáticos* (pp.35-58). McGraw Hill.

**Fecha de Análisis:** Diciembre 2025  
**Autor:** Análisis de Proyecto  
**Objetivo:** Identificar, documentar y aprender de los errores cometidos para evitarlos en futuros proyectos

---

## TABLA DE CONTENIDOS
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Errores Identificados por Categoría](#errores-identificados-por-categoría)
3. [Impacto Cuantitativo de los Errores](#impacto-cuantitativo)
4. [Análisis Detallado por Error](#análisis-detallado)
5. [Lecciones Aprendidas](#lecciones-aprendidas)
6. [Plan de Prevención](#plan-de-prevención)

---

## RESUMEN EJECUTIVO

El proyecto de Sistema de Gestión Veterinaria experimentó retrasos significativos y sobrecostos en tiempo y recursos. Mediante el análisis comparativo con el marco de **36 Errores Clásicos de McConnell**, se identificaron **15 errores** que impactaron negativamente el desarrollo.

### Principales Hallazgos:
- **Duración Real vs. Planificada:** +120% (sobrepasar estimación original)
- **Errores Críticos Identificados:** 5 (Personas, Proceso, Producto)
- **Errores Moderados Identificados:** 7 (Proceso y Tecnología)
- **Errores Leves Identificados:** 3 (Personas y Producto)

### Estadísticas del Proyecto:
```
┌─────────────────────────────────────────────┐
│  MÉTRICA                    PLAN    REAL    │
├─────────────────────────────────────────────┤
│  Duración (meses)            3      6.5     │
│  Personas-mes (esfuerzo)    12      27      │
│  Líneas de código           5K      8.5K    │
│  Defectos detectados       10      65       │
│  Módulos completados        5      5        │
│  Funcionalidades (RF)       20      20       │
│  Cambios de requerimientos   2      11       │
│  Retrasos acumulados (semanas) 0  14        │
└─────────────────────────────────────────────┘
```

---

## ERRORES IDENTIFICADOS POR CATEGORÍA

### 🔴 ERRORES RELACIONADOS CON PERSONAS (6 Errores)

#### **CRÍTICO #1: Planificación Excesivamente Optimista (Error #14)**
**Clasificación:** Proceso (impacta en personas)  
**Severidad:** CRÍTICA  
**Frecuencia:** Continua durante todo el proyecto

**Lo que pasó:**
- Estimación inicial: 3 meses para sistema completo
- Realidad: 6.5 meses (+ 117% de retraso)
- Causas raíz:
  - No se consideraron complejidades de integraciones (citas, facturación, inventario)
  - Subestimación de validaciones por usuario (cada funcionalidad requería 3-4 iteraciones)
  - No se incluyeron en la planificación: testing, documentación, capacitación
  - Presión inicial para presentar propuesta rápida

**Impacto:**
```
Semanas 1-3:   Plan inicial ✓
Semana 4:      Descubrimiento de requisitos faltantes (-2 semanas)
Semana 5-6:    Integración difícil entre módulos (-3 semanas)
Semana 7-8:    Testing encuentra 45 defectos (-4 semanas)
Semana 9+:     Correcciones iterativas (-2-3 semanas adicionales)
```

**Evidencia de McConnell:**
> "Fijar un plan excesivamente optimista predispone a que el proyecto falle por infravalorar el alcance del proyecto, minando la planificación efectiva, y reduciendo las actividades críticas para el desarrollo, como el análisis de requerimientos o el diseño."

**Cita del Proyecto:**
- *"¿3 meses? Sí, debería ser posible. Con Spring Boot y PostgreSQL, es básicamente un CRUD."*
- Realidad: Nunca es "solo un CRUD"

---

#### **CRÍTICO #2: Ilusiones (Error #13)**
**Clasificación:** Personas  
**Severidad:** CRÍTICA  
**Momento:** Semanas 1-3

**Lo que pasó:**
- Se asumió que "porque es similar a otro proyecto, será igual de rápido"
- Sin considerar: dominio diferente (veterinaria vs. farmacia), nuevas complejidades
- Ilusión: "Los desarrolladores de primerisima categoría pueden hacerlo en 2 meses"
- Realidad: Incluso expertos descubren nuevos requisitos conforme codifican

**Síntomas de Ilusión:**
```
ILUSIÓN 1: "La validación de citas es trivial"
├─ Realidad: Conflictos horarios, veterinarios múltiples, excepciones
├─ Tiempo estimado: 2 horas
└─ Tiempo real: 12 horas (+ reglas de negocio no documentadas)

ILUSIÓN 2: "La facturación es standar"
├─ Realidad: Servicios adicionales, descuentos por cantidad, impuestos
├─ Tiempo estimado: 1 día
└─ Tiempo real: 3-4 días (+ cambios de requisitos después)

ILUSIÓN 3: "El inventario funciona como esperado"
├─ Realidad: Stock por veterinario, medicamentos con vencimiento, alertas
├─ Tiempo estimado: 1 día
└─ Tiempo real: 2 días (cambios de especificación incluidos)
```

---

#### **MODERADO #3: Expectativas Poco Realistas (Error #8)**
**Clasificación:** Personas  
**Severidad:** MODERADA  
**Afectados:** Cliente (propietario clínica)

**Lo que pasó:**
- Cliente prometió: "Necesito el sistema en 3 meses para la auditoría de junio"
- Mike (desarrollador): Aceptó sin validación real
- Realidad: Sistema requería más tiempo para garantizar confiabilidad (datos de pacientes)

**Comunicación Fallida:**
```
Cliente:     "¿3 meses para todo?"
Dev:         "Sí, debería ser posible..."  ← ERROR: Aceptar sin analizar
Cliente:     "Perfecto, está garantizado"
Dev (interno): "Esto no va a funcionar..."  ← Duda tardía
```

**Consecuencia:**
- Presión constante durante semanas 4-6
- Toma de decisiones apresuradas (saltar validaciones)
- Moral del equipo afectada

---

#### **MODERADO #4: Motivación Débil (Error #1)**
**Clasificación:** Personas  
**Severidad:** MODERADA  
**Período:** Semanas 4-6 (pico de desmotivación)

**Lo que pasó:**
- Semanas 1-2: Ánimos altos ("esto será rápido")
- Semanas 3-4: Descubrimiento de complejidad ("espera, hay mucho más")
- Semanas 5-6: Desmotivación ("trabajamos 60 horas y aún no terminamos")
- Semanas 7+: Recuperación parcial (con mentalidad realista)

**Impacto en Productividad:**
```
SEMANA 1-2:  ████████ (100% motivado)
             Energía alta, código limpio, buena calidad

SEMANA 3-4:  ██████░░ (75% motivado)
             Descubrimiento de issues, moral baja
             Toma de decisiones apresuradas

SEMANA 5-6:  ████░░░░ (50% motivado)
             Horas extras, frustración
             Calidad del código decrece (atajos, "trucos")

SEMANA 7:    ████████ (90% motivado)
             Recuperación con expectativas realistas
             Mejor calidad, ritmo sostenible
```

**Citas del Proyecto:**
- Semana 2: *"Esto está en buen camino, vamos bien"*
- Semana 4: *"Hay más validaciones de las que pensaba"*
- Semana 5: *"¿Otra reunión? No me importa si no arreglamos la base de datos"*
- Semana 7: *"Al menos ahora sabemos qué hay que hacer"*

---

#### **LEVE #5: Personal Mediocre en Decisiones Críticas (Error #2)**
**Clasificación:** Personas  
**Severidad:** LEVE  
**Contexto:** Selección de tecnologías

**Lo que pasó:**
- No se consideró experiencia previa del equipo
- Se eligió Spring Boot simplemente porque "es moderno"
- Un miembro del equipo necesitó 1-2 semanas para curva de aprendizaje

**Impacto:**
- 1-2 semanas de investigación (horas no contabilizadas en plan inicial)
- Primeras versiones tenían patterns no óptimos (después requirieron refactoring)

---

#### **LEVE #6: Falta de Participación Temprana del Usuario (Error #11)**
**Clasificación:** Personas  
**Severidad:** LEVE  
**Período:** Semanas 1-3 (falta de validación inicial)

**Lo que pasó:**
- Diseño hecho SIN el veterinario
- Primera iteración mostrada en semana 4
- Cliente: *"No, la pantalla de citas debería mostrar esto en lugar de aquello"*
- Resultado: 2-3 días de refactoring

---

### 🟠 ERRORES RELACIONADOS CON EL PROCESO (7 Errores)

#### **CRÍTICO #7: Escatimar en Actividades Iniciales (Error #20)**
**Clasificación:** Proceso  
**Severidad:** CRÍTICA  
**Impacto Total:** +25% en duración

**Lo que pasó:**

**Fase de Análisis de Requerimientos - SALTADA:**
```
PLANIFICADO:
├─ Entrevistas con veterinario: 4 horas
├─ Documentación de flujos: 4 horas
├─ Casos de uso detallados: 4 horas
├─ Validación de requerimientos: 2 horas
└─ Total: 14 horas

REALIDAD:
├─ "¿Qué necesitas?" (informal)
├─ "Un sistema para citas y clientes" 
├─ "Ok, empezamos a codificar"
└─ Total: 1 hora ← ERROR

COSTO:
- Cambios de requisitos en semana 4: 3 horas
- Refactoring por requerimientos olvidados: 5 horas
- Testing por especificación incompleta: 4 horas
- TOTAL COSTO REAL: 12 horas (vs 14 planificadas, pero repartidas mal)
```

**Fase de Diseño - COMPRIMIDA:**
```
PLANIFICADO: 4 horas (diseño UML, diagramas ER)
REALIDAD: 1.5 horas (directamente en código)
CONSECUENCIA:
├─ Base de datos sin normalizacion adecuada
├─ Relaciones que requirieron ajustes después
└─ Migraciones de datos en semana 5 (+6 horas)
```

**Cita de McConnell que aplica:**
> "Los proyectos que normalmente escatiman en sus actividades iniciales tendrán que hacer ese trabajo en otro momento, con un costo de 10 a 100 veces superior a haberlo hecho bien inicialmente."

**Cálculo Real:**
- 14 horas bien hechas al inicio
- vs. 15 horas repartidas y caóticas durante todo el proyecto
- MÁS: Los problemas de diseño causaron 6 horas de refactoring

---

#### **CRÍTICO #8: Abandono de la Planificación Bajo Presión (Error #18)**
**Clasificación:** Proceso  
**Severidad:** CRÍTICA  
**Período:** Semanas 4-6

**Lo que pasó:**

**Semana 1-3: Plan Original**
```
├─ Backend módulo de Citas: 1 semana
├─ Backend módulo de Facturación: 1 semana
├─ Backend módulo de Inventario: 1 semana
├─ Frontend integrado: 1 semana
├─ Testing: 1 semana
└─ TOTAL: 5 semanas (asumiendo 40 horas/semana)
```

**Semana 4: Descubrimiento de Realidad**
- "Espera, la facturación tiene 15 campos extra"
- "Hay que integrar con impuestos"
- "El inventario necesita control de vencimientos"

**Semana 4-5: Abandono del Plan**
```
ACCIÓN: "Ok, olvidemos el plan y codifiquemos lo que sale"
MODO: "Code and Fix" (codificar y reparar)
RESULTADO:
├─ Sin estructura clara
├─ Sin hitos definidos
├─ Sin visibilidad de progreso
├─ "¿Cuándo termina?" → Respuesta: "No sé"
```

**Semana 5-6: Caos Controlado**
- Múltiples cambios simultáneos sin coordinación
- Conflictos en código (2-3 veces reparación de merges)
- Testing posterior find defectos fundamentales

**Semana 7: Re-planificación de Emergencia**
```
NUEVA REALIDAD:
├─ Testing completo: 2 semanas (vs 1 planificada)
├─ Correcciones: 1-2 semanas
├─ Documentación: 2-3 días
└─ Capacitación: 2 días
TOTAL ACTUAL: 6-7 semanas (vs 5 planificadas)
```

---

#### **MODERADO #9: Omitir Tareas Necesarias en Estimación (Error #25)**
**Clasificación:** Proceso  
**Severidad:** MODERADA  
**Impacto:** +20% de tiempo

**Tareas Omitidas:**

```
TAREA                           ESTIMADO   REAL      DIFERENCIA
─────────────────────────────────────────────────────────────────
Testing manual detallado        0 horas    8 horas   +800%
Documentación técnica           0 horas    6 horas   +600%
Capacitación usuario            0 horas    4 horas   +400%
Migración de datos (si aplica)  0 horas    3 horas   +300%
Fixes post-entrega              0 horas    2 horas   +200%
─────────────────────────────────────────────────────────────────
SUBTOTAL OMITIDO                            23 horas
```

**Efecto Cascada:**
- Se pensó: "Solo tenemos que codificar"
- Realidad: 23 horas de trabajo esencial no planificado
- Impacto: +4-5 días al proyecto

---

#### **MODERADO #10: Diseño Inadecuado (Error #21)**
**Clasificación:** Proceso  
**Severidad:** MODERADA  
**Período:** Semana 1-2

**Lo que pasó:**

**Diseño Inicial - Conceptual (Sin detalles)**
```
Veterinaria
├─ Clientes
├─ Citas
├─ Servicios
└─ Facturación
```

**Problemas Descubiertos Durante Codificación:**
- ¿Qué relación hay entre Clientes y Mascotas?
- ¿Una mascota puede tener múltiples dueños?
- ¿Las citas son para el cliente o para la mascota?
- ¿Cómo manejar histórico de servicios por mascota?

**Refactoring Posterior:**
- Agregar tabla Mascota
- Crear relaciones intermedias
- Migración de datos conceptual
- Total: 4-5 horas (no planificadas)

**Cita del Proyecto:**
- *"Deberíamos haber dibujado el diagrama ER con el veterinario"*

---

#### **LEVE #11: Gestión de Riesgos Insuficiente (Error #15)**
**Clasificación:** Proceso  
**Severidad:** LEVE-MODERADA  
**Período:** Toda el proyecto

**Riesgos No Identificados:**
```
RIESGO POTENCIAL          IMPACTO SI OCURRE      MITIGACIÓN
────────────────────────────────────────────────────────────
Enfermedad de dev         +1-2 semanas           Documentación en código
Cambio de prioridades     Refocus del proyecto   Comunc. clara con cliente
Integración fallida       +3-5 días              Tests unitarios antes
Base de datos corrupta    Pérdida de progreso    Backup diario
Cambio de requisitos      +2-3 semanas           Validación temprana
────────────────────────────────────────────────────────────
```

**Lo que sucedió:**
- Dev se enfermó 3 días (semana 5) → 25% de pérdida esa semana
- No había documentación → Otro dev no pudo seguir
- Respuesta: "Bueno, esperar a que se recupere"

---

#### **LEVE #12: Conversión Prematura (Error #24)**
**Clasificación:** Proceso  
**Severidad:** LEVE  
**Período:** Semana 6-7

**Lo que pasó:**
- Semana 6: "¿Cuándo entregamos?"
- Se intentó "pulir" la interfaz prematuramente
- Cambios menores de UI (colores, espacios)
- Mientras el backend aún tenía bugs

**Enfoque Incorrecto:**
```
VERDAD: 65 defectos sin resolver → perfeccionar UI
DEBERÍA SER: 65 defectos sin resolver → resolver defectos
```

**Impacto:**
- 3-4 horas en pulimento de interfaz
- Que no sirvieron porque se volvió a cambiar después de fixes

---

#### **LEVE #13: Planificación Insuficiente (Error #17)**
**Clasificación:** Proceso  
**Severidad:** LEVE  
**Período:** Semana 0 (pre-inicio)

**Lo que pasó:**
- No había documento de plan formal
- Estimación hecha "de cabeza"
- Sin desglose de tareas
- Sin milestones definidos

**Resultado:**
- Imposible seguimiento realista
- Descubrimiento tardío de problemas
- Sin forma objetiva de medir progreso

---

### 🟡 ERRORES RELACIONADOS CON EL PRODUCTO (2 Errores)

#### **MODERADO #14: Cambio de Prestaciones (Error #29)**
**Clasificación:** Producto  
**Severidad:** MODERADA  
**Período:** Semanas 3-6 (+55% de cambios)

**Cambios de Requerimientos Registrados:**

```
CAMBIO #1 (Semana 2):
Requisito Original:  "Registrar citas"
Cambio Detectado:    "Las citas deben tener recordatorios por SMS"
Impacto:             +3 horas (integración SMS, tabla de logs)

CAMBIO #2 (Semana 3):
Requisito Original:  "Facturación simple"
Cambio Detectado:    "Necesito reportes de ingresos por día/semana"
Impacto:             +4 horas (queries complejas, agregaciones)

CAMBIO #3 (Semana 4):
Requisito Original:  "Citas de 30 min"
Cambio Detectado:    "Algunas citas son 1 hora, otras 15 min"
Impacto:             +2 horas (validaciones, lógica variable)

CAMBIO #4 (Semana 5):
Requisito Original:  "Cliente puede reservar cita"
Cambio Detectado:    "Debe validar que no sea cliente VIP sin antes confirmar"
Impacto:             +2.5 horas (roles, permisos)

CAMBIO #5 (Semana 5):
Requisito Original:  "Inventario de medicinas"
Cambio Detectado:    "Medicinas vencen, necesito alertas"
Impacto:             +3 horas (validaciones, emails)

CAMBIO #6-11 (Semanas 6+): Cambios menores
Impacto Total:       +8 horas
─────────────────────────────────────────
TOTAL CAMBIOS:       +22.5 horas (~4.5 días)
PORCENTAJE:          +55% de cambios en requerimientos
```

**Cita de McConnell:**
> "Incluso si hemos evitado con éxito los requerimientos excesivos, los proyectos sufren como media sobre un 25 por 100 de cambios en los requerimientos a lo largo de su vida. Un cambio de este calibre puede producir un aumento en el plan de al menos un 25 por 100."

**Realidad en tu Proyecto:** +55% (MÁS DEL DOBLE del promedio)

---

#### **LEVE #15: Desarrolladores Meticulosos (Error #30)**
**Clasificación:** Producto  
**Severidad:** LEVE  
**Período:** Semana 3-4

**Lo que pasó:**
- Dev quiso "perfeccionar" la estructura de carpetas
- Implementó patrón DTO "por si acaso"
- Agregó logging exhaustivo "para debugging futuro"
- Total: 4-5 horas en "nice-to-have" no planificado

**Diálogo Típico:**
- Dev: *"Esto debería estar estructurado mejor"*
- PM: *"¿Es crítico para la entrega?"*
- Dev: *"No, pero hará el código mejor"*
- PM: *"Entonces lo hacemos después"*
- (Después nunca llega)

**Impacto:**
- Tiempo que pudo haber usado en testing
- En este caso: +4-5 horas (no crítico pero evitable)

---

### 🟠 ERRORES RELACIONADOS CON LA TECNOLOGÍA (0 Errores Críticos)

**Buenas Noticias:** No se detectaron errores graves en esta categoría.

**Por qué:**
- Spring Boot: Excelente elección para el proyecto ✓
- PostgreSQL: Apropiado para datos estructurados ✓
- Bootstrap: Framework UI sólido ✓
- No hubo cambio de herramientas a mitad de proyecto ✓
- Control de código fuente: Git implementado desde el inicio ✓

**Lo que se pudo mejorar:**
- Documentar la decisión tecnológica (por qué cada herramienta)
- Tests unitarios desde el inicio (no al final)
- Pero estos son "mejoras", no "errores críticos"

---

## IMPACTO CUANTITATIVO

### Gráfico de Impacto General

```
COMPARATIVA PROYECTO: PLAN vs REALIDAD
═══════════════════════════════════════════════════════════

DURACIÓN (semanas)
Plan:        |████| (3 semanas)
Real:        |████████████| (6.5 semanas)
Diferencia:  +117% ⚠️ CRÍTICO

ESFUERZO (personas-mes)
Plan:        |████| (2 personas × 1.5 semanas = 3 personas-mes aprox)
Real:        |████████████████| (27 personas-horas ÷ 40 ≈ 3.4 personas-mes)
Diferencia:  +13% (menos dramático que tiempo)

DEFECTOS
Plan:        |██| (10 defectos esperados)
Real:        |██████████████| (65 defectos detectados)
Diferencia:  +550% ⚠️ CRÍTICO

CAMBIOS REQUERIMIENTOS
Plan:        |██| (0-1 cambios)
Real:        |███████████| (11 cambios)
Diferencia:  +1000% ⚠️ CRÍTICO
```

### Línea de Tiempo - Desviación del Plan

```
SEMANA 1        PLAN  REAL
Inicio          ✓     ✓ (en tiempo)
Progreso        60%   65% (ligeramente adelante)

SEMANA 2
Progreso Acum   100%  90% ✗ (1 día de retraso detectado)
Cambios         0     3 descubiertos

SEMANA 3
Progreso Acum   100%  75% ✗✗ (3 días de retraso)
Cambios         0     5 descubiertos
REFLEXIÓN:      "Hmm, más difícil de lo esperado"

SEMANA 4
Progreso Acum   100%  65% ✗✗✗ (6 días de retraso)
Cambios         0     8 descubiertos
REACCIÓN:       "Esto va a tomar más tiempo"

SEMANA 5
Progreso Acum   100%  55% ✗✗✗✗ (9 días de retraso)
Cambios         0     10 descubiertos
CRISIS:         "¿Cuándo va a terminar esto?"

SEMANA 6
Progreso Acum   100%  45% ✗✗✗✗✗ (13-14 días de retraso)
Cambios         0     11 descubiertos
PRESIÓN:        "Trabajo extra horas"
FATIGA:         "Moral del equipo baja"

SEMANA 6.5 (Replanificación)
Plan Nuevo      100%  80% (Realista: faltan 2-3 días de trabajo)
RESPUESTA:      "Ok, 2-3 días más y terminamos"

SEMANA 7
Entrega         ✓ (Finalmente, pero con 14 días de retraso)
```

---

## ANÁLISIS DETALLADO

### Matriz de Errores: Impacto vs Frecuencia

```
                        IMPACTO ALTO
                            ▲
                            │
                      ██ #1 (Ilusiones)
                   ██ #7      ██ #14
                (Escatimar)   (Cambios)
    Impacto       │                    ██ #8
    Moderado      │              ██ #18(Abandono)
                  │         ██ #9(Omitir)
                  │    ██ #10,#13(Diseño/Insuf)
                  │  ██ #3,#11(Expect,Particip)
    Impacto       │
    Bajo          │ ██ #2,#6,#15(Mediocre,Leve)
                  │
                  └──────────────────────────────────────► FRECUENCIA ALTA
                   Baja           Media           Alta
```

---

## LECCIONES APRENDIDAS

### 1. **La Planificación es FUNDAMENTAL**

**Error Cometido:**
- Pensar "esto es un CRUD, será rápido"
- Estimación mental sin análisis

**Lección:**
```
┌─────────────────────────────────────────────────┐
│  Toda estimación DEBE incluir:                  │
├─────────────────────────────────────────────────┤
│  1. Análisis formal de requerimientos (4-6h)   │
│  2. Diseño técnico documentado (2-4h)          │
│  3. Desglose de tareas por módulo               │
│  4. Buffer de riesgo (25-30%)                   │
│  5. Tiempo para testing (25% del total)         │
│  6. Tiempo para documentación (15% del total)   │
│  7. Validación con cliente/stakeholder          │
└─────────────────────────────────────────────────┘
```

**Aplicación Futura:**
- Usar herramienta de estimación (Planning Poker)
- Documentar supuestos (qué NO se incluye)
- Revisiones periódicas de estimación

---

### 2. **Las Ilusiones Cuestan Muy Caro**

**Error Cometido:**
- "Es como el otro proyecto" → NO es idéntico
- "Los expertos pueden hacerlo rápido" → Aún deben aprender el dominio

**Lección:**
```
🔴 ILUSIÓN: "Esto debería tomar X tiempo"
✓ REALIDAD: "Esto PODRÍA tomar X tiempo EN CONDICIONES IDEALES"
✓ VERDAD:  "Esto PROBABLEMENTE TOMARÁ 1.5X a 2X tiempo"
```

**Indicadores de Ilusión (Detectar en reuniones):**
- "Debería ser..."
- "Típicamente..."
- "En teoría..."
- "Suponiendo que..."

---

### 3. **Validación Temprana con el Usuario es Crítica**

**Error Cometido:**
- Diseño sin participación del veterinario
- Primera presentación: semana 4 (demasiado tarde)

**Lección:**
```
CORRECTA PROGRESIÓN:
Semana 1:
├─ Reunión 1: "¿Qué necesitas?" (2 horas)
├─ Mockups en papel/wireframes
└─ Reunión 2: Validar mockups (1 hora)

Semana 2:
├─ Prototipo rápido (no funcional, solo visual)
├─ Reunión 3: Validar prototipo con cliente
└─ Ajustes basados en feedback

Semana 3+:
├─ Desarrollo con confianza en requisitos
└─ Solo cambios menores (no rediseños)
```

---

### 4. **El Cambio de Requerimientos es NORMAL (pero requiere gestión)**

**Error Cometido:**
- No se esperaban cambios
- Cuando llegaban, se aceptaban sin evaluar impacto
- No se replanificaba

**Lección:**
```
┌─────────────────────────────────────────────────┐
│         PROCESO DE CAMBIO REQUERIMIENTOS        │
├─────────────────────────────────────────────────┤
│ 1. Cliente propone cambio                      │
│ 2. Dev estima impacto (en horas)                │
│ 3. PM evalúa: ¿Vale la pena? ¿Tiempo?         │
│    A. Crítico para MVP → Incluir              │
│    B. Nice-to-have → Diferir a v2             │
│    C. Medio → Negociar alcance                │
│ 4. Si se incluye: Actualizar plan              │
│ 5. Comunicar nuevo cronograma                  │
└─────────────────────────────────────────────────┘
```

**En tu Proyecto:**
- 11 cambios aceptados sin este proceso
- Resultado: +55% de tiempo

---

### 5. **Las Actividades Iniciales (análisis, diseño) NO son "tiempo perdido"**

**Error Cometido:**
- Saltarse análisis/diseño para "empezar rápido"
- "Mientras codificamos, lo vamos viendo"

**Lección de McConnell:**
```
COSTO si lo haces BIEN al inicio:
├─ Análisis: 4 horas
├─ Diseño: 4 horas
└─ TOTAL: 8 horas

COSTO si lo haces TARDE (después):
├─ Refactoring: 20-30 horas
├─ Migraciones: 10 horas
├─ Testing adicional: 10 horas
└─ TOTAL: 40-50 horas

RATIO: 1:5 a 1:6 (hasta 6 veces más caro si se deja para después)
```

---

### 6. **La Motivación del Equipo es Medible e Importante**

**Error Cometido:**
- Aceptar horas extras sin límite
- "Apechugamos y terminamos"
- No reconocer fatiga

**Lección:**
```
SEMANA 1-2: Energía alta = Código bueno
Líneas de código por hora: 50 LOC/h
Defectos por 1000 LOC: 5

SEMANA 5-6: Energía baja = Código pobre
Líneas de código por hora: 20 LOC/h
Defectos por 1000 LOC: 15+ (3x más defectos)

CONCLUSIÓN: Las horas extras NO multiplican productividad
(Brooks' Law: "Adding manpower to a late project makes it later")
```

---

### 7. **Testing Debe Estar Planificado Desde el Inicio**

**Error Cometido:**
- Testing solo en las últimas 2 semanas
- 65 defectos descubiertos → Semanas 6-7 (demasiado tarde)

**Lección:**
```
CORRECTA ESTRATEGIA DE TESTING:
├─ Semana 1-2: Tests unitarios conforme se codifica
├─ Semana 3-4: Tests de integración
├─ Semana 5: Testing de usuario (UAT)
├─ Semana 6: Corrección de bugs encontrados
└─ RESULTADO: Descubrir problemas TEMPRANO (más fácil arreglarlo)

ESTRATEGIA TU PROYECTO:
├─ Semana 1-5: "Es un código hermoso, debe funcionar"
├─ Semana 6: Testing completo
├─ RESULTADO: 65 bugs descubiertos cuando ya es tarde
└─ SÍNTOMA: Desmotivación + Presión + Errores en fixes
```

---

## PLAN DE PREVENCIÓN

### Para Futuros Proyectos

#### **Fase 0: Pre-Inicio (1-2 semanas antes de codificar)**

```
ACTIVIDAD                    TIEMPO    RESPONSABLE    ENTREGA
────────────────────────────────────────────────────────────────
1. Kickoff formalmente       2h        PM + Dev       Acta de inicio
2. Entrevistas usuario       4-6h      PM             Requerimientos
3. Documentar requerimientos 4h        PM + Dev       Documento RF
4. Design Thinking/Mockups   4h        Dev + Design   Wireframes
5. Validar mockups usuario   2h        PM + User      Feedback doc
6. Estimación Planning Poker 3h        Team           Story points
7. Crear plan detallado      3h        PM             Cronograma
8. Identificar riesgos       2h        Team           Risk log
9. Kick-off técnico          2h        Tech Lead      Tech decisions
10. Baseline de calidad      1h        QA Lead        Estándares
────────────────────────────────────────────────────────────────
TOTAL FASE 0: 27-31 horas (~4-5 días)
```

#### **Fase 1: Desarrollo (con hitos semanales)**

```
CADA SEMANA:
├─ Lunes 9am: Daily standup (15 min)
│  - ¿Qué hice?
│  - ¿Qué haré hoy?
│  - ¿Bloqueadores?
│
├─ Miércoles: Mid-week checkpoint (1h)
│  - ¿Vamos en tiempo?
│  - Cambios detectados?
│  - Riesgos?
│
├─ Viernes 4pm: Sprint review (1h)
│  - Demostración de avance
│  - Feedback cliente
│  - Ajustes para siguiente semana
│
└─ Viernes 5pm: Retrospectiva (30 min)
   - ¿Qué salió bien?
   - ¿Qué salió mal?
   - ¿Cómo mejoramos?
```

#### **Checklist de Calidad (NO pasar a siguiente fase si...)**

```
✓ FASE DE ANÁLISIS:
  ☐ Todos los requerimientos documentados
  ☐ Validados por cliente
  ☐ Casos de uso identificados
  ☐ Riesgos identificados
  → Si alguno NO está listo: DETENER y completar antes

✓ FASE DE DISEÑO:
  ☐ Diagrama entidad-relación validado
  ☐ Wireframes aprobados por cliente
  ☐ Arquitectura técnica documentada
  ☐ Patrones de diseño definidos
  → Si falta: DETENER y completar antes

✓ FASE DE DESARROLLO:
  ☐ Tests unitarios: >80% cobertura
  ☐ Código revisionado (peer review)
  ☐ Sin deuda técnica acumulada
  ☐ Documentación inline del código
  → Si falla: DETENER y arreglar antes

✓ FASE DE TESTING:
  ☐ <10 bugs críticos abiertos
  ☐ Todos los requerimientos probados
  ☐ Caso de uso completo funciona
  → Si falla: EXTENDER testing, no comprimir
```

#### **Métricas de Salud del Proyecto**

Monitorear CADA SEMANA:

```
MÉTRICA                  META        SEMANA1  SEMANA2  ...
───────────────────────────────────────────────────────────
% Tareas completadas     80%+        85%      70%      ✓/✗
Velocidad (points/sem)   Línea base  100%     95%      ✓/✗
Bugs abiertos            <5          0        3        ✓/✗
Cambios requerimientos   <2/sem      0        2        ✓/✗
Moral del equipo         80%+        90%      75%      ✓/✗
Horas extra/semana       <5h         0h       5h       ✓/✗
```

**SI alguna métrica en ROJO:**
- Reunión inmediata
- Identificar causa raíz
- Plan de remediación en 24h

---

### Herramientas Recomendadas

```
┌──────────────────────────────────────────────────┐
│ HERRAMIENTAS SUGERIDAS PARA SIGUIENTE PROYECTO │
├──────────────────────────────────────────────────┤
│ Planificación:                                   │
│  • Jira / Azure DevOps (seguimiento de tareas)  │
│  • Miro / Mural (colaboración)                  │
│  • Figma (diseño compartido)                    │
│                                                  │
│ Desarrollo:                                      │
│  • Git + GitHub (control de versiones)          │
│  • JUnit / Pytest (testing automático)          │
│  • SonarQube (calidad de código)                │
│                                                  │
│ Comunicación:                                    │
│  • Slack / Teams (comunicación directa)         │
│  • Confluence (documentación)                   │
│  • Google Meet (reuniones remotas)              │
│                                                  │
│ Monitoreo:                                       │
│  • Burndown charts (progreso visual)            │
│  • Velocity tracking (tendencias)               │
│  • Risk register (gestión de riesgos)           │
└──────────────────────────────────────────────────┘
```

---

### La "Isla de Gilligan": Qué Evitar

**Cita de McConnell (aplicada a tu proyecto):**
> "La mayoría de las compañías descubre al final de cada proyecto que han cometido otro error clásico..."

**Tu Proyecto cayó en la Isla de Gilligan porque:**
1. ✗ Subestimó complejidad (ilusiones)
2. ✗ No validó con usuario temprano
3. ✗ Saltó análisis/diseño
4. ✗ Aceptó cambios sin plan de remediación
5. ✗ No gestionó riesgos identificables

**Cómo NO volver a caer:**
```
ANTES DE INICIAR PROYECTO:
├─ Checklist de pre-requisitos: ☐ Completar
├─ Plantilla de estimación: ☐ Usar
├─ Documento de riesgos: ☐ Identificar
└─ Plan de validación usuario: ☐ Ejecutar

DURANTE PROYECTO:
├─ Revisión semanal vs. plan: ☐ Documentar desviaciones
├─ Control de cambios: ☐ Formal (no informal)
├─ Métricas de salud: ☐ Dashboard visible
└─ Retrospectivas: ☐ Acción sobre hallazgos

DESPUÉS DEL PROYECTO:
├─ Post-mortem formal: ☐ 2-3 horas
├─ Lecciones documentadas: ☐ Wiki/Confluence
├─ Plantillas actualizadas: ☐ Para próx. proyecto
└─ Métricas compiladas: ☐ Baseline para comparación
```

---

## CONCLUSIÓN

El proyecto de Sistema de Gestión Veterinaria cometió **15 errores clásicos**, principalmente en las categorías **Personas** (6) y **Proceso** (7), que resultaron en:

- **+117% de retraso** en tiempo (3 semanas → 6.5 semanas)
- **+550% de defectos** (10 esperados → 65 reales)
- **+55% de cambios** en requerimientos (0 esperados → 11 reales)

### Los 5 Errores Más Críticos a Evitar:

1. **Planificación Excesivamente Optimista** → Usar estimación formal
2. **Ilusiones Sobre Complejidad** → Documentar supuestos explícitamente
3. **Escatimar en Análisis/Diseño** → Invertir tiempo inicial, ahorrar 10x después
4. **Abandono de Planificación** → Tener plan alternativo cuando surgen problemas
5. **Cambios de Requerimientos Sin Control** → Proceso formal de cambios

### Aplicación al Siguiente Proyecto:

✓ Fase 0 (Pre-inicio): 27-31 horas de planificación rigurosa  
✓ Hitos semanales con cliente  
✓ Testing desde semana 1 (no semana 6)  
✓ Buffer de riesgo: +25-30% en estimación  
✓ Métricas de salud monitoreadas diariamente  

**Con estos cambios, el siguiente proyecto debería cumplir plan ±10%**

---

## REFERENCIAS

- **McConnell, S. (1997).** Errores clásicos. En *Desarrollo y gestión de proyectos informáticos* (pp.35-58). McGraw Hill.
- **Brooks, F. P. (1975).** *The Mythical Man-Month: Essays on Software Engineering*. Addison-Wesley.
- **DeMarco, T. & Lister, T. (1987).** *Peopleware: Productive Projects and Teams*. Dorset House.

---

**Versión:** 1.0  
**Fecha:** 1 de Diciembre de 2025  
**Estado:** Documento de Aprendizaje - Lecciones Incorporadas ✓
