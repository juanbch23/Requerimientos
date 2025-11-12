# GESTIÓN DE REPORTES - ESPECIFICACIONES DE CASOS DE USO

## G. REPORTES

### RF8.1 REPORTE DE PERSONAL 

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.1.1 | Listar todo el personal registrado con sus datos principales (código, nombre, DNI, área, cargo, estado). | Evidente |
| RF8.1.2 | Permitir filtrar personal por período, área, cargo o estado laboral (activo, inactivo). | Evidente |
| RF8.1.3 | Mostrar KPIs calculados (total empleados, activos, inactivos, áreas). | Evidente |
| RF8.1.4 | Generar reporte de personal en formato PDF o Excel para impresión o análisis. | Evidente |

## REPORTE DE PERSONAL

| Campo | Descripción |
|-------|-------------|
| **Caso de Uso** | REPORTE DE PERSONAL |
| **Referencias** | R8, R8.1, R8.1.1, R8.1.2, R8.1.3, R8.1.4 |
| **Actores** | Propietario, Administrador |
| **Tipo** | Primario |
| **Propósito** | Permitir al actor obtener una visión consolidada de los empleados por área, cargo y estado en un período definido para apoyar el control y la toma de decisiones. |
| **Resumen** | El actor define fechas y criterios (área/cargo/estado), el sistema consulta la base de datos, agrupa y calcula totales/subtotales y muestra el reporte listo para revisión o exportación. |

### CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso comienza cuando el actor ingresa al módulo Reportes y selecciona "Reporte de Personal" | 2. El sistema muestra la pantalla con filtros: Desde (fecha), Hasta (fecha), Área (Todas), Cargo (Todos), Estado (Todos/Activo/Inactivo) y el panel de resumen con KPIs |
| 3. El actor selecciona el período de fechas y aplica filtros por área, cargo y/o estado según necesite | 4. El sistema valida las fechas ingresadas y carga las opciones dinámicas para área y cargo desde la base de datos |
| 5. El actor presiona "Aplicar Filtros" | 6. El sistema consulta la base de datos y muestra tabla con: Código, Nombre, DNI, Área, Cargo, Estado |
| 7. El actor revisa los datos del reporte mostrado en la sección Resultados | 8. El sistema presenta KPIs calculados: Total empleados, Activos, Inactivos, Áreas y habilita los botones "Exportar PDF" y "Exportar Excel" |
| 9. El actor puede presionar "Limpiar" para resetear los filtros | 10. El sistema limpia todos los filtros y regresa a la vista inicial sin resultados |
| 11. El actor presiona "Exportar PDF" o "Exportar Excel" | 12. El sistema genera el archivo en el formato seleccionado con los resultados filtrados y lo descarga automáticamente, dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**6.b** Si no se encuentran empleados con los filtros aplicados, el sistema muestra el mensaje: "No hay resultados con los filtros aplicados."

---

### RF8.2 REPORTE DE CLIENTES

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.2.1 | Listar todos los clientes registrados con código, nombre, documento, tipo y estado. | Evidente |
| RF8.2.2 | Mostrar información filtrada por período, tipo, estado y búsqueda por nombre/documento. | Evidente |
| RF8.2.3 | Permitir aplicar múltiples filtros y mostrar KPIs (total, activos, inactivos, tipos). | Evidente |
| RF8.2.4 | Exportar reporte a PDF o Excel. | Evidente |

## REPORTE DE CLIENTES

| Campo | Descripción |
|-------|-------------|
| **Caso de Uso** | REPORTE DE CLIENTES |
| **Referencias** | R8, R8.2, R8.2.1, R8.2.2, R8.2.3, R8.2.4 |
| **Actores** | Propietario, Administrador |
| **Tipo** | Primario |
| **Propósito** | Brindar al actor una visión consolidada de la cartera de clientes con información de contacto para apoyar decisiones comerciales. |
| **Resumen** | El actor define criterios de búsqueda (fechas/tipo/estado/nombre), el sistema consulta y presenta el listado de clientes con datos relevantes, permitiendo exportación en múltiples formatos. |

### CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso comienza cuando el actor ingresa al módulo Reportes y selecciona "Reporte de Clientes" | 2. El sistema muestra la pantalla con filtros: Desde (fecha), Hasta (fecha), Tipo (Todos), Estado (Todos/Activo/Inactivo), Nombre o DNI/RUC y el panel de resumen |
| 3. El actor aplica filtros según sus necesidades: período, tipo, estado o busca por nombre/documento | 4. El sistema valida los criterios ingresados y carga las opciones dinámicas para tipo desde la base de datos |
| 5. El actor presiona "Aplicar Filtros" | 6. El sistema consulta la base de datos y muestra tabla con: Código, Nombre/Razón social, Documento, Tipo, Estado |
| 7. El actor revisa el listado de clientes mostrado en la sección Resultados | 8. El sistema presenta KPIs calculados: Total clientes, Activos, Inactivos, Tipos y habilita los botones "Exportar PDF" y "Exportar Excel" |
| 9. El actor puede presionar "Limpiar" para resetear todos los filtros | 10. El sistema limpia todos los filtros y regresa a la vista inicial sin resultados |
| 11. El actor elige el formato de exportación presionando "Exportar PDF" o "Exportar Excel" | 12. El sistema genera el archivo con el reporte completo y lo pone disponible para descarga, dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**6.b** Si no existen clientes con los filtros aplicados, el sistema muestra: "No hay resultados con los filtros aplicados."

