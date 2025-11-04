# REQUERIMIENTOS FUNCIONALES
## SISTEMA DE GESTIÓN DE BIBLIOTECA UNFV

### RF1. AUTENTICACIÓN Y AUTORIZACIÓN

**RF1.1** El sistema debe permitir el inicio de sesión de usuarios
- **RF1.1.1** El sistema debe validar credenciales (correo y contraseña)
- **RF1.1.2** El sistema debe mostrar mensajes de error por credenciales incorrectas
- **RF1.1.3** El sistema debe crear sesiones de usuario autenticado
- **RF1.1.4** El sistema debe redirigir según el rol del usuario (ADMIN/ALUMNO)

**RF1.2** El sistema debe permitir el cierre de sesión
- **RF1.2.1** El sistema debe cerrar la sesión activa del usuario
- **RF1.2.2** El sistema debe redirigir al login tras el logout

**RF1.3** El sistema debe controlar el acceso por roles
- **RF1.3.1** Solo los administradores pueden acceder al panel de administración
- **RF1.3.2** Los alumnos solo pueden acceder al portal estudiantil
- **RF1.3.3** El sistema debe verificar la sesión activa en páginas protegidas

### RF2. GESTIÓN DE USUARIOS (Solo Administrador)

**RF2.1** El sistema debe permitir el registro de nuevos usuarios
- **RF2.1.1** El sistema debe permitir crear usuarios con roles ADMIN o ALUMNO
- **RF2.1.2** El sistema debe validar que el correo electrónico sea único
- **RF2.1.3** El sistema debe validar que el DNI de la persona sea único
- **RF2.1.4** El sistema debe encriptar la contraseña antes de almacenar
- **RF2.1.5** El sistema debe crear automáticamente el registro de persona asociado

**RF2.2** El sistema debe permitir la modificación de usuarios existentes
- **RF2.2.1** El sistema debe permitir buscar usuarios por nombre, correo o DNI
- **RF2.2.2** El sistema debe permitir editar datos personales y de contacto
- **RF2.2.3** El sistema debe permitir cambiar el estado activo/inactivo
- **RF2.2.4** El sistema debe validar unicidad al modificar correo o DNI

**RF2.3** El sistema debe permitir la consulta de usuarios
- **RF2.3.1** El sistema debe mostrar listado de usuarios registrados
- **RF2.3.2** El sistema debe permitir filtrar por rol, estado o criterio de búsqueda
- **RF2.3.3** El sistema debe mostrar información detallada de cada usuario
- **RF2.3.4** El sistema debe mostrar estadísticas de usuarios por tipo

**RF2.4** El sistema debe permitir la eliminación de usuarios
- **RF2.4.1** El sistema debe verificar que el usuario no tenga préstamos activos
- **RF2.4.2** El sistema debe solicitar confirmación antes de eliminar
- **RF2.4.3** El sistema debe marcar como inactivo en lugar de eliminar físicamente
- **RF2.4.4** El sistema debe mantener la trazabilidad de usuarios eliminados

### RF3. GESTIÓN DE LIBROS (Solo Administrador)

**RF3.1** El sistema debe permitir el registro de libros
- **RF3.1.1** El sistema debe permitir ingresar datos básicos del libro (ISBN, título, edición)
- **RF3.1.2** El sistema debe permitir asociar autores existentes o crear nuevos
- **RF3.1.3** El sistema debe permitir seleccionar editorial existente o crear nueva
- **RF3.1.4** El sistema debe validar que el ISBN sea único si se proporciona
- **RF3.1.5** El sistema debe permitir especificar número de páginas y fecha de publicación

**RF3.2** El sistema debe permitir la modificación de libros
- **RF3.2.1** El sistema debe permitir buscar libros por título, ISBN o autor
- **RF3.2.2** El sistema debe permitir editar toda la información del libro
- **RF3.2.3** El sistema debe permitir agregar o quitar autores
- **RF3.2.4** El sistema debe mantener la integridad referencial con ejemplares

**RF3.3** El sistema debe permitir la gestión de ejemplares
- **RF3.3.1** El sistema debe permitir agregar ejemplares físicos de libros
- **RF3.3.2** El sistema debe asignar códigos únicos a cada ejemplar
- **RF3.3.3** El sistema debe controlar el estado de cada ejemplar (disponible, prestado, reservado)
- **RF3.3.4** El sistema debe permitir marcar ejemplares como dañados o perdidos

**RF3.4** El sistema debe permitir la consulta del catálogo
- **RF3.4.1** El sistema debe mostrar listado completo de libros
- **RF3.4.2** El sistema debe permitir filtrar por título, autor, editorial o categoría
- **RF3.4.3** El sistema debe mostrar disponibilidad de ejemplares
- **RF3.4.4** El sistema debe proporcionar vista detallada de cada libro

### RF4. GESTIÓN DE PRÉSTAMOS (Administrador y Alumno)

