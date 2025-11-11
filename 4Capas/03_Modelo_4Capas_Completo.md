# Modelo de 4 Capas - Clínica UNFV

## Descripción
Arquitectura de 4 capas que implementa el patrón de separación de responsabilidades para el sistema de la Clínica UNFV.

## CAPA 1: PRESENTACIÓN (Presentation Layer)

### Responsabilidades:
- Interfaz de usuario
- Validación de entrada
- Formateo de salida
- Navegación entre pantallas

### Componentes:
- **Portal Web**: Citas online, consulta de resultados
- **Aplicación Desktop**: Gestión administrativa completa
- **Aplicación Móvil**: Consultas básicas y notificaciones
- **Kioscos de Autoservicio**: Check-in de pacientes

### Tecnologías:
- **Web**: React/Angular + Bootstrap
- **Desktop**: WPF/.NET o JavaFX
- **Móvil**: React Native o Flutter
- **API Gateway**: Para unificar servicios

```mermaid
graph TB
    subgraph "CAPA 1: PRESENTACIÓN"
        WEB[Portal Web<br/>• Registro pacientes<br/>• Solicitud citas<br/>• Consulta resultados<br/>• Pago en línea]
        DESKTOP[App Desktop<br/>• Gestión completa<br/>• Reportes<br/>• Configuración<br/>• Administración]
        MOBILE[App Móvil<br/>• Citas básicas<br/>• Notificaciones<br/>• Resultados<br/>• Recordatorios]
        KIOSK[Kiosco<br/>• Check-in<br/>• Confirmación citas<br/>• Actualizar datos<br/>• Imprimir tickets]
    end
    
    API_GW[API Gateway<br/>• Autenticación<br/>• Rate limiting<br/>• Logging<br/>• Load balancing]
    
    WEB --> API_GW
    DESKTOP --> API_GW
    MOBILE --> API_GW
    KIOSK --> API_GW
```

## CAPA 2: SERVICIOS (Service Layer)

### Responsabilidades:
- Lógica de aplicación
- Coordinación entre componentes
- Transacciones
- Seguridad y autorización

### Servicios Principales:

#### Servicio de Gestión de Pacientes
```csharp
public class ServicioPacientes
{
    public async Task<ResultadoOperacion> RegistrarPaciente(DatosPaciente datos)
    public async Task<Paciente> ObtenerPaciente(string dni)
    public async Task<List<Paciente>> BuscarPacientes(CriteriosBusqueda criterios)
    public async Task<bool> ActualizarDatos(string dni, DatosPaciente nuevosDatos)
}
```

#### Servicio de Gestión de Citas
```csharp
public class ServicioCitas
{
    public async Task<CitaCreada> ProgramarCita(SolicitudCita solicitud)
    public async Task<bool> CancelarCita(string idCita, string motivo)
    public async Task<List<Cita>> ObtenerCitasPaciente(string dni, DateTime desde, DateTime hasta)
    public async Task<DisponibilidadMedico> ConsultarDisponibilidad(string idMedico, DateTime fecha)
}
```

#### Servicio de Historia Clínica
```csharp
public class ServicioHistoriaClinica
{
    public async Task<string> CrearNuevaHistoria(string dniPaciente)
    public async Task<bool> RegistrarConsulta(ConsultaMedica consulta)
    public async Task<HistoriaCompleta> ObtenerHistoriaCompleta(string numeroHistoria)
    public async Task<bool> ArchivarHistoria(string numeroHistoria, MotivoArchivo motivo)
}
```

```mermaid
graph TB
    subgraph "CAPA 2: SERVICIOS"
        SERV_SEGUR[Servicio Seguridad<br/>• Autenticación<br/>• Autorización<br/>• Audit Trail<br/>• Encriptación]
        
        SERV_PAC[Servicio Pacientes<br/>• Registro/Actualización<br/>• Búsqueda<br/>• Validaciones<br/>• Historiales]
        
        SERV_CITAS[Servicio Citas<br/>• Programación<br/>• Cancelación<br/>• Disponibilidad<br/>• Recordatorios]
        
        SERV_HC[Servicio Historia Clínica<br/>• Creación HC<br/>• Consultas médicas<br/>• Archivado<br/>• Rotación]
        
        SERV_FARM[Servicio Farmacia<br/>• Gestión inventario<br/>• Dispensación<br/>• Control stock<br/>• Caducidad]
        
        SERV_IMG[Servicio Diagnóstico<br/>• Programar estudios<br/>• Resultados<br/>• Archivo digital<br/>• Visualización]
        
        SERV_ODON[Servicio Odontología<br/>• Tratamientos<br/>• Odontograma<br/>• Seguimiento<br/>• Especialidades]
        
        SERV_FACT[Servicio Facturación<br/>• Generación facturas<br/>• Seguros<br/>• Pagos<br/>• Reportes financieros]
        
        SERV_NOTIF[Servicio Notificaciones<br/>• SMS<br/>• Email<br/>• Push notifications<br/>• Recordatorios]
    end
```

