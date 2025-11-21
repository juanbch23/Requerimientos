# Diagramas de Secuencia - Casos de Uso Principales

## CU01: Iniciar Sesión

```plantuml
@startuml
title CU01: Iniciar Sesión de Usuario

actor "Usuario" as U
participant "Controlador\nAutenticación" as CA
participant "UsuarioService" as US
participant "Base de Datos\nPostgreSQL" as BD
participant "HttpSession" as HS

U -> CA: Accede a /auth/login
CA -> U: Muestra formulario de login

U -> CA: Ingresa correo y contraseña
CA -> CA: Valida campos no vacíos
CA -> CA: Valida formato de correo

alt Validación exitosa
    CA -> US: autenticarUsuario(correo, password)
    US -> BD: Buscar usuario por correo
    BD -> US: Datos del usuario
    
    alt Usuario encontrado y activo
        US -> US: Verificar contraseña BCrypt
        
        alt Contraseña correcta
            US -> CA: Usuario autenticado
            CA -> HS: Crear sesión
            HS -> CA: Sesión creada
            
            alt Rol ADMIN
                CA -> U: Redirige a /admin/dashboard
            else Rol ALUMNO
                CA -> U: Redirige a /alumno/dashboard
            end
            
        else Contraseña incorrecta
            US -> CA: Error de autenticación
            CA -> U: "Usuario o contraseña incorrectos"
        end
        
    else Usuario no encontrado o inactivo
        US -> CA: Error de autenticación
        CA -> U: "Usuario o contraseña incorrectos"
    end
    
else Validación fallida
    CA -> U: Mensaje de error de validación
end

@enduml
```

## CU02: Registrar Usuario

```plantuml
@startuml
title CU02: Registrar Usuario

actor "Administrador" as A
participant "ControladorGestión\nUsuarios" as CGU
participant "UsuarioService" as US
participant "PersonaRepository" as PR
participant "UsuarioRepository" as UR
participant "BCryptEncoder" as BC
participant "Base de Datos\nPostgreSQL" as BD

A -> CGU: Selecciona "Gestionar Usuarios"
CGU -> A: Muestra lista usuarios + "Crear Usuario"

A -> CGU: Hace clic "Crear Usuario"
CGU -> A: Muestra formulario de registro

A -> CGU: Ingresa datos personales y de usuario
CGU -> CGU: Valida campos obligatorios
CGU -> CGU: Valida formato de datos

alt Validación exitosa
    CGU -> US: crearUsuario(datosPersona, datosUsuario)
    
    US -> PR: existsByDni(dni)
    PR -> BD: SELECT * FROM PERSONA WHERE dni = ?
    BD -> PR: Resultado consulta
    PR -> US: boolean existe
    
    alt DNI no existe
        US -> UR: existsByCorreo(correo)
        UR -> BD: SELECT * FROM USUARIO WHERE correo = ?
        BD -> UR: Resultado consulta
        UR -> US: boolean existe
        
        alt Correo no existe
            US -> BC: encode(contraseña)
            BC -> US: contraseñaEncriptada
            
            US -> PR: save(nuevaPersona)
            PR -> BD: INSERT INTO PERSONA
            BD -> PR: persona guardada
            
            US -> UR: save(nuevoUsuario)
            UR -> BD: INSERT INTO USUARIO
            BD -> UR: usuario guardado
            
            US -> CGU: Usuario creado exitosamente
            CGU -> A: "Usuario creado exitosamente"
            CGU -> A: Actualiza lista de usuarios
            
        else Correo ya existe
            US -> CGU: Error - correo duplicado
            CGU -> A: "El correo ya está registrado"
        end
        
    else DNI ya existe
        US -> CGU: Error - DNI duplicado
        CGU -> A: "El DNI ya está registrado"
    end
    
else Validación fallida
    CGU -> A: Mensajes de error específicos
end

@enduml
```

## CU03: Gestionar Libros