**RF4.1** El sistema debe permitir el registro de préstamos (Solo Administrador)
- **RF4.1.1** El sistema debe verificar disponibilidad de ejemplares antes del préstamo
- **RF4.1.2** El sistema debe verificar que el usuario no tenga sanciones activas
- **RF4.1.3** El sistema debe establecer fecha límite de devolución (7 días por defecto)
- **RF4.1.4** El sistema debe actualizar el estado del ejemplar a "PRESTADO"
- **RF4.1.5** El sistema debe generar el registro del préstamo con estado "ACTIVO"

**RF4.2** El sistema debe permitir la devolución de préstamos (Solo Administrador)
- **RF4.2.1** El sistema debe permitir buscar préstamos por usuario o libro
- **RF4.2.2** El sistema debe registrar la fecha de devolución
- **RF4.2.3** El sistema debe actualizar el estado del ejemplar a "DISPONIBLE"
- **RF4.2.4** El sistema debe cambiar el estado del préstamo a "DEVUELTO"
- **RF4.2.5** El sistema debe verificar si hay atraso y generar sanción automáticamente

**RF4.3** El sistema debe permitir la consulta de préstamos
- **RF4.3.1** Administradores pueden ver todos los préstamos del sistema
- **RF4.3.2** Alumnos solo pueden ver sus propios préstamos
- **RF4.3.3** El sistema debe mostrar préstamos activos, devueltos y vencidos
- **RF4.3.4** El sistema debe permitir filtrar por usuario, libro o estado
- **RF4.3.5** El sistema debe calcular días de atraso para préstamos vencidos

**RF4.4** El sistema debe permitir la renovación de préstamos
- **RF4.4.1** El sistema debe permitir extender la fecha límite si no hay reservas
- **RF4.4.2** El sistema debe verificar que no existan sanciones del usuario
- **RF4.4.3** El sistema debe limitar el número de renovaciones por préstamo

### RF5. GESTIÓN DE RESERVAS

**RF5.1** El sistema debe permitir crear reservas (Alumno y Administrador)
- **RF5.1.1** Los alumnos pueden reservar libros cuando no hay ejemplares disponibles
- **RF5.1.2** El sistema debe verificar que el usuario no tenga el libro ya prestado
- **RF5.1.3** El sistema debe verificar que el usuario no tenga sanciones activas
- **RF5.1.4** El sistema debe crear la reserva con estado "PENDIENTE"
- **RF5.1.5** El sistema debe validar stock disponible antes de permitir reservar

**RF5.2** El sistema debe permitir gestionar reservas (Solo Administrador)
- **RF5.2.1** El sistema debe permitir aprobar reservas pendientes
- **RF5.2.2** El sistema debe permitir rechazar reservas con motivo
- **RF5.2.3** El sistema debe permitir convertir reservas aprobadas en préstamos
- **RF5.2.4** El sistema debe notificar cambios de estado al usuario

**RF5.3** El sistema debe permitir consultar reservas
- **RF5.3.1** Administradores pueden ver todas las reservas del sistema
- **RF5.3.2** Alumnos solo pueden ver sus propias reservas
- **RF5.3.3** El sistema debe mostrar reservas por estado (pendiente, aprobada, rechazada)
- **RF5.3.4** El sistema debe permitir filtrar por usuario o libro

**RF5.4** El sistema debe permitir cancelar reservas
- **RF5.4.1** Los alumnos pueden cancelar sus reservas pendientes
- **RF5.4.2** Los administradores pueden cancelar cualquier reserva
- **RF5.4.3** El sistema debe actualizar el estado a "CANCELADA"

### RF6. GESTIÓN DE SANCIONES (Solo Administrador)

**RF6.1** El sistema debe generar sanciones automáticamente
- **RF6.1.1** El sistema debe crear sanción por atraso en devolución
- **RF6.1.2** El sistema debe calcular días de sanción según días de atraso
- **RF6.1.3** El sistema debe establecer fecha de inicio y fin de la sanción
- **RF6.1.4** El sistema debe asociar la sanción al préstamo correspondiente

**RF6.2** El sistema debe permitir gestionar sanciones manualmente
- **RF6.2.1** El sistema debe permitir crear sanciones por otros motivos
- **RF6.2.2** El sistema debe permitir modificar observaciones de sanciones
- **RF6.2.3** El sistema debe permitir levantar sanciones antes del tiempo
- **RF6.2.4** El sistema debe permitir extender el período de sanción

**RF6.3** El sistema debe permitir consultar sanciones
- **RF6.3.1** Administradores pueden ver todas las sanciones del sistema
- **RF6.3.2** Alumnos solo pueden ver sus propias sanciones
- **RF6.3.3** El sistema debe mostrar sanciones activas, cumplidas y canceladas
- **RF6.3.4** El sistema debe permitir filtrar por usuario o período

