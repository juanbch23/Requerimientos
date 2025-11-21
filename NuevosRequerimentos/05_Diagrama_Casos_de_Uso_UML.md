# Diagrama de Casos de Uso - Visión General

## Diagrama UML Consolidado

```plantuml
@startuml
!theme default
!define ACTORFONT font Arial
!define USEFONT font Arial

actor "Administrador" as ADMIN
actor "Estudiante" as ESTUDIANTE
actor "Sistema Externo\n(Correo/SMS)" as SISTEMA

rectangle "Sistema de Gestión de Biblioteca UNFV" {
    
    ' Casos de uso ADMIN
    rectangle "Gestión de Usuarios" {
        usecase "CU01: Iniciar Sesión" as CU01
        usecase "CU02: Registrar Usuario" as CU02
    }
    
    rectangle "Gestión de Libros" {
        usecase "CU03: Gestionar Libros" as CU03
    }
    
    rectangle "Gestión de Préstamos" {
        usecase "CU04: Gestionar Préstamos" as CU04
    }
    
    rectangle "Gestión de Sanciones" {
        usecase "CU05: Gestionar Sanciones" as CU05
    }
    
    ' Casos de uso ESTUDIANTE
    rectangle "Catálogo y Búsqueda" {
        usecase "CU06: Consultar Catálogo" as CU06
    }
    
    rectangle "Gestión de Préstamos (Estudiante)" {
        usecase "CU07: Mis Préstamos" as CU07
    }
    
    rectangle "Gestión de Reservas" {
        usecase "CU08: Mis Reservas" as CU08
    }
    
    rectangle "Consulta de Sanciones" {
        usecase "CU09: Mis Sanciones" as CU09
    }
    
    rectangle "Gestión de Perfil" {
        usecase "CU10: Mi Perfil" as CU10
    }
}

' Asociaciones ADMIN
ADMIN --> CU01
ADMIN --> CU02
ADMIN --> CU03
ADMIN --> CU04
ADMIN --> CU05

' Asociaciones ESTUDIANTE
ESTUDIANTE --> CU01
ESTUDIANTE --> CU06
ESTUDIANTE --> CU07
ESTUDIANTE --> CU08
ESTUDIANTE --> CU09
ESTUDIANTE --> CU10

' Relaciones de inclusión (<<include>>)
CU04 ..|> CU05 : <<includes>>
CU07 ..|> CU09 : <<includes>>
CU08 ..|> CU09 : <<includes>>

' Relaciones de extensión (<<extends>>)
CU01 <|.. CU02 : <<extends>>

' Interacciones con sistema externo
CU08 --> SISTEMA : Notificaciones
CU09 --> SISTEMA : Alertas

@enduml
```

## Matriz de Relaciones entre Casos de Uso

| Caso de Uso | Actor | Descripción | Precondiciones | Postcondiciones | Dependencias |
|---|---|---|---|---|---|
| **CU01** | ADMIN, ESTUDIANTE | Iniciar Sesión | Usuario registrado en BD | Usuario autenticado, sesión activa | RF001 |
| **CU02** | ADMIN | Registrar Usuario | Datos personales válidos | Usuario creado, contraseña encriptada | RF001 |
| **CU03** | ADMIN | Gestionar Libros (CRUD) | Base de datos disponible | Libro creado/modificado/eliminado | RF003 |
| **CU04** | ADMIN | Gestionar Préstamos | Usuario y libro disponibles | Préstamo registrado o devuelto | RF004, CU05 |
| **CU05** | ADMIN | Gestionar Sanciones | Préstamo con atraso | Sanción creada/cancelada | RF005 |
| **CU06** | ESTUDIANTE | Consultar Catálogo | Usuario autenticado (CU01) | Libro seleccionado para reserva | RF003 |
| **CU07** | ESTUDIANTE | Mis Préstamos | Usuario autenticado (CU01) | Préstamo renovado o devuelto | RF004, CU06 |
| **CU08** | ESTUDIANTE | Mis Reservas | Usuario autenticado, sin sanciones | Reserva creada/cancelada | RF004, CU06 |
| **CU09** | ESTUDIANTE | Mis Sanciones | Usuario autenticado | Sanción consultada | RF005 |
| **CU10** | ESTUDIANTE | Mi Perfil | Usuario autenticado (CU01) | Datos actualizados, contraseña actualizada | RF001 |

## Análisis de Relaciones de Inclusión

### CU04 incluye CU05
- **Justificación:** Cuando se registra una devolución con atraso en CU04, automáticamente se ejecuta la lógica de CU05 (crear sanción).
- **Escenario:** Administrador registra devolución tardía → Sistema crea sanción automáticamente.

### CU07 incluye CU09
- **Justificación:** Al ver préstamos activos, el sistema valida si el estudiante tiene sanciones que puedan afectar renovaciones.
- **Escenario:** Estudiante solicita renovación → Sistema verifica sanciones activas (CU09).

### CU08 incluye CU09
- **Justificación:** Para crear una reserva, se valida primero si el estudiante tiene sanciones activas.
- **Escenario:** Estudiante intenta reservar libro → Sistema verifica sanciones activas (CU09).

## Análisis de Relaciones de Extensión

### CU02 extiende CU01
- **Justificación:** CU02 es una especialización del flujo de autenticación, pero para el registro inicial.
- **Escenario:** Nuevo usuario accede a /auth/registro → Flujo similar a login pero con creación de usuario.
- **Diferencia:** CU01 valida credenciales existentes; CU02 crea nuevas credenciales.