```plantuml
@startuml
title CU03: Gestionar Libros

actor "Administrador" as A
participant "ControladorGestión\nLibros" as CGL
participant "LibroService" as LS
participant "LibroRepository" as LR
participant "EjemplarService" as EjS
participant "Base de Datos\nPostgreSQL" as BD

A -> CGL: Selecciona "Gestionar Libros"
CGL -> LR: findAll()
LR -> BD: SELECT * FROM LIBRO
BD -> LR: Lista de libros
LR -> CGL: Lista de libros
CGL -> A: Muestra interfaz con lista de libros

alt Crear Libro
    A -> CGL: Selecciona "Crear Libro"
    CGL -> A: Muestra formulario de creación
    
    A -> CGL: Ingresa datos del libro
    CGL -> CGL: Valida campos obligatorios
    
    alt ISBN proporcionado
        CGL -> LS: verificarISBNUnico(isbn)
        LS -> LR: existsByIsbn(isbn)
        LR -> BD: SELECT COUNT(*) FROM LIBRO WHERE isbn = ?
        BD -> LR: Resultado
        LR -> LS: boolean existe
        
        alt ISBN único
            LS -> CGL: ISBN válido
        else ISBN duplicado
            LS -> CGL: Error - ISBN duplicado
            CGL -> A: "ISBN ya registrado"
        end
    end
    
    alt Validación exitosa
        CGL -> LS: crearLibro(datosLibro)
        LS -> LR: save(nuevoLibro)
        LR -> BD: INSERT INTO LIBRO
        BD -> LR: libro guardado
        LS -> CGL: Libro creado exitosamente
        CGL -> A: "Libro creado exitosamente"
    end

else Gestionar Ejemplares
    A -> CGL: Selecciona libro y "Gestionar Ejemplares"
    CGL -> EjS: obtenerEjemplaresPorLibro(libroId)
    EjS -> BD: SELECT * FROM EJEMPLAR WHERE libro_id = ?
    BD -> EjS: Lista de ejemplares
    EjS -> CGL: Lista de ejemplares
    CGL -> A: Interfaz de gestión de ejemplares
end

@enduml
```

## CU04: Gestionar Préstamos

```plantuml
@startuml
title CU04: Gestionar Préstamos

actor "Administrador" as A
participant "ControladorGestión\nPréstamos" as CGP
participant "PrestamoService" as PS
participant "SancionService" as SS
participant "EjemplarService" as ES
participant "UsuarioService" as US
participant "Base de Datos\nPostgreSQL" as BD

A -> CGP: Selecciona "Gestionar Préstamos"
CGP -> A: Muestra interfaz con opciones

alt Crear Préstamo
    A -> CGP: Selecciona "Nuevo Préstamo"
    CGP -> A: Formulario de búsqueda de usuario
    
    A -> CGP: Busca usuario por DNI/correo
    CGP -> US: buscarUsuario(criterio)
    US -> BD: SELECT * FROM USUARIO u JOIN PERSONA p WHERE...
    BD -> US: Datos del usuario
    US -> CGP: Usuario encontrado
    
    CGP -> SS: verificarSancionesActivas(usuarioId)
    SS -> BD: SELECT * FROM SANCION WHERE persona_id = ? AND estado = 1
    BD -> SS: Lista de sanciones
    SS -> CGP: boolean tieneSanciones
    
    alt Sin sanciones activas
        A -> CGP: Busca libro por criterio
        CGP -> ES: buscarEjemplaresDisponibles(libroId)
        ES -> BD: SELECT * FROM EJEMPLAR WHERE libro_id = ? AND estado = 'DISPONIBLE'
        BD -> ES: Lista ejemplares disponibles
        ES -> CGP: Ejemplares disponibles
        
        alt Ejemplares disponibles
            A -> CGP: Selecciona ejemplar y confirma
            CGP -> PS: crearPrestamo(usuarioId, ejemplarId)
            PS -> PS: calcularFechaLimite()
            PS -> BD: INSERT INTO PRESTAMO
            BD -> PS: préstamo creado
            PS -> CGP: Préstamo creado exitosamente
            CGP -> A: "Préstamo registrado exitosamente"
        end
    end

else Registrar Devolución
    A -> CGP: Selecciona "Registrar Devolución"
    CGP -> A: Formulario búsqueda préstamo
    A -> CGP: Busca préstamo activo
    CGP -> PS: buscarPrestamosActivos(criterio)
    PS -> BD: SELECT * FROM PRESTAMO WHERE estado = 'ACTIVO'
    BD -> PS: Lista préstamos activos
    PS -> CGP: Préstamos activos
    
    A -> CGP: Selecciona préstamo y confirma devolución
    CGP -> PS: registrarDevolucion(prestamoId)
    PS -> PS: calcularAtraso()
    
    alt Con atraso
        PS -> SS: crearSancionPorAtraso(prestamoId, diasAtraso)
        SS -> BD: INSERT INTO SANCION
        BD -> SS: sanción creada
    end
    
    PS -> BD: UPDATE PRESTAMO SET estado = 'DEVUELTO'
    BD -> PS: confirmación
    PS -> CGP: Devolución procesada
    CGP -> A: "Devolución registrada exitosamente"
end

@enduml
```

