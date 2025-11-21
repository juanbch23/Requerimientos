# REQUERIMIENTOS FUNCIONALES
**SISTEMA DE GESTIÓN BIBLIOTECARIA - UNIVERSIDAD NACIONAL FEDERICO VILLARREAL**

---

## ÍNDICE DE REQUERIMIENTOS FUNCIONALES

- [RF001 - AUTENTICACIÓN Y AUTORIZACIÓN](#rf001-autenticación-y-autorización)
- [RF002 - GESTIÓN DE USUARIOS](#rf002-gestión-de-usuarios)  
- [RF003 - GESTIÓN DE LIBROS](#rf003-gestión-de-libros)
- [RF004 - GESTIÓN DE PRÉSTAMOS](#rf004-gestión-de-préstamos)
- [RF005 - GESTIÓN DE RESERVAS](#rf005-gestión-de-reservas)
- [RF006 - GESTIÓN DE SANCIONES](#rf006-gestión-de-sanciones)
- [RF007 - CATÁLOGO PÚBLICO](#rf007-catálogo-público)
- [RF008 - PANEL PERSONAL ESTUDIANTE](#rf008-panel-personal-estudiante)
- [RF009 - REPORTES Y ESTADÍSTICAS](#rf009-reportes-y-estadísticas)
- [RF010 - GESTIÓN DE DATOS MAESTROS](#rf010-gestión-de-datos-maestros)

---

## RF001. AUTENTICACIÓN Y AUTORIZACIÓN

### RF001.1. Inicio de Sesión
**Actores:** Administrador, Estudiante  
**Prioridad:** Alta  
**Estado:** ✅ Implementado

**RF001.1.1** El sistema debe permitir autenticación mediante correo electrónico y contraseña
- El sistema debe validar formato del correo electrónico
- El sistema debe verificar que ambos campos sean obligatorios
- El sistema debe encriptar la comunicación de credenciales

**RF001.1.2** El sistema debe validar credenciales contra la base de datos
- El sistema debe comparar contraseñas usando encriptación BCrypt
- El sistema debe verificar que el usuario esté activo
- El sistema debe rechazar usuarios inactivos o suspendidos

**RF001.1.3** El sistema debe establecer sesiones seguras
- El sistema debe generar tokens de sesión únicos
- El sistema debe establecer timeout automático de 30 minutos
- El sistema debe permitir una sola sesión activa por usuario

**RF001.1.4** El sistema debe redirigir según el rol del usuario
- Administradores: Redirigir a `/admin/dashboard`
- Estudiantes: Redirigir a `/alumno/dashboard`
- Sistema: Mantener historial de última página visitada

### RF001.2. Cierre de Sesión
**RF001.2.1** El sistema debe permitir logout seguro
- El sistema debe invalidar la sesión activa
- El sistema debe limpiar cookies y tokens
- El sistema debe redirigir al login tras logout

**RF001.2.2** El sistema debe implementar logout automático
- El sistema debe cerrar sesión tras timeout
- El sistema debe notificar al usuario sobre expiración
- El sistema debe permitir renovación de sesión

### RF001.3. Control de Acceso por Roles
**RF001.3.1** El sistema debe implementar control basado en roles (RBAC)
- Solo administradores pueden acceder al panel administrativo
- Solo estudiantes pueden acceder al portal estudiantil  
- El sistema debe verificar permisos en cada solicitud

**RF001.3.2** El sistema debe manejar accesos no autorizados
- El sistema debe mostrar página de error 403 para accesos denegados
- El sistema debe registrar intentos de acceso no autorizado
- El sistema debe redirigir a login si no hay sesión activa

---

## RF002. GESTIÓN DE USUARIOS

### RF002.1. Registro de Usuarios
**Actor:** Administrador  
**Prioridad:** Alta  
**Estado:** ✅ Implementado

**RF002.1.1** El sistema debe permitir crear usuarios con rol ADMIN o ESTUDIANTE
- El sistema debe validar selección de rol obligatoria
- El sistema debe establecer permisos según rol asignado
- El sistema debe permitir creación masiva de estudiantes

**RF002.1.2** El sistema debe validar unicidad de datos
- El correo electrónico debe ser único en el sistema
- El DNI debe ser único en el sistema
- El sistema debe mostrar mensajes específicos por campo duplicado

**RF002.1.3** El sistema debe gestionar datos personales completos
- Datos obligatorios: nombres, apellidos, DNI, correo, teléfono
- Datos opcionales: dirección, fecha de nacimiento
- Para estudiantes: carrera, ciclo académico, código estudiantil

**RF002.1.4** El sistema debe manejar seguridad de contraseñas
- El sistema debe generar contraseña temporal inicial
- El sistema debe encriptar contraseñas con BCrypt
- El sistema debe enviar credenciales por correo electrónico

### RF002.2. Modificación de Usuarios  
**RF002.2.1** El sistema debe permitir búsqueda de usuarios
- Búsqueda por nombre completo (parcial o completo)
- Búsqueda por correo electrónico
- Búsqueda por DNI o código estudiantil
- Filtros por rol, estado, carrera y ciclo

**RF002.2.2** El sistema debe permitir edición completa
- Modificación de todos los datos personales
- Cambio de rol de usuario (ADMIN/ESTUDIANTE)
- Actualización de datos académicos para estudiantes
- Preservación de integridad referencial

**RF002.2.3** El sistema debe controlar estados de usuario
- Activar/desactivar usuarios
- Suspender temporalmente usuarios
- Reactivar usuarios suspendidos
- Mantener historial de cambios de estado

### RF002.3. Consulta de Usuarios
**RF002.3.1** El sistema debe mostrar listado completo de usuarios
- Vista paginada con filtros múltiples
- Ordenamiento por diferentes campos
- Exportación de listados en formato PDF/Excel
- Contadores por tipo de usuario y estado

**RF002.3.2** El sistema debe mostrar información detallada
- Vista completa de perfil de usuario
- Historial de préstamos y reservas
- Estado de sanciones activas
- Estadísticas de uso del sistema

### RF002.4. Eliminación de Usuarios
**RF002.4.1** El sistema debe verificar integridad antes de eliminar
- El sistema debe verificar ausencia de préstamos activos
- El sistema debe verificar ausencia de reservas pendientes
- El sistema debe verificar ausencia de sanciones no resueltas

**RF002.4.2** El sistema debe implementar eliminación lógica
- Marcado como inactivo en lugar de eliminación física
- Preservación de datos para auditoría e historial
- Posibilidad de reactivación posterior

---

## RF003. GESTIÓN DE LIBROS

### RF003.1. Registro de Libros
**Actor:** Administrador  
**Prioridad:** Alta  
**Estado:** ✅ Implementado

**RF003.1.1** El sistema debe permitir registro completo de libros
- Datos obligatorios: título, autor(es), editorial, año publicación
- Datos opcionales: ISBN, edición, número de páginas, descripción
- Asociación múltiple de autores por libro
- Selección de categorías temáticas

**RF003.1.2** El sistema debe validar datos únicos
- ISBN único si se proporciona
- Validación de formato ISBN (ISBN-10 o ISBN-13)
- Verificación de duplicados por título y autor
- Control de ediciones múltiples del mismo libro

**RF003.1.3** El sistema debe gestionar información editorial
- Registro de editoriales existentes o creación de nuevas
- Información de contacto de editoriales
- País de origen de la editorial
- Validación de datos de editorial

### RF003.2. Gestión de Ejemplares
**RF003.2.1** El sistema debe permitir gestión de ejemplares físicos
- Registro de múltiples ejemplares por libro
- Asignación automática de códigos únicos
- Control de estado por ejemplar (disponible, prestado, reservado, dañado)
- Ubicación física en biblioteca (estantería, sección)

**RF003.2.2** El sistema debe controlar disponibilidad
- Conteo automático de ejemplares disponibles
- Actualización de estado en tiempo real
- Reserva automática cuando no hay disponibles
- Notificación de disponibilidad a usuarios en lista de espera

### RF003.3. Modificación y Mantenimiento
**RF003.3.1** El sistema debe permitir edición completa de libros
- Modificación de todos los campos de información
- Gestión de autores (agregar/quitar)
- Cambio de categoría y clasificación
- Preservación de historial de cambios

**RF003.3.2** El sistema debe manejar ejemplares dañados o perdidos
- Marcado de ejemplares como dañados/perdidos
- Retiro temporal o permanente de circulación
- Gestión de reposición de ejemplares
- Control de costos por pérdidas

### RF003.4. Consulta del Catálogo
**RF003.4.1** El sistema debe proporcionar catálogo completo
- Listado paginado de todos los libros
- Vista detallada con toda la información
- Imágenes de portadas cuando estén disponibles
- Información de disponibilidad en tiempo real

**RF003.4.2** El sistema debe incluir búsqueda avanzada
- Búsqueda por título, autor, ISBN
- Filtros por editorial, año, categoría
- Búsqueda combinada con múltiples criterios
- Sugerencias automáticas durante búsqueda

---

## RF004. GESTIÓN DE PRÉSTAMOS

### RF004.1. Creación de Préstamos
**Actor:** Administrador  
**Prioridad:** Alta  
**Estado:** ✅ Implementado

**RF004.1.1** El sistema debe validar requisitos previos
- Verificación de disponibilidad de ejemplares
- Verificación de ausencia de sanciones del usuario
- Verificación de límite de préstamos simultáneos (máximo 3)
- Verificación de estado activo del usuario

**RF004.1.2** El sistema debe registrar préstamo completo
- Asignación automática de fecha límite (7 días por defecto)
- Registro de usuario responsable del préstamo
- Asignación específica de ejemplar
- Generación de estado "ACTIVO"

**RF004.1.3** El sistema debe actualizar estados automáticamente
- Cambio de estado de ejemplar a "PRESTADO"
- Actualización de contadores de disponibilidad
- Cancelación automática de reservas del mismo usuario
- Generación de comprobante de préstamo

### RF004.2. Devolución de Préstamos
**RF004.2.1** El sistema debe procesar devoluciones
- Búsqueda de préstamo por código o usuario
- Registro de fecha real de devolución
- Verificación de estado del ejemplar devuelto
- Cálculo automático de días de atraso

**RF004.2.2** El sistema debe manejar atrasos automáticamente
- Cálculo de días de atraso
- Generación automática de sanción por atraso
- Aplicación de multa según reglamento
- Notificación al usuario de sanción aplicada

### RF004.3. Consulta de Préstamos
**RF004.3.1** El sistema debe mostrar préstamos según rol
- Administradores: todos los préstamos del sistema
- Estudiantes: solo sus préstamos personales
- Filtros por estado, fecha, usuario
- Ordenamiento múltiple

**RF004.3.2** El sistema debe calcular estadísticas
- Préstamos activos, devueltos, vencidos
- Días promedio de préstamo
- Libros más prestados
- Usuarios con más préstamos

### RF004.4. Renovación de Préstamos
**RF004.4.1** El sistema debe permitir extensión de préstamos
- Verificación de ausencia de reservas pendientes
- Verificación de ausencia de sanciones
- Límite de renovaciones por préstamo (máximo 2)
- Extensión de 7 días adicionales por renovación

---

## RF005. GESTIÓN DE RESERVAS

### RF005.1. Creación de Reservas
**Actor:** Estudiante  
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RF005.1.1** El sistema debe permitir reservas cuando no hay disponibilidad
- Verificación de ausencia de ejemplares disponibles
- Verificación de ausencia de reserva previa del mismo usuario
- Verificación de ausencia de sanciones activas
- Registro automático con estado "PENDIENTE"

**RF005.1.2** El sistema debe gestionar lista de espera
- Orden cronológico de reservas (FIFO)
- Notificación automática cuando se libere ejemplar
- Tiempo límite para confirmar reserva (24 horas)
- Cancelación automática si no se confirma

### RF005.2. Gestión Administrativa de Reservas
**Actor:** Administrador
**RF005.2.1** El sistema debe permitir aprobación/rechazo
- Lista de reservas pendientes para revisión
- Aprobación manual de reservas
- Rechazo con motivo específico
- Conversión directa de reserva a préstamo

**RF005.2.2** El sistema debe notificar cambios de estado
- Notificación de aprobación al estudiante
- Notificación de rechazo con motivo
- Recordatorios de reservas por vencer
- Notificación de conversión a préstamo

### RF005.3. Consulta de Reservas
**RF005.3.1** El sistema debe mostrar reservas según rol
- Administradores: todas las reservas del sistema
- Estudiantes: solo sus reservas personales
- Estados: pendiente, aprobada, rechazada, convertida
- Historial completo de reservas

---

## RF006. GESTIÓN DE SANCIONES

### RF006.1. Generación Automática de Sanciones
**Actor:** Sistema  
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RF006.1.1** El sistema debe detectar automáticamente préstamos vencidos
- Ejecución diaria de verificación de vencimientos
- Cálculo automático de días de atraso
- Generación automática de sanción por atraso
- Aplicación de multa según días de atraso (S/. 1.00 por día)

**RF006.1.2** El sistema debe aplicar restricciones automáticas
- Bloqueo de nuevos préstamos para usuarios sancionados
- Bloqueo de reservas para usuarios sancionados
- Notificación automática al usuario sancionado
- Registro de fecha y motivo de sanción

### RF006.2. Gestión Manual de Sanciones
**Actor:** Administrador
**RF006.2.1** El sistema debe permitir gestión manual
- Creación manual de sanciones por otros motivos
- Modificación de montos de multa
- Levantamiento de sanciones con justificación
- Aplicación de sanciones por daños a ejemplares

### RF006.3. Consulta de Sanciones
**RF006.3.1** El sistema debe mostrar sanciones según rol
- Administradores: todas las sanciones del sistema
- Estudiantes: solo sus sanciones personales
- Estados: activa, pagada, perdonada
- Cálculo de montos totales por usuario

---

## RF007. CATÁLOGO PÚBLICO

### RF007.1. Consulta Pública del Catálogo
**Actor:** Estudiante  
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RF007.1.1** El sistema debe mostrar catálogo completo
- Listado de todos los libros disponibles
- Información básica: título, autor, editorial, año
- Estado de disponibilidad en tiempo real
- Búsqueda y filtros múltiples

**RF007.1.2** El sistema debe permitir búsqueda avanzada
- Búsqueda por título, autor, ISBN
- Filtros por categoría, editorial, año
- Búsqueda por palabras clave en descripción
- Ordenamiento por relevancia o alfabético

### RF007.2. Funcionalidades para Estudiantes
**RF007.2.1** El sistema debe permitir reservas directas desde catálogo
- Botón de reservar cuando no hay disponibilidad
- Verificación automática de requisitos
- Confirmación inmediata de reserva creada
- Información de posición en lista de espera

---

## RF008. PANEL PERSONAL ESTUDIANTE

### RF008.1. Información Personal
**Actor:** Estudiante  
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RF008.1.1** El sistema debe mostrar perfil completo
- Información personal y de contacto
- Datos académicos (carrera, ciclo)
- Fecha de registro en el sistema
- Estado actual de la cuenta

### RF008.2. Historial de Actividades
**RF008.2.1** El sistema debe mostrar historial completo
- Lista de préstamos (activos y históricos)
- Lista de reservas (pendientes y histórico)
- Lista de sanciones (activas e históricas)
- Estadísticas personales de uso

**RF008.2.2** El sistema debe calcular estadísticas personales
- Número total de préstamos realizados
- Libros favoritos (más prestados)
- Tiempo promedio de préstamos
- Estado de cumplimiento (porcentaje de atrasos)

---

## RF009. REPORTES Y ESTADÍSTICAS

### RF009.1. Reportes de Usuarios
**Actor:** Administrador  
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RF009.1.1** El sistema debe generar reportes de usuarios
- Reporte de usuarios registrados por período
- Estadísticas por tipo de usuario (admin/estudiante)
- Usuarios más activos
- Usuarios con sanciones

**RF009.1.2** El sistema debe permitir filtros temporales
- Reportes por día, semana, mes, año
- Comparativas entre períodos
- Tendencias de crecimiento
- Exportación en PDF y Excel

### RF009.2. Reportes de Préstamos
**RF009.2.1** El sistema debe generar reportes de préstamos
- Préstamos por período específico
- Libros más prestados
- Usuarios con más préstamos
- Análisis de días promedio de préstamo

**RF009.2.2** El sistema debe generar reportes de cumplimiento
- Porcentaje de préstamos devueltos a tiempo
- Lista de usuarios morosos
- Análisis de sanciones aplicadas
- Recuperación de multas

### RF009.3. Estadísticas Generales
**RF009.3.1** El sistema debe calcular indicadores clave (KPIs)
- Número total de libros en catálogo
- Porcentaje de utilización de ejemplares
- Tiempo promedio de rotación de libros
- Eficiencia del sistema de reservas

---

## RF010. GESTIÓN DE DATOS MAESTROS

### RF010.1. Gestión de Autores
**Actor:** Administrador  
**Prioridad:** Baja  
**Estado:** ✅ Implementado

**RF010.1.1** El sistema debe permitir gestión completa de autores
- Crear, editar y eliminar autores
- Información biográfica completa
- Asociación con múltiples libros
- Validación de unicidad

### RF010.2. Gestión de Editoriales
**RF010.2.1** El sistema debe permitir gestión completa de editoriales
- Crear, editar y eliminar editoriales
- Información de contacto completa
- País de origen
- Asociación con múltiples libros

### RF010.3. Gestión de Estados del Sistema
**RF010.3.1** El sistema debe mantener estados consistentes
- Estados de libros: disponible, prestado, reservado, dañado
- Estados de préstamos: activo, devuelto, vencido
- Estados de reservas: pendiente, aprobada, rechazada
- Estados de personas: activo, inactivo, sancionado

---

## MATRIZ DE TRAZABILIDAD

| ID Requerimiento | Casos de Uso Relacionados | Prioridad | Estado | Actores |
|---|---|---|---|---|
| RF001 | CU001, CU002 | Alta | ✅ | Admin, Estudiante |
| RF002 | CU003, CU004 | Alta | ✅ | Administrador |
| RF003 | CU005, CU006 | Alta | ✅ | Administrador |
| RF004 | CU007, CU008 | Alta | ✅ | Admin, Estudiante |
| RF005 | CU009, CU010 | Media | ✅ | Admin, Estudiante |
| RF006 | CU011, CU012 | Media | ✅ | Admin, Sistema |
| RF007 | CU013 | Media | ✅ | Estudiante |
| RF008 | CU014 | Media | ✅ | Estudiante |
| RF009 | CU015, CU016 | Media | ✅ | Administrador |
| RF010 | CU017, CU018 | Baja | ✅ | Administrador |

---

## NOTAS DE IMPLEMENTACIÓN

### Tecnologías Utilizadas
- **Framework:** Spring Boot 3.5.3
- **Base de Datos:** PostgreSQL con JPA/Hibernate
- **Seguridad:** Spring Security + BCrypt
- **Frontend:** Thymeleaf + Bootstrap 5
- **Arquitectura:** Patrón MVC + Repository

### Consideraciones Especiales
- Todos los requerimientos están implementados en el sistema actual
- La seguridad se maneja mediante roles y sesiones
- Los datos se validan tanto en frontend como backend
- El sistema mantiene integridad referencial en base de datos
- Se implementa auditoría automática de acciones críticas

---

**Fecha de Elaboración:** Noviembre 2025  
**Versión del Documento:** 1.0  
**Estado:** Completo - Todos los RF Implementados