## CAPA 3: LÓGICA DE NEGOCIO (Business Logic Layer)

### Responsabilidades:
- Reglas de negocio
- Validaciones complejas
- Algoritmos específicos del dominio
- Workflows y procesos

### Módulos de Negocio:

#### Gestión de Pacientes
```csharp
public class GestorPacientes
{
    public bool ValidarDatosPaciente(DatosPaciente datos)
    {
        // Validar DNI peruano
        // Verificar edad mínima
        // Validar email y teléfono
        // Verificar duplicados
    }
    
    public string GenerarNumeroHistoriaClinica(string dni)
    {
        // Algoritmo: YYYY + Código Sede + Número Secuencial
        // Ejemplo: 2024-UNFV-001234
    }
}
```

#### Gestión de Citas
```csharp
public class GestorCitas
{
    public List<HorarioDisponible> CalcularDisponibilidad(
        string especialidad, 
        DateTime fechaInicio, 
        DateTime fechaFin)
    {
        // Considerar horarios de médicos
        // Considerar feriados
        // Considerar disponibilidad de consultorios
        // Aplicar reglas de spacing entre citas
    }
    
    public bool ValidarReglasNegocioCita(SolicitudCita solicitud)
    {
        // Máximo 3 citas pendientes por paciente
        // No más de 1 cita por especialidad por mes
        // Verificar restricciones de edad para especialidades
    }
}
```

#### Gestión de Historia Clínica
```csharp
public class GestorHistoriaClinica
{
    public bool RequiereRotacionFisica(HistoriaClinica historia)
    {
        // Historias > 5 años sin actividad
        // Espacio de archivo físico limitado
        // Pacientes fallecidos (después de período legal)
    }
    
    public NivelAccesoHistoria DeterminarNivelAcceso(
        Usuario usuario, 
        HistoriaClinica historia)
    {
        // Médico tratante: Acceso completo
        // Médico consultor: Solo lectura
        // Enfermería: Acceso limitado
        // Administrativo: Solo datos demográficos
    }
}
```

```mermaid
graph TB
    subgraph "CAPA 3: LÓGICA DE NEGOCIO"
        subgraph "Gestión Pacientes"
            REG_PAC[Reglas Registro<br/>• Validación DNI<br/>• Verificar duplicados<br/>• Asignación HC<br/>• Categorización]
            HIST_PAC[Historial Paciente<br/>• Consultas previas<br/>• Alergias conocidas<br/>• Tratamientos activos<br/>• Seguimientos]
        end
        
        subgraph "Gestión Citas"
            DISP_CITAS[Disponibilidad<br/>• Horarios médicos<br/>• Capacidad consultorios<br/>• Feriados<br/>• Emergencias]
            VALID_CITAS[Validaciones<br/>• Límites por paciente<br/>• Restricciones edad<br/>• Prerequisitos<br/>• Autorizaciones]
        end
        
        subgraph "Historia Clínica"
            ARCH_HC[Archivado HC<br/>• Criterios rotación<br/>• Digitalización<br/>• Conservación legal<br/>• Destrucción segura]
            ACC_HC[Control Acceso<br/>• Niveles usuario<br/>• Auditoría accesos<br/>• Confidencialidad<br/>• Consentimientos]
        end
        
        subgraph "Procesos Clínicos"
            WORKFLOW[Workflows<br/>• Proceso consulta<br/>• Proceso urgencia<br/>• Proceso quirúrgico<br/>• Proceso diagnóstico]
            PROTOC[Protocolos<br/>• Guías clínicas<br/>• Tratamientos estándar<br/>• Alertas médicas<br/>• Contraindicaciones]
        end
        
        subgraph "Gestión Farmacia"
            INV_FARM[Inventario<br/>• Control stock<br/>• Caducidades<br/>• Rotación productos<br/>• Alertas desabasto]
            DISP_MED[Dispensación<br/>• Validar recetas<br/>• Interacciones<br/>• Dosis correctas<br/>• Autorización seguros]
        end
    end
```

## CAPA 4: ACCESO A DATOS (Data Access Layer)

### Responsabilidades:
- Persistencia de datos
- Consultas optimizadas
- Transacciones de base de datos
- Cache y performance