## Dependencias Funcionales

```
CU01 (Autenticación)
  ├── CU02 (Registro de Usuario)
  ├── CU03 (Gestionar Libros)
  │   └── CU06 (Consultar Catálogo)
  │       ├── CU08 (Mis Reservas) → CU09 (Mis Sanciones)
  │       └── CU04 (Gestionar Préstamos)
  │           └── CU05 (Gestionar Sanciones)
  ├── CU04 (Gestionar Préstamos)
  │   ├── CU05 (Gestionar Sanciones)
  │   └── CU07 (Mis Préstamos) → CU09 (Mis Sanciones)
  └── CU10 (Mi Perfil)
```

## Mapa de Flujo de Datos

```
Usuario ──> CU01 (Iniciar Sesión)
              │
              ├─> [ADMIN] ──> CU02 (Registrar Usuario)
              │                │
              │                ├─> CU03 (Gestionar Libros)
              │                │
              │                ├─> CU04 (Gestionar Préstamos)
              │                │   └─> CU05 (Gestionar Sanciones)
              │
              └─> [ESTUDIANTE] ──> CU06 (Consultar Catálogo)
                                   ├─> CU07 (Mis Préstamos)
                                   │   └─> CU09 (Mis Sanciones)
                                   ├─> CU08 (Mis Reservas)
                                   │   └─> CU09 (Mis Sanciones)
                                   ├─> CU09 (Mis Sanciones)
                                   └─> CU10 (Mi Perfil)
```

## Matriz de Trazabilidad Casos de Uso → Requerimientos Funcionales

| CU | RF001 | RF002 | RF003 | RF004 | RF005 | RF006 | RF007 | RF008 | RF009 | RF010 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| CU01 | ✓ | ✓ | | | | | | | | |
| CU02 | ✓ | ✓ | | | | | | | | |
| CU03 | | | ✓ | ✓ | | | | | | |
| CU04 | | | | ✓ | ✓ | ✓ | | | | |
| CU05 | | | | ✓ | ✓ | | ✓ | | | |
| CU06 | | | ✓ | | | | | | | |
| CU07 | | | ✓ | ✓ | | | | ✓ | | |
| CU08 | | | ✓ | ✓ | | | | | ✓ | |
| CU09 | | | | | ✓ | | | | | |
| CU10 | ✓ | ✓ | | | | | | | | |

## Actores del Sistema

### 1. Administrador (ADMIN)
- **Responsabilidades:**
  - Autenticarse en el sistema (CU01)
  - Crear y gestionar cuentas de usuario (CU02)
  - Gestionar catálogo de libros (CU03)
  - Gestionar préstamos (CU04)
  - Gestionar sanciones (CU05)
  - Generar reportes (RF010)
- **Permisos especiales:** Acceso a todas las funciones administrativas.
- **Restricciones:** Solo usuarios con rol ADMIN pueden acceder a estos casos de uso.

### 2. Estudiante (ESTUDIANTE)
- **Responsabilidades:**
  - Autenticarse en el sistema (CU01)
  - Consultar catálogo de libros (CU06)
  - Gestionar préstamos personales (CU07)
  - Gestionar reservas (CU08)
  - Consultar sanciones (CU09)
  - Gestionar perfil personal (CU10)
- **Permisos:** Acceso a funciones de estudiante.
- **Restricciones:** No puede crear usuarios ni gestionar libros/sanciones globales.

### 3. Sistema Externo
- **Responsabilidades:**
  - Enviar notificaciones por correo (RF008)
  - Enviar alertas por SMS (RF008)
- **Interacciones:** 
  - CU08: Notificación cuando reserva es aprobada
  - CU09: Alerta sobre sanciones vigentes
  - CU07: Alerta sobre próximos vencimientos

## Escenarios Críticos

### Escenario 1: Renovación de Préstamo Bloqueada por Sanción
```
Actor: Estudiante
Pre: Tiene préstamo vigente y sanción activa
Paso 1: Entra a CU07 (Mis Préstamos)
Paso 2: Sistema valida CU09 (Mis Sanciones) automáticamente
Paso 3: Sistema detecta sanción activa
Paso 4: Sistema bloquea opción de renovación
Resultado: "No puede renovar - Tiene sanciones activas"
```

### Escenario 2: Reserva Rechazada por Sanción
```
Actor: Estudiante
Pre: Intenta reservar libro pero tiene sanción
Paso 1: Entra a CU06 (Consultar Catálogo)
Paso 2: Selecciona libro y hace clic en "Reservar"
Paso 3: Sistema valida CU09 (Mis Sanciones)
Paso 4: Sistema detecta sanción vigente
Paso 5: Sistema cancela operación de reserva
Resultado: "Tiene sanciones vigentes - No puede reservar"
```

### Escenario 3: Sanción Automática por Atraso
```
Actor: Administrador (sistema automático)
Pre: Fecha de devolución vencida
Paso 1: Administrador registra devolución tardía en CU04
Paso 2: Sistema calcula días de atraso
Paso 3: Sistema incluye CU05 automáticamente
Paso 4: Sistema crea sanción con duración = (días_atraso * factor)
Resultado: "Préstamo devuelto - Sanción creada por atraso de X días"
```

---

**Última actualización:** 2025-01-15  
**Versión:** 1.0  
**Estado:** Documentación Completa