---

### RF8.3 REPORTE DE INVENTARIO

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.3.1 | Seleccionar tipo de inventario (insumos, productos terminados). | Evidente |
| RF8.3.2 | Consultar niveles actuales de stock, entradas y salidas del periodo con límites mín/máx. | Evidente |
| RF8.3.3 | Identificar productos con información de vencimiento y estado. | Evidente |
| RF8.3.4 | Mostrar el reporte en formato tabular con KPIs (total, mayor stock, menor stock). | Evidente |

## REPORTE DE INVENTARIO

| Campo | Descripción |
|-------|-------------|
| **Caso de Uso** | REPORTE DE INVENTARIO |
| **Referencias** | R8, R8.3, R8.3.1, R8.3.2, R8.3.3, R8.3.4 |
| **Actores** | Propietario, Jefe de Producción, Administrador |
| **Tipo** | Primario |
| **Propósito** | Facilitar al actor el seguimiento del stock, movimientos y alertas (crítico/vencimiento) por tipo de inventario. |
| **Resumen** | El actor elige el tipo de inventario y período; el sistema consulta niveles actuales y movimientos, identifica alertas y muestra un reporte tabular con totales por categoría. |

### CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso comienza cuando el actor ingresa al módulo Reportes y selecciona "Reporte de Inventario" | 2. El sistema muestra la pantalla con filtros: Tipo de inventario (Insumos/Productos terminados), Desde (fecha), Hasta (fecha) y el panel de resumen |
| 3. El actor selecciona el tipo de inventario (insumos o productos terminados) y define el período a consultar | 4. El sistema valida las fechas seleccionadas y prepara la consulta según el tipo de inventario elegido |
| 5. El actor presiona "Aplicar Filtros" | 6. El sistema consulta movimientos del período y niveles actuales, mostrando tabla con: Código, Descripción, Stock, Mín, Máx, Entradas, Salidas, Vence, Estado |
| 7. El actor revisa los datos del inventario mostrados en la sección Detalle | 8. El sistema presenta KPIs calculados: Total productos, Mayor stock (con detalle), Menor stock (con detalle) y habilita botones de exportación |
| 9. El actor puede presionar "Limpiar" para resetear los filtros | 10. El sistema limpia todos los filtros y regresa a la vista inicial con tipo "insumos" por defecto |
| 11. El actor presiona "Exportar PDF" o "Exportar Excel" | 12. El sistema genera archivo con el reporte completo incluyendo alertas de stock crítico y productos próximos a vencer, disponibilizando la descarga y dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**6.b** Si no hay movimientos de inventario en el período seleccionado, el sistema muestra: "No hay información disponible."

---

### RF8.4 REPORTE DE PRODUCCIÓN

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.4.1 | Seleccionar rango de fechas y línea de producción. | Evidente |
| RF8.4.2 | Recuperar información de órdenes de producción finalizadas o en proceso. | Evidente |
| RF8.4.3 | Calcular indicadores como eficiencia, tiempos de operación y desperdicio. | Oculta |
| RF8.4.4 | Presentar los resultados en una tabla con métricas de producción. | Evidente |

## REPORTE DE PRODUCCIÓN

| Campo | Descripción |
|-------|-------------|
| **Caso de Uso** | REPORTE DE PRODUCCIÓN |
| **Referencias** | R8, R8.4, R8.4.1, R8.4.2, R8.4.3, R8.4.4 |
| **Actores** | Propietario, Jefe de Producción, Administrador |
| **Tipo** | Primario |
| **Propósito** | Brindar al actor indicadores y detalle de las órdenes de producción finalizadas o en proceso para evaluar eficiencia, tiempos y desperdicios. |
| **Resumen** | El actor selecciona rango de fechas y filtros (línea); el sistema recupera las OP, calcula KPIs (eficiencia, tiempo promedio, desperdicio) y presenta el informe con comparativos. |

### CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso comienza cuando el actor ingresa al módulo Reportes y selecciona "Reporte de Producción" | 2. El sistema muestra la pantalla con filtros: Desde (fecha), Hasta (fecha), Línea (Todas/Mezclado/Envasado/Etiquetado) y el panel de indicadores |
| 3. El actor define el período y selecciona la línea de producción deseada | 4. El sistema valida las fechas y habilita los filtros dependientes según la selección realizada |
| 5. El actor presiona "Aplicar Filtros" | 6. El sistema consulta las OP y muestra tabla con: OP, Línea, Producto, Planif., Real, Inicio–Fin, Eficiencia, Desperdicio |
| 7. El actor revisa las órdenes de producción listadas en la sección Detalle | 8. El sistema presenta KPIs calculados: Eficiencia (%), Tiempo prom. (h), Desperdicio (%) y habilita los botones de exportación |
| 9. El actor puede presionar "Limpiar" para resetear todos los filtros | 10. El sistema limpia todos los filtros y regresa a la vista inicial sin resultados |
| 11. El actor presiona "Exportar PDF" o "Exportar Excel" | 12. El sistema genera archivo con reporte completo incluyendo métricas de producción y análisis de KPIs, dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**6.b** Si no existen órdenes de producción en el período seleccionado, el sistema muestra: "No hay datos para el período/filtros seleccionados."

---

### RF8.5 REPORTE DE ESTADO DE CUENTA

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.5.1 | Seleccionar período, cliente y tipo de comprobante para el reporte. | Evidente |
| RF8.5.2 | Visualizar movimientos detallados con información de venta, fecha, cliente y productos. | Evidente |
| RF8.5.3 | Incluir cálculos de subtotal, IGV y total acumulado. | Oculta |
| RF8.5.4 | Exportar reporte a PDF o Excel. | Evidente |

## REPORTE DE ESTADO DE CUENTA

| Campo | Descripción |
|-------|-------------|
| **Caso de Uso** | REPORTE DE ESTADO DE CUENTA |
| **Referencias** | R8, R8.5, R8.5.1, R8.5.2, R8.5.3, R8.5.4 |
| **Actores** | Propietario, Administrador, Contador |
| **Tipo** | Primario |
| **Propósito** | Permitir al actor descargar los reportes generados en formatos estándar (PDF/Excel) para su distribución o archivo. |
| **Resumen** | El actor selecciona tipo de reporte, período y formato; el sistema procesa la salida, genera el archivo correspondiente y habilita la descarga, registrando el historial de exportaciones. |

### CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso inicia cuando el actor accede al módulo Reportes y selecciona "Reporte de Estado de Cuenta" | 2. El sistema muestra la pantalla con buscador de cliente, filtros de fecha y tipo de movimiento (Todos/Ventas/Pagos/Ajustes) |
| 3. El actor busca y selecciona el cliente específico para el reporte | 4. El sistema carga los datos básicos del cliente y habilita los filtros de período y tipo de movimiento |
| 5. El actor define el rango de fechas y tipo de movimientos a incluir | 6. El sistema valida las fechas y consulta los movimientos del cliente, mostrando: saldo inicial, movimientos del período y saldo final |
| 7. El actor revisa el estado de cuenta mostrado en pantalla | 8. El sistema presenta tabla detallada con: Fecha, Tipo, Documento, Descripción, Débito, Crédito, Saldo y Estado, diferenciando pagos pendientes y vencidos en colores |
| 9. El actor puede filtrar solo "Pendientes" o "Vencidos" | 10. El sistema actualiza la vista mostrando únicamente las transacciones que corresponden al filtro aplicado, recalculando totales |
| 11. El actor revisa el resumen financiero del cliente | 12. El sistema muestra totales consolidados: Saldo Inicial, Total Ventas, Total Pagos, Saldo Actual, Monto Vencido y Días Promedio de Vencimiento |
| 13. El actor selecciona "Exportar PDF" o "Exportar Excel" | 14. El sistema genera el archivo con formato de estado de cuenta oficial, incluyendo encabezado con datos del cliente y firma digital, disponibilizando la descarga y dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**6.b** Si el cliente seleccionado no tiene movimientos en el período consultado, el sistema muestra: "El cliente no registra movimientos para el período seleccionado."

**10.b** Si no existen pagos pendientes o vencidos según el filtro aplicado, el sistema indica: "No hay movimientos pendientes/vencidos para mostrar."

**14.b** Si ocurre un error durante la generación del archivo, el sistema muestra: "Error al generar el reporte. Intente nuevamente." y registra el error en el log del sistema.

---

## ARCHIVOS HTML RELACIONADOS

Los siguientes archivos HTML implementan la funcionalidad de reportes:

- `reporte-personal.html` - Interfaz para generar reporte de personal
- `reporte-clientes.html` - Interfaz para generar reporte de clientes  
- `reporte-inventario.html` - Interfaz para generar reporte de inventario
- `reporte-produccion.html` - Interfaz para generar reporte de órdenes de producción
- `reporte-estado-cuentas.html` - Interfaz para generar estado de cuenta de clientes

El archivo `app-rep.js` contiene la lógica JavaScript para manejar la interacción de los reportes, validaciones de formularios y comunicación con el backend para la generación y descarga de los archivos de reporte.