### Repositorios y Entidades:

#### Base de Datos Principal
```sql
-- Esquema principal de la base de datos

-- Tabla Pacientes
CREATE TABLE Pacientes (
    PacienteID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    DNI VARCHAR(8) UNIQUE NOT NULL,
    Nombres NVARCHAR(100) NOT NULL,
    ApellidoPaterno NVARCHAR(50) NOT NULL,
    ApellidoMaterno NVARCHAR(50),
    FechaNacimiento DATE NOT NULL,
    Sexo CHAR(1) CHECK (Sexo IN ('M', 'F')),
    Telefono VARCHAR(15),
    Email NVARCHAR(100),
    Direccion NVARCHAR(200),
    TipoSeguro NVARCHAR(50),
    NumeroSeguro NVARCHAR(20),
    FechaRegistro DATETIME2 DEFAULT GETDATE(),
    EstadoCivil NVARCHAR(20),
    Ocupacion NVARCHAR(100),
    ContactoEmergencia NVARCHAR(100),
    TelefonoEmergencia VARCHAR(15),
    Activo BIT DEFAULT 1,
    INDEX IX_Pacientes_DNI (DNI),
    INDEX IX_Pacientes_Nombres (Nombres, ApellidoPaterno)
);

-- Tabla Historias Clínicas
CREATE TABLE HistoriasClinicas (
    HistoriaID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NumeroHistoria VARCHAR(20) UNIQUE NOT NULL,
    PacienteID UNIQUEIDENTIFIER NOT NULL,
    FechaApertura DATETIME2 DEFAULT GETDATE(),
    EstadoArchivo NVARCHAR(20) DEFAULT 'ACTIVA',
    UbicacionFisica NVARCHAR(100),
    UltimaRotacion DATETIME2,
    MotivoRotacion NVARCHAR(200),
    DigitalizacionCompleta BIT DEFAULT 0,
    FOREIGN KEY (PacienteID) REFERENCES Pacientes(PacienteID),
    INDEX IX_HistoriasClinicas_Numero (NumeroHistoria),
    INDEX IX_HistoriasClinicas_Paciente (PacienteID)
);

-- Tabla Citas
CREATE TABLE Citas (
    CitaID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PacienteID UNIQUEIDENTIFIER NOT NULL,
    MedicoID UNIQUEIDENTIFIER NOT NULL,
    ConsultorioID UNIQUEIDENTIFIER NOT NULL,
    FechaCita DATETIME2 NOT NULL,
    TipoCita NVARCHAR(30) NOT NULL, -- CONSULTA_EXTERNA, URGENCIA, CONTROL, ESPECIALIZAD
    EspecialidadID UNIQUEIDENTIFIER NOT NULL,
    EstadoCita NVARCHAR(20) DEFAULT 'PROGRAMADA', -- PROGRAMADA, CONFIRMADA, ATENDIDA, CANCELADA, NO_ASISTIO
    MotivoConsulta NVARCHAR(500),
    ObservacionesCita NVARCHAR(1000),
    FechaCreacion DATETIME2 DEFAULT GETDATE(),
    CreadoPor UNIQUEIDENTIFIER NOT NULL,
    FechaCancelacion DATETIME2,
    MotivoCancelacion NVARCHAR(200),
    FOREIGN KEY (PacienteID) REFERENCES Pacientes(PacienteID),
    INDEX IX_Citas_Fecha (FechaCita),
    INDEX IX_Citas_Paciente (PacienteID),
    INDEX IX_Citas_Medico (MedicoID)
);

-- Tabla Consultas Médicas
CREATE TABLE ConsultasMedicas (
    ConsultaID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CitaID UNIQUEIDENTIFIER NOT NULL,
    HistoriaID UNIQUEIDENTIFIER NOT NULL,
    FechaConsulta DATETIME2 DEFAULT GETDATE(),
    MotivoConsulta NVARCHAR(1000),
    Anamnesis NVARCHAR(MAX),
    ExamenFisico NVARCHAR(MAX),
    Diagnostico NVARCHAR(MAX),
    TratamientoIndicado NVARCHAR(MAX),
    ObservacionesConsulta NVARCHAR(MAX),
    ProximaConsulta DATETIME2,
    MedicoResponsable UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (CitaID) REFERENCES Citas(CitaID),
    FOREIGN KEY (HistoriaID) REFERENCES HistoriasClinicas(HistoriaID)
);

-- Tabla Farmacia
CREATE TABLE ProductosFarmacia (
    ProductoID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CodigoProducto VARCHAR(20) UNIQUE NOT NULL,
    NombreComercial NVARCHAR(200) NOT NULL,
    NombreGenerico NVARCHAR(200),
    Concentracion NVARCHAR(50),
    FormaFarmaceutica NVARCHAR(100),
    Laboratorio NVARCHAR(100),
    StockActual INT DEFAULT 0,
    StockMinimo INT DEFAULT 10,
    PrecioUnitario DECIMAL(10,2),
    FechaCaducidad DATE,
    Activo BIT DEFAULT 1,
    RequiereReceta BIT DEFAULT 1,
    INDEX IX_ProductosFarmacia_Codigo (CodigoProducto),
    INDEX IX_ProductosFarmacia_Nombre (NombreComercial)
);

-- Tabla Diagnóstico por Imágenes
CREATE TABLE EstudiosImagenes (
    EstudioID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ConsultaID UNIQUEIDENTIFIER NOT NULL,
    TipoEstudio NVARCHAR(100) NOT NULL, -- RADIOGRAFIA, ECOGRAFIA, TAC, RMN, etc.
    AreaAnatomica NVARCHAR(100),
    IndicacionMedica NVARCHAR(500),
    FechaSolicitud DATETIME2 DEFAULT GETDATE(),
    FechaProgramada DATETIME2,
    FechaRealizacion DATETIME2,
    ResultadoEstudio NVARCHAR(MAX),
    ArchivosDigitales NVARCHAR(500), -- Rutas de archivos DICOM
    MedicoSolicitante UNIQUEIDENTIFIER NOT NULL,
    RadiologoInformante UNIQUEIDENTIFIER,
    EstadoEstudio NVARCHAR(20) DEFAULT 'SOLICITADO',
    FOREIGN KEY (ConsultaID) REFERENCES ConsultasMedicas(ConsultaID)
);

-- Tabla Odontología
CREATE TABLE ConsultasOdontologia (
    ConsultaOdontoID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ConsultaID UNIQUEIDENTIFIER NOT NULL,
    Odontograma NVARCHAR(MAX), -- JSON con estado de cada pieza dental
    TratamientosRealizados NVARCHAR(MAX),
    TratamientosProgramados NVARCHAR(MAX),
    ObservacionesOdonto NVARCHAR(1000),
    ProximaConsultaOdonto DATETIME2,
    FOREIGN KEY (ConsultaID) REFERENCES ConsultasMedicas(ConsultaID)
);
```