## CU05: Gestionar Sanciones

```plantuml
@startuml
title CU05: Gestionar Sanciones

actor "Administrador" as A
participant "ControladorGestión\nSanciones" as CGS
participant "SancionService" as SS
participant "UsuarioService" as US
participant "SancionRepository" as SR
participant "Base de Datos\nPostgreSQL" as BD

A -> CGS: Selecciona "Gestionar Sanciones"
CGS -> SR: findAll()
SR -> BD: SELECT * FROM SANCION s JOIN PERSONA p
BD -> SR: Lista completa de sanciones
SR -> CGS: Sanciones con datos de usuarios
CGS -> A: Interfaz con lista de sanciones

alt Crear Sanción Manual
    A -> CGS: Selecciona "Crear Sanción"
    CGS -> A: Formulario de nueva sanción
    
    A -> CGS: Busca usuario para sancionar
    CGS -> US: buscarUsuario(criterio)
    US -> BD: SELECT u.*, p.* FROM USUARIO u JOIN PERSONA p
    BD -> US: Datos del usuario
    US -> CGS: Usuario encontrado
    CGS -> A: Datos usuario + formulario sanción
    
    A -> CGS: Ingresa motivo, fechas y observaciones
    CGS -> CGS: Valida fechas coherentes
    CGS -> CGS: Valida motivo no vacío
    
    alt Validación exitosa
        CGS -> SS: crearSancionManual(usuarioId, motivo, fechas, observaciones)
        SS -> SR: save(nuevaSancion)
        SR -> BD: INSERT INTO SANCION
        BD -> SR: sanción creada
        SS -> US: actualizarEstadoUsuario(usuarioId, "SANCIONADO")
        US -> BD: UPDATE USUARIO SET estado_sancion = true
        BD -> US: confirmación
        SS -> CGS: Sanción creada exitosamente
        CGS -> A: "Sanción creada exitosamente"
    end

else Levantar Sanción
    A -> CGS: Selecciona sanción activa y "Levantar"
    CGS -> A: Formulario de confirmación con campo motivo
    A -> CGS: Ingresa motivo de levantamiento y confirma
    CGS -> SS: levantarSancion(sancionId, motivoLevantamiento)
    
    SS -> SR: findById(sancionId)
    SR -> BD: SELECT * FROM SANCION WHERE id = ?
    BD -> SR: Datos sanción
    SR -> SS: Sanción encontrada
    
    alt Sanción está activa
        SS -> SR: actualizarEstado(sancionId, "CANCELADA", motivo)
        SR -> BD: UPDATE SANCION SET estado = 2, motivo_cancelacion = ?
        BD -> SR: confirmación
        SS -> US: liberarUsuario(usuarioId)
        US -> BD: UPDATE USUARIO SET estado_sancion = false
        BD -> US: confirmación
        SS -> CGS: Sanción levantada exitosamente
        CGS -> A: "Sanción levantada exitosamente"
    end
end

@enduml
```

