# GESTIÓN DE REPORTES - ESPECIFICACIONES DE CASOS DE USO

## G. REPORTES

### RF8.1 REPORTE DE PERSONAL 

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.1.1 | Listar todo el personal registrado con sus datos principales (nombre, cargo, área). | Evidente |
| RF8.1.2 | Permitir filtrar personal por cargo, área o estado laboral (activo, inactivo). | Evidente |
| RF8.1.3 | Mostrar información detallada del empleado seleccionado (contacto, horario, supervisor). | Evidente |
| RF8.1.4 | Generar reporte de personal en formato PDF o Excel para impresión o análisis. | Evidente |

## REPORTE DE PERSONAL

| Campo | Descripción |
|-------|-------------|
| **Caso de Uso** | REPORTE DE PERSONAL |
| **Referencias** | R8, R8.1, R8.1.1, R8.1.2, R8.1.3, R8.1.4 |
| **Actores** | Propietario, Administrador |
| **Tipo** | Primario |
| **Propósito** | Permitir al actor obtener una visión consolidada de los usuarios por tipo y estado en un período definido para apoyar el control y la toma de decisiones. |
| **Resumen** | El actor define fechas y criterios (tipo/estado), el sistema consulta la base de datos, agrupa y calcula totales/subtotales y muestra el reporte listo para revisión o exportación. |

### CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso inicia cuando el actor accede al módulo Reportes y selecciona "Reporte de Personal" | 2. El sistema muestra la pantalla con filtros: rango de fechas, área, cargo, estado (activo/inactivo) y formato de exportación (PDF/Excel) |
| 3. El actor selecciona los criterios deseados (área, cargo, estado) y define el rango de fechas | 4. El sistema valida que las fechas sean correctas y habilita el botón "Generar Reporte" |
| 5. El actor presiona "Generar Reporte" | 6. El sistema consulta la base de datos y muestra una tabla con: Código, Nombre, DNI, Área, Cargo, Estado, Fecha Ingreso y Salario |
| 7. El actor revisa los datos del reporte mostrado en pantalla | 8. El sistema presenta totales por área, estado y cantidad total de empleados, además de botones "Exportar PDF" y "Exportar Excel" |
| 9. El actor selecciona un empleado específico para ver detalles | 10. El sistema muestra información completa del empleado: datos personales, contacto, horario, supervisor y historial laboral |
| 11. El actor presiona "Exportar PDF" o "Exportar Excel" | 12. El sistema genera el archivo en el formato seleccionado y lo descarga automáticamente, dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**4.b** Si el actor ingresa una fecha "Hasta" anterior a la fecha "Desde", el sistema muestra: "Rango de fechas inválido." y no permite continuar.

**6.b** Si no se encuentran empleados con los filtros aplicados, el sistema muestra el mensaje: "No hay personal registrado con los criterios seleccionados."

---

### RF8.2 REPORTE DE CLIENTES

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.2.1 | Listar todos los clientes registrados. | Evidente |
| RF8.2.2 | Mostrar información de contacto y estado de cuenta de cada cliente. | Evidente |
| RF8.2.3 | Permitir aplicar filtros por tipo de cliente o estado. | Evidente |
| RF8.2.4 | Exportar reporte a PDF o Excel. | Evidente |

## REPORTE DE CLIENTES

| Campo | Descripción |
|-------|-------------|
| **Caso de Uso** | REPORTE DE CLIENTES |
| **Referencias** | R8, R8.2, R8.2.1, R8.2.2, R8.2.3, R8.2.4 |
| **Actores** | Propietario, Administrador |
| **Tipo** | Primario |
| **Propósito** | Brindar al actor una visión consolidada de la cartera de clientes con información de contacto y estado financiero para apoyar decisiones comerciales. |
| **Resumen** | El actor define criterios de búsqueda (tipo, estado), el sistema consulta y presenta el listado de clientes con datos relevantes, permitiendo exportación en múltiples formatos. |

### CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso inicia cuando el actor accede al módulo Reportes y selecciona "Reporte de Clientes" | 2. El sistema muestra la pantalla con filtros: tipo de cliente (Persona/Empresa), estado (Activo/Inactivo), rango de fechas de registro y formato de exportación |
| 3. El actor aplica filtros según sus necesidades (tipo, estado, fechas) | 4. El sistema valida los criterios ingresados y habilita el botón "Generar Reporte" |
| 5. El actor presiona "Generar Reporte" | 6. El sistema consulta la base de datos y muestra tabla con: Código, Nombre/Razón Social, Documento, Tipo, Teléfono, Email, Estado y Saldo Pendiente |
| 7. El actor revisa el listado de clientes mostrado | 8. El sistema presenta totales: cantidad por tipo de cliente, clientes activos/inactivos y saldo total pendiente de cobro |
| 9. El actor selecciona un cliente específico para ver detalles | 10. El sistema muestra información completa: datos de contacto, historial de compras, estado de cuenta detallado y última transacción |
| 11. El actor elige el formato de exportación (PDF/Excel) | 12. El sistema genera el archivo con el reporte completo y lo pone disponible para descarga, dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**6.b** Si no existen clientes con los filtros aplicados, el sistema muestra: "No hay clientes registrados con los criterios seleccionados."

**10.b** Si un cliente seleccionado no tiene transacciones asociadas, el sistema muestra: "Cliente sin historial de compras registradas."

---