#### Repositorios
```csharp
public interface IRepositorioPacientes
{
    Task<Paciente> ObtenerPorDni(string dni);
    Task<Paciente> ObtenerPorId(Guid pacienteId);
    Task<List<Paciente>> BuscarPacientes(CriteriosBusqueda criterios);
    Task<Guid> CrearPaciente(Paciente paciente);
    Task<bool> ActualizarPaciente(Paciente paciente);
    Task<bool> DesactivarPaciente(Guid pacienteId);
}

public interface IRepositorioHistoriasClinicas
{
    Task<HistoriaClinica> ObtenerPorNumero(string numeroHistoria);
    Task<HistoriaClinica> ObtenerPorPaciente(Guid pacienteId);
    Task<string> CrearHistoriaClinica(Guid pacienteId);
    Task<bool> RegistrarConsulta(ConsultaMedica consulta);
    Task<List<HistoriaClinica>> ObtenerHistoriasParaRotacion();
    Task<bool> MarcarComoRotada(string numeroHistoria, string ubicacion);
}

public interface IRepositorioCitas
{
    Task<List<Cita>> ObtenerCitasPaciente(Guid pacienteId, DateTime desde, DateTime hasta);
    Task<List<Cita>> ObtenerCitasMedico(Guid medicoId, DateTime fecha);
    Task<Guid> CrearCita(Cita cita);
    Task<bool> CancelarCita(Guid citaId, string motivo);
    Task<bool> ConfirmarCita(Guid citaId);
    Task<List<HorarioDisponible>> ObtenerDisponibilidad(Guid medicoId, DateTime fecha);
}
```