## CU06: Consultar Catálogo de Libros

```plantuml
@startuml
title CU06: Consultar Catálogo de Libros

actor "Estudiante" as E
participant "ControladorCatálogo\nAlumno" as CCA
participant "LibroService" as LS
participant "ReservaService" as RS
participant "SancionService" as SS
participant "LibroRepository" as LR
participant "Base de Datos\nPostgreSQL" as BD

E -> CCA: Selecciona "Catálogo de Libros"
CCA -> LS: obtenerLibrosDestacados()
LS -> LR: findLibrosDestacados()
LR -> BD: SELECT * FROM LIBRO ORDER BY popularidad LIMIT 10
BD -> LR: Lista de libros destacados
LR -> LS: Libros destacados
LS -> CCA: Libros para mostrar
CCA -> E: Interfaz catálogo con libros destacados

alt Búsqueda de Libros
    E -> CCA: Ingresa términos de búsqueda
    CCA -> LS: buscarLibros(terminos, filtros)
    LS -> LR: findByTituloOrAutorContaining(terminos)
    LR -> BD: SELECT l.*, a.nombres, e.nombre, COUNT(ej.id) as disponibles FROM LIBRO l...
    BD -> LR: Resultados con disponibilidad
    LR -> LS: Lista de libros encontrados
    LS -> CCA: Resultados con metadata
    CCA -> E: Lista paginada de resultados

else Ver Detalles de Libro
    E -> CCA: Selecciona libro específico
    CCA -> LS: obtenerDetalleLibro(libroId)
    LS -> LR: findByIdWithAutoresAndEditorial(libroId)
    LR -> BD: SELECT l.*, a.nombres, e.nombre, ej.* FROM LIBRO l JOIN...
    BD -> LR: Datos completos del libro
    LR -> LS: Libro con detalles completos
    LS -> CCA: Información completa del libro
    CCA -> E: Página de detalles del libro
    
    alt Intentar Reservar
        E -> CCA: Selecciona "Reservar Libro"
        CCA -> SS: verificarSancionesActivas(estudianteId)
        SS -> BD: SELECT * FROM SANCION WHERE persona_id = ? AND estado = 1
        BD -> SS: Sanciones activas
        SS -> CCA: Estado de sanciones
        
        alt Sin sanciones activas
            CCA -> RS: verificarReservaExistente(estudianteId, libroId)
            RS -> BD: SELECT * FROM RESERVA WHERE persona_id = ? AND libro_id = ?
            BD -> RS: Reservas existentes
            RS -> CCA: Estado de reservas
            
            alt Sin reservas/préstamos existentes
                CCA -> RS: crearReserva(estudianteId, libroId)
                RS -> BD: INSERT INTO RESERVA (persona_id, libro_id, fecha_reserva, estado)
                BD -> RS: Reserva creada
                RS -> CCA: Confirmación con número de reserva
                CCA -> E: "Reserva creada exitosamente - #123"
            end
        end
    end
end

@enduml
```

## CU07: Gestionar Mis Préstamos (Estudiante)