### RF8.3 REPORTE DE INVENTARIO

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.3.1 | Seleccionar tipo de inventario (insumos, productos terminados, herramientas). | Evidente |
| RF8.3.2 | Consultar niveles actuales de stock, entradas y salidas del periodo. | Evidente |
| RF8.3.3 | Identificar productos con stock crítico o vencimiento próximo. | Evidente |
| RF8.3.4 | Mostrar el reporte en formato tabular con totales por categoría. | Evidente |

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
| 1. El caso de uso inicia cuando el actor accede al módulo Reportes y selecciona "Reporte de Inventario" | 2. El sistema muestra la pantalla con filtros: tipo de inventario (Insumos/Productos Terminados/Herramientas), rango de fechas y alertas (Stock Crítico/Próximo Vencimiento) |
| 3. El actor selecciona el tipo de inventario y período a consultar | 4. El sistema valida las fechas seleccionadas y carga las categorías disponibles para el tipo elegido |
| 5. El actor configura las alertas deseadas y presiona "Generar Reporte" | 6. El sistema consulta movimientos del período y niveles actuales, mostrando tabla con: Código, Producto, Categoría, Stock Inicial, Entradas, Salidas, Stock Actual, Stock Mínimo y Estado |
| 7. El actor revisa los datos del inventario mostrados | 8. El sistema resalta en rojo productos con stock crítico y en amarillo aquellos próximos a vencer, mostrando totales por categoría |
| 9. El actor selecciona un producto para ver detalle de movimientos | 10. El sistema muestra historial detallado: fechas, tipos de movimiento, cantidades, responsables y observaciones del producto seleccionado |
| 11. El actor puede filtrar por alertas específicas usando los botones "Solo Críticos" o "Próximos a Vencer" | 12. El sistema actualiza la tabla mostrando únicamente los productos que cumplen el criterio de alerta seleccionado |
| 13. El actor presiona "Exportar" para descargar el reporte | 14. El sistema genera archivo PDF/Excel con el reporte completo incluyendo gráficos de stock por categoría, dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**6.b** Si no hay movimientos de inventario en el período seleccionado, el sistema muestra: "Sin movimientos de inventario para el período consultado."

**12.b** Si no existen productos con alertas activas, el sistema muestra: "No hay productos con alertas de stock crítico o próximo vencimiento."

---

### RF8.4 REPORTE DE ORDEN DE PRODUCCIÓN

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.4.1 | Seleccionar rango de fechas o número de orden. | Evidente |
| RF8.4.2 | Recuperar información de órdenes de producción finalizadas o en proceso. | Evidente |
| RF8.4.3 | Calcular indicadores como eficiencia, tiempos de operación y desperdicio. | Oculta |
| RF8.4.4 | Presentar los resultados en una tabla o gráfico comparativo. | Evidente |

## REPORTE DE ORDEN DE PRODUCCIÓN

| Campo | Descripción |
|-------|-------------|
| **Caso de Uso** | REPORTE DE ORDEN DE PRODUCCIÓN |
| **Referencias** | R8, R8.4, R8.4.1, R8.4.2, R8.4.3, R8.4.4 |
| **Actores** | Propietario, Jefe de Producción, Administrador |
| **Tipo** | Primario |
| **Propósito** | Brindar al actor indicadores y detalle de las órdenes de producción finalizadas o en proceso para evaluar eficiencia, tiempos y desperdicios. |
| **Resumen** | El actor selecciona rango de fechas y filtros (línea/producto); el sistema recupera las OP, calcula KPIs (eficiencia, tiempo promedio, desperdicio) y presenta el informe con comparativos. |

### CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso inicia cuando el actor accede al módulo Reportes y selecciona "Reporte de Orden de Producción" | 2. El sistema muestra la pantalla con filtros: rango de fechas, número de OP específica, producto, línea de producción, estado (Finalizada/En Proceso/Todas) |
| 3. El actor define el período y criterios de búsqueda deseados | 4. El sistema valida las fechas y habilita los filtros dependientes según la selección realizada |
| 5. El actor presiona "Generar Reporte" | 6. El sistema consulta las OP y muestra tabla con: Número OP, Fecha, Producto, Cantidad Planificada, Cantidad Producida, Estado, Tiempo Total y Eficiencia (%) |
| 7. El actor revisa las órdenes de producción listadas | 8. El sistema presenta KPIs calculados: Eficiencia Promedio, Tiempo Promedio por Unidad, Porcentaje de Desperdicio, Órdenes Completadas a Tiempo |
| 9. El actor selecciona una OP específica para ver detalles | 10. El sistema muestra información completa: cronograma detallado, recursos asignados, consumo de insumos vs planificado, incidencias registradas |
| 11. El actor puede acceder a la vista de "Comparativo de Eficiencia" | 12. El sistema genera gráfico comparativo mostrando eficiencia por producto, línea y período, identificando tendencias y desviaciones |
| 13. El actor presiona "Exportar Reporte" | 14. El sistema genera archivo con reporte completo incluyendo gráficos de tendencias, análisis de KPIs y recomendaciones, dando fin al Caso de Uso |

### CURSOS ALTERNATIVOS

**6.b** Si no existen órdenes de producción en el período seleccionado, el sistema muestra: "No hay órdenes de producción para el período consultado."

**10.b** Si una OP seleccionada no tiene datos de seguimiento completos, el sistema indica: "Información de seguimiento incompleta para esta orden."

---

### RF8.5 REPORTE DE ESTADO DE CUENTA

| Referencia | Función | Categoría |
|------------|---------|-----------|
| RF8.5.1 | Seleccionar cliente para el reporte. | Evidente |
| RF8.5.2 | Visualizar movimientos recientes y saldo actual. | Evidente |
| RF8.5.3 | Incluir detalle de pagos pendientes o vencidos. | Evidente |
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