```mermaid
graph TB
    subgraph "CAPA 4: ACCESO A DATOS"
        subgraph "Base de Datos Relacional (SQL Server)"
            DB_PRINCIPAL[(Base Datos Principal<br/>• Pacientes<br/>• Historias Clínicas<br/>• Citas<br/>• Consultas Médicas)]
            DB_FARMACIA[(BD Farmacia<br/>• Productos<br/>• Inventario<br/>• Dispensaciones<br/>• Proveedores)]
            DB_SEGURIDAD[(BD Seguridad<br/>• Usuarios<br/>• Roles<br/>• Permisos<br/>• Auditoría)]
        end
        
        subgraph "Almacenamiento NoSQL"
            MONGO[(MongoDB<br/>• Documentos HC<br/>• Logs sistema<br/>• Configuraciones<br/>• Cache sesiones)]
        end
        
        subgraph "Sistema de Archivos"
            FILE_IMAGES[Archivos Imágenes<br/>• Estudios DICOM<br/>• Fotografías<br/>• Documentos<br/>• Respaldos HC]
        end
        
        subgraph "Repositorios"
            REPO_PAC[Repositorio Pacientes<br/>• CRUD pacientes<br/>• Búsquedas<br/>• Validaciones]
            REPO_HC[Repositorio HC<br/>• Gestión historias<br/>• Consultas<br/>• Archivado]
            REPO_CITAS[Repositorio Citas<br/>• Programación<br/>• Disponibilidad<br/>• Cancelaciones]
            REPO_FARM[Repositorio Farmacia<br/>• Inventario<br/>• Movimientos<br/>• Caducidades]
        end
        
        subgraph "Cache y Performance"
            REDIS[(Redis Cache<br/>• Sesiones usuario<br/>• Datos frecuentes<br/>• Configuraciones<br/>• Horarios médicos)]
        end
    end
    
    %% Conexiones entre repositorios y bases de datos
    REPO_PAC --> DB_PRINCIPAL
    REPO_HC --> DB_PRINCIPAL
    REPO_HC --> MONGO
    REPO_HC --> FILE_IMAGES
    REPO_CITAS --> DB_PRINCIPAL
    REPO_CITAS --> REDIS
    REPO_FARM --> DB_FARMACIA
```

## Flujo de Datos Entre Capas

### Ejemplo: Programar una Cita
```mermaid
sequenceDiagram
    participant WEB as Capa Presentación (Web)
    participant SRV as Capa Servicios
    participant BIZ as Capa Negocio
    participant DAL as Capa Datos
    
    WEB->>SRV: ProgramarCita(solicitudCita)
    SRV->>BIZ: ValidarReglasNegocio(solicitud)
    BIZ->>DAL: VerificarDisponibilidad(medico, fecha)
    DAL-->>BIZ: HorariosDisponibles
    BIZ->>DAL: ValidarLimitePaciente(dni)
    DAL-->>BIZ: CitasActivasPaciente
    BIZ-->>SRV: ResultadoValidacion
    SRV->>DAL: CrearCita(citaValida)
    DAL-->>SRV: CitaCreada
    SRV->>SRV: EnviarNotificacion(confirmacion)
    SRV-->>WEB: ResultadoCita
```

### Ejemplo: Consultar Historia Clínica
```mermaid
sequenceDiagram
    participant DESK as Capa Presentación (Desktop)
    participant SRV as Capa Servicios
    participant BIZ as Capa Negocio
    participant DAL as Capa Datos
    
    DESK->>SRV: ObtenerHistoriaCompleta(numeroHistoria)
    SRV->>BIZ: VerificarPermisos(usuario, historia)
    BIZ->>DAL: ObtenerNivelAcceso(usuario)
    DAL-->>BIZ: NivelAcceso
    BIZ-->>SRV: PermisosValidados
    SRV->>DAL: ObtenerHistoriaClinica(numero)
    DAL-->>SRV: DatosHistoria
    SRV->>DAL: ObtenerConsultas(historiaId)
    DAL-->>SRV: ListaConsultas
    SRV->>SRV: FiltrarSegunPermisos(datos, nivel)
    SRV-->>DESK: HistoriaClínicaCompleta
```

## Tecnologías por Capa

### Capa 1: Presentación
- **Frontend Web**: React 18 + TypeScript + Bootstrap 5
- **API Gateway**: Kong o Azure API Management
- **Autenticación**: JWT + OAuth 2.0
- **Mobile**: React Native o Flutter

### Capa 2: Servicios
- **Framework**: .NET 8 o Spring Boot 3
- **API**: RESTful + GraphQL
- **Documentación**: Swagger/OpenAPI
- **Containerización**: Docker + Kubernetes

### Capa 3: Lógica de Negocio
- **Patrones**: Domain-Driven Design (DDD)
- **Validación**: FluentValidation
- **Workflow**: MassTransit + RabbitMQ
- **Rules Engine**: Microsoft Rules Engine

### Capa 4: Acceso a Datos
- **BD Principal**: SQL Server 2022
- **ORM**: Entity Framework Core
- **Cache**: Redis
- **NoSQL**: MongoDB para documentos
- **Archivos**: Azure Blob Storage o MinIO