```plantuml
@startuml
title CU07: Gestionar Mis Préstamos (Estudiante)

actor "Estudiante" as E
participant "ControladorPréstamos\nAlumno" as CPA
participant "PrestamoService" as PS
participant "RenovacionService" as RenS
participant "PrestamoRepository" as PR
participant "Base de Datos\nPostgreSQL" as BD

E -> CPA: Selecciona "Mis Préstamos"
CPA -> PS: obtenerPrestamosEstudiante(estudianteId)
PS -> PR: findByPersonaIdOrderByFechaPrestamoDesc(estudianteId)
PR -> BD: SELECT p.*, l.titulo, l.isbn, e.codigo FROM PRESTAMO p JOIN LIBRO l...
BD -> PR: Lista de préstamos con detalles
PR -> PS: Préstamos del estudiante
PS -> PS: clasificarPrestamosPorEstado()
PS -> CPA: Préstamos clasificados
CPA -> E: Interfaz con pestañas (Activos, Historial, Alertas)

alt Ver Préstamos Activos
    E -> CPA: Selecciona pestaña "Préstamos Activos"
    CPA -> PS: filtrarPrestamosActivos(listaCompleta)
    PS -> PS: calcularDiasRestantes(fechaLimite)
    PS -> PS: identificarVencimientos()
    PS -> CPA: Préstamos activos con estado calculado
    CPA -> E: Lista de préstamos activos con alertas visuales

    alt Solicitar Renovación
        E -> CPA: Selecciona "Solicitar Renovación"
        CPA -> RenS: procesarSolicitudRenovacion(prestamoId)
        RenS -> PR: actualizarFechaLimite(prestamoId, nuevaFecha)
        PR -> BD: UPDATE PRESTAMO SET fecha_limite = fecha_limite + INTERVAL 7 DAY
        BD -> PR: confirmación
        RenS -> BD: INSERT INTO RENOVACION (prestamo_id, fecha_renovacion)
        BD -> RenS: renovación registrada
        RenS -> CPA: Renovación exitosa
        CPA -> E: "Préstamo renovado exitosamente"
    end
end

@enduml
```

## CU08: Gestionar Mis Reservas (Estudiante)

```plantuml
@startuml
title CU08: Gestionar Mis Reservas (Estudiante)

actor "Estudiante" as E
participant "ControladorReservas\nAlumno" as CRA
participant "ReservaService" as RS
participant "NotificacionService" as NS
participant "ReservaRepository" as RR
participant "Base de Datos\nPostgreSQL" as BD

E -> CRA: Selecciona "Mis Reservas"
CRA -> RS: obtenerReservasEstudiante(estudianteId)
RS -> RR: findByPersonaIdOrderByFechaReservaDesc(estudianteId)
RR -> BD: SELECT r.*, l.titulo, l.isbn, l.autor, er.descripcion as estado FROM RESERVA r...
BD -> RR: Lista de reservas con detalles
RR -> RS: Reservas del estudiante
RS -> RS: clasificarReservasPorEstado()
RS -> RS: calcularTiemposEstimados()
RS -> CRA: Reservas clasificadas con metadata
CRA -> E: Interfaz con pestañas organizadas por estado

alt Ver Reservas Pendientes
    E -> CRA: Selecciona pestaña "Pendientes"
    CRA -> RS: filtrarReservasPendientes(listaCompleta)
    RS -> RS: calcularPosicionEnCola(reservaId)
    RS -> RS: estimarTiempoAprobacion()
    RS -> CRA: Reservas pendientes con estimaciones
    CRA -> E: Lista de reservas pendientes

    alt Cancelar Reserva Pendiente
        E -> CRA: Selecciona "Cancelar Reserva"
        CRA -> E: Confirmación "¿Está seguro de cancelar esta reserva?"
        E -> CRA: Confirma cancelación
        CRA -> RS: cancelarReserva(reservaId, estudianteId)
        
        RS -> RR: verificarEstadoPendiente(reservaId)
        RR -> BD: SELECT estado FROM RESERVA WHERE id = ?
        BD -> RR: Estado actual
        RR -> RS: Estado verificado
        
        alt Estado PENDIENTE
            RS -> RR: actualizarEstado(reservaId, "CANCELADA")
            RR -> BD: UPDATE RESERVA SET estado = 3, fecha_cancelacion = NOW()
            BD -> RR: confirmación
            RS -> NS: notificarCancelacion(reservaId)
            NS -> BD: INSERT INTO NOTIFICACION
            BD -> NS: notificación registrada
            RS -> CRA: Cancelación exitosa
            CRA -> E: "Reserva cancelada exitosamente"
        end
    end
end

@enduml
```

## CU09: Consultar Mis Sanciones (Estudiante)