**RF6.4** El sistema debe verificar sanciones activas
- **RF6.4.1** El sistema debe bloquear nuevos préstamos a usuarios sancionados
- **RF6.4.2** El sistema debe bloquear nuevas reservas a usuarios sancionados
- **RF6.4.3** El sistema debe mostrar advertencias de sanciones en la interfaz

### RF7. CATÁLOGO PÚBLICO (Alumno)

**RF7.1** El sistema debe proporcionar búsqueda en el catálogo
- **RF7.1.1** El sistema debe permitir búsqueda por título, autor o ISBN
- **RF7.1.2** El sistema debe mostrar resultados con información básica
- **RF7.1.3** El sistema debe mostrar disponibilidad en tiempo real
- **RF7.1.4** El sistema debe permitir filtros por editorial o categoría

**RF7.2** El sistema debe mostrar detalles de libros
- **RF7.2.1** El sistema debe mostrar información completa del libro
- **RF7.2.2** El sistema debe mostrar autores y editorial
- **RF7.2.3** El sistema debe mostrar número de ejemplares disponibles
- **RF7.2.4** El sistema debe permitir reservar si hay stock

**RF7.3** El sistema debe proporcionar navegación intuitiva
- **RF7.3.1** El sistema debe mostrar libros más populares
- **RF7.3.2** El sistema debe mostrar nuevas adquisiciones
- **RF7.3.3** El sistema debe proporcionar paginación de resultados
- **RF7.3.4** El sistema debe mantener el historial de búsquedas

### RF8. PANEL PERSONAL (Alumno)

**RF8.1** El sistema debe mostrar resumen personal
- **RF8.1.1** El sistema debe mostrar préstamos actuales
- **RF8.1.2** El sistema debe mostrar reservas pendientes
- **RF8.1.3** El sistema debe mostrar sanciones activas
- **RF8.1.4** El sistema debe mostrar fechas límite próximas

**RF8.2** El sistema debe permitir gestión personal
- **RF8.2.1** El sistema debe permitir ver perfil personal
- **RF8.2.2** El sistema debe permitir actualizar datos de contacto
- **RF8.2.3** El sistema debe mostrar historial de préstamos
- **RF8.2.4** El sistema debe permitir cancelar reservas propias

### RF9. REPORTES Y ESTADÍSTICAS (Solo Administrador)

**RF9.1** El sistema debe generar reportes de usuarios
- **RF9.1.1** El sistema debe generar reporte de usuarios registrados
- **RF9.1.2** El sistema debe mostrar estadísticas por tipo de usuario
- **RF9.1.3** El sistema debe permitir filtrar por período de registro
- **RF9.1.4** El sistema debe exportar reportes en formato PDF

**RF9.2** El sistema debe generar reportes de préstamos
- **RF9.2.1** El sistema debe generar reporte de préstamos por período
- **RF9.2.2** El sistema debe mostrar estadísticas de devoluciones
- **RF9.2.3** El sistema debe identificar libros más prestados
- **RF9.2.4** El sistema debe mostrar usuarios con más préstamos

**RF9.3** El sistema debe generar reportes de sanciones
- **RF9.3.1** El sistema debe generar reporte de sanciones por período
- **RF9.3.2** El sistema debe mostrar usuarios con más sanciones
- **RF9.3.3** El sistema debe calcular estadísticas de cumplimiento
- **RF9.3.4** El sistema debe identificar patrones de incumplimiento

**RF9.4** El sistema debe proporcionar dashboard administrativo
- **RF9.4.1** El sistema debe mostrar métricas en tiempo real
- **RF9.4.2** El sistema debe mostrar alertas de préstamos vencidos
- **RF9.4.3** El sistema debe mostrar reservas pendientes de aprobación
- **RF9.4.4** El sistema debe mostrar estadísticas de uso del sistema

### RF10. GESTIÓN DE DATOS MAESTROS (Solo Administrador)

**RF10.1** El sistema debe permitir gestionar autores
- **RF10.1.1** El sistema debe permitir crear, editar y eliminar autores
- **RF10.1.2** El sistema debe mantener biografía e información adicional
- **RF10.1.3** El sistema debe asociar autores con múltiples libros
- **RF10.1.4** El sistema debe validar unicidad de autores

**RF10.2** El sistema debe permitir gestionar editoriales
- **RF10.2.1** El sistema debe permitir crear, editar y eliminar editoriales
- **RF10.2.2** El sistema debe mantener información de contacto
- **RF10.2.3** El sistema debe asociar editoriales con múltiples libros
- **RF10.2.4** El sistema debe mantener país de origen

**RF10.3** El sistema debe gestionar estados del sistema
- **RF10.3.1** El sistema debe mantener estados de libros (disponible, prestado, reservado)
- **RF10.3.2** El sistema debe mantener estados de préstamos (activo, devuelto, vencido)
- **RF10.3.3** El sistema debe mantener estados de reservas (pendiente, aprobada, rechazada)
- **RF10.3.4** El sistema debe mantener estados de personas (activo, inactivo, sancionado)