```plantuml
@startuml
title CU09: Consultar Mis Sanciones (Estudiante)

actor "Estudiante" as E
participant "ControladorSanciones\nAlumno" as CSA
participant "SancionService" as SS
participant "CertificadoService" as CS
participant "SancionRepository" as SR
participant "Base de Datos\nPostgreSQL" as BD

E -> CSA: Selecciona "Mis Sanciones"
CSA -> SS: obtenerSancionesEstudiante(estudianteId)
SS -> SR: findByPersonaIdOrderByFechaInicioDesc(estudianteId)
SR -> BD: SELECT s.*, p.motivo, p.fecha_prestamo, l.titulo FROM SANCION s LEFT JOIN PRESTAMO p...
BD -> SR: Lista de sanciones con detalles
SR -> SS: Sanciones del estudiante
SS -> SS: clasificarSancionesPorEstado()
SS -> SS: calcularDiasRestantes()
SS -> CSA: Sanciones clasificadas con metadata
CSA -> E: Interfaz con pestañas organizadas por estado

alt Ver Sanciones Activas
    E -> CSA: Selecciona pestaña "Sanciones Activas"
    CSA -> SS: filtrarSancionesActivas(listaCompleta)
    SS -> SS: verificarVigencia(fechaFin, fechaActual)
    SS -> SS: calcularImpactoServicios()
    SS -> CSA: Sanciones activas con restricciones
    CSA -> E: Lista de sanciones activas
end

@enduml
```

## CU10: Gestionar Perfil Personal (Estudiante)

```plantuml
@startuml
title CU10: Gestionar Perfil Personal (Estudiante)

actor "Estudiante" as E
participant "ControladorPerfil\nAlumno" as CPA
participant "UsuarioService" as US
participant "PersonaService" as PS
participant "BCryptEncoder" as BC
participant "UsuarioRepository" as UR
participant "PersonaRepository" as PR
participant "Base de Datos\nPostgreSQL" as BD

E -> CPA: Selecciona "Mi Perfil"
CPA -> US: obtenerPerfilCompleto(estudianteId)
US -> UR: findByIdWithPersona(estudianteId)
UR -> BD: SELECT u.*, p.* FROM USUARIO u JOIN PERSONA p ON u.id_persona = p.id
BD -> UR: Datos completos del usuario
UR -> US: Usuario con información personal
US -> CPA: Perfil completo del estudiante
CPA -> E: Interfaz de perfil con pestañas

alt Cambiar Contraseña
    E -> CPA: Selecciona pestaña "Seguridad"
    CPA -> E: Formulario de cambio de contraseña

    E -> CPA: Ingresa contraseña actual y nueva contraseña
    CPA -> US: validarContraseñaActual(estudianteId, contraseñaActual)
    US -> UR: findById(estudianteId)
    UR -> BD: SELECT contraseña FROM USUARIO WHERE id = ?
    BD -> UR: Hash de contraseña actual
    UR -> US: contraseña encriptada
    
    US -> BC: matches(contraseñaActual, hashAlmacenado)
    BC -> US: boolean coincide
    
    alt Contraseña actual correcta
        US -> CPA: Contraseña validada
        CPA -> CPA: validarPoliticasSeguridad(nuevaContraseña)
        
        alt Nueva contraseña válida
            CPA -> BC: encode(nuevaContraseña)
            BC -> CPA: nuevaContraseñaEncriptada
            
            CPA -> US: actualizarContraseña(estudianteId, nuevaContraseñaEncriptada)
            US -> UR: updatePassword(estudianteId, nuevaContraseña)
            UR -> BD: UPDATE USUARIO SET contraseña = ?, fecha_actualizacion = NOW()
            BD -> UR: confirmación
            UR -> US: contraseña actualizada
            US -> CPA: cambio exitoso
            CPA -> E: "Contraseña cambiada exitosamente"
        end
    end
end

@enduml
```

---

**Nota:** Los diagramas de secuencia anteriores están listos para renderizar con PlantUML Online o servicios locales. Están embebidos en bloques de código markdown estándar.
