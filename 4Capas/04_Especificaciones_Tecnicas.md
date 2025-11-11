# Especificaciones Técnicas Adicionales - Clínica UNFV

## 1. Diagramas de Casos de Uso Específicos

### Caso de Uso: Gestión de Citas por Consultorio Externo
```mermaid
graph TD
    PAC[Paciente] --> SOL_CITA[Solicitar Cita]
    PAC --> CON_CITA[Consultar Citas]
    PAC --> CAN_CITA[Cancelar Cita]
    
    REC[Recepcionista] --> PROG_CITA[Programar Cita]
    REC --> MOD_CITA[Modificar Cita]
    REC --> CONF_CITA[Confirmar Asistencia]
    
    MED[Médico] --> VER_AGENDA[Ver Agenda]
    MED --> ATEN_PAC[Atender Paciente]
    MED --> REG_CONS[Registrar Consulta]
    
    ADM[Administrador] --> CONF_HOR[Configurar Horarios]
    ADM --> GES_CONSUL[Gestionar Consultorios]
    
    SOL_CITA --> VALID_DATOS[Validar Datos Paciente]
    PROG_CITA --> VERIF_DISP[Verificar Disponibilidad]
    ATEN_PAC --> ACTU_HC[Actualizar Historia Clínica]
```

### Caso de Uso: Atención por Urgencias
```mermaid
graph TD
    PAC_URG[Paciente Urgencia] --> TRIAGE[Triage]
    ENFER[Enfermera Triage] --> EVAL_PRIO[Evaluar Prioridad]
    EVAL_PRIO --> ASIG_PRIO[Asignar Prioridad]
    
    ASIG_PRIO --> P1[Prioridad 1<br/>Crítico]
    ASIG_PRIO --> P2[Prioridad 2<br/>Urgente]
    ASIG_PRIO --> P3[Prioridad 3<br/>Menos Urgente]
    
    P1 --> ATEN_INMED[Atención Inmediata]
    P2 --> ESPERA_CORTA[Espera Corta]
    P3 --> ESPERA_NORMAL[Espera Normal]
    
    MED_URG[Médico Urgencias] --> ATEN_URG[Atender Urgencia]
    ATEN_URG --> DEC_HOSP[Decidir Hospitalización]
    ATEN_URG --> DEC_ALTA[Decidir Alta]
    ATEN_URG --> DER_ESP[Derivar Especialista]
```

## 2. Matriz de Responsabilidades RACI

| Proceso | Paciente | Recepcionista | Médico | Enfermera | Administrador | Farmacéutico |
|---------|----------|---------------|--------|-----------|---------------|--------------|
| Solicitar Cita Web | R | I | I | - | - | - |
| Programar Cita Presencial | C | R | C | - | A | - |
| Confirmar Asistencia | R | A | I | - | - | - |
| Registrar Consulta | I | I | R | C | - | - |
| Actualizar Historia Clínica | I | I | R | C | A | - |
| Dispensar Medicamentos | I | I | C | I | I | R |
| Programar Estudios | I | C | R | I | I | - |
| Gestionar Inventario | - | I | I | - | C | R |
| Generar Reportes | - | I | I | - | R | I |

**Leyenda**: R=Responsable, A=Accountable, C=Consultado, I=Informado

## 3. Flujos de Trabajo Detallados

### Workflow: Proceso Completo de Consulta Externa

```mermaid
flowchart TD
    START([Inicio]) --> REG_PAC{¿Paciente<br/>Registrado?}
    
    REG_PAC -->|No| CREAR_PAC[Crear Nuevo Paciente]
    CREAR_PAC --> GEN_HC[Generar Historia Clínica]
    GEN_HC --> SOL_CITA[Solicitar Cita]
    
    REG_PAC -->|Sí| SOL_CITA
    SOL_CITA --> VER_DISP[Verificar Disponibilidad]
    VER_DISP --> DISP_OK{¿Disponible?}
    
    DISP_OK -->|No| PROP_ALT[Proponer Alternativas]
    PROP_ALT --> ACEP_ALT{¿Acepta?}
    ACEP_ALT -->|No| END([Fin])
    ACEP_ALT -->|Sí| CREAR_CITA
    
    DISP_OK -->|Sí| CREAR_CITA[Crear Cita]
    CREAR_CITA --> ENVIAR_CONF[Enviar Confirmación]
    ENVIAR_CONF --> ESP_CITA[Esperar Fecha Cita]
    
    ESP_CITA --> FECHA_CITA[Fecha de Cita]
    FECHA_CITA --> CHECK_IN[Check-in Paciente]
    CHECK_IN --> ESP_ATEN[Esperar Atención]
    ESP_ATEN --> ATEN_MED[Atención Médica]
    
    ATEN_MED --> REG_CONS[Registrar Consulta]
    REG_CONS --> NECES_EST{¿Necesita<br/>Estudios?}
    
    NECES_EST -->|Sí| PROG_EST[Programar Estudios]
    PROG_EST --> NECES_MED
    
    NECES_EST -->|No| NECES_MED{¿Necesita<br/>Medicamentos?}
    
    NECES_MED -->|Sí| DISP_MED[Dispensar Medicamentos]
    DISP_MED --> PROG_SEG
    
    NECES_MED -->|No| PROG_SEG{¿Programar<br/>Seguimiento?}
    
    PROG_SEG -->|Sí| PROG_CITA_SEG[Programar Cita Seguimiento]
    PROG_CITA_SEG --> FIN_PROC
    
    PROG_SEG -->|No| FIN_PROC[Finalizar Proceso]
    FIN_PROC --> END
```

### Workflow: Proceso de Urgencias

```mermaid
flowchart TD
    INICIO([Llegada Urgencia]) --> TRIAGE[Triage Enfermería]
    TRIAGE --> EVAL_SINT[Evaluar Síntomas]
    EVAL_SINT --> ASIG_PRIOR[Asignar Prioridad]
    
    ASIG_PRIOR --> PRIOR_1{Prioridad 1}
    ASIG_PRIOR --> PRIOR_2{Prioridad 2}
    ASIG_PRIOR --> PRIOR_3{Prioridad 3}
    
    PRIOR_1 --> ATEN_INMED[Atención Inmediata<br/>0 minutos]
    PRIOR_2 --> ESP_15[Espera Máx<br/>15 minutos]
    PRIOR_3 --> ESP_60[Espera Máx<br/>60 minutos]
    
    ATEN_INMED --> ATEN_MED_URG
    ESP_15 --> ATEN_MED_URG
    ESP_60 --> ATEN_MED_URG[Atención Médica Urgencias]
    
    ATEN_MED_URG --> EVAL_EST[Evaluar Estado]
    EVAL_EST --> NECESITA_HOSP{¿Requiere<br/>Hospitalización?}
    
    NECESITA_HOSP -->|Sí| GEST_HOSP[Gestionar Hospitalización]
    GEST_HOSP --> TRANSF_HOSP[Transferir a Hospitalización]
    
    NECESITA_HOSP -->|No| NECESITA_ESP{¿Requiere<br/>Especialista?}
    
    NECESITA_ESP -->|Sí| DER_ESP[Derivar a Especialista]
    DER_ESP --> PROG_CITA_ESP[Programar Cita Especialista]
    
    NECESITA_ESP -->|No| ALTA_URG[Alta de Urgencias]
    ALTA_URG --> IND_TRAT[Indicaciones Tratamiento]
    IND_TRAT --> FIN_URG([Fin Proceso Urgencias])
    
    PROG_CITA_ESP --> FIN_URG
    TRANSF_HOSP --> FIN_URG
```

## 4. Modelo de Datos Extendido

### Diagrama Entidad-Relación Completo

```mermaid
erDiagram
    PACIENTES ||--o{ HISTORIAS_CLINICAS : tiene
    PACIENTES ||--o{ CITAS : solicita
    HISTORIAS_CLINICAS ||--o{ CONSULTAS_MEDICAS : contiene
    CITAS ||--|| CONSULTAS_MEDICAS : genera
    CONSULTAS_MEDICAS ||--o{ RECETAS : emite
    RECETAS ||--o{ DISPENSACIONES : genera
    PRODUCTOS_FARMACIA ||--o{ DISPENSACIONES : incluye
    CONSULTAS_MEDICAS ||--o{ ESTUDIOS_IMAGENES : solicita
    CONSULTAS_MEDICAS ||--o{ CONSULTAS_ODONTOLOGIA : especializa
    
    PACIENTES {
        uniqueidentifier PacienteID PK
        varchar DNI UK
        nvarchar Nombres
        nvarchar ApellidoPaterno
        nvarchar ApellidoMaterno
        date FechaNacimiento
        char Sexo
        varchar Telefono
        nvarchar Email
        nvarchar Direccion
        nvarchar TipoSeguro
        nvarchar NumeroSeguro
        datetime2 FechaRegistro
        bit Activo
    }
    
    HISTORIAS_CLINICAS {
        uniqueidentifier HistoriaID PK
        varchar NumeroHistoria UK
        uniqueidentifier PacienteID FK
        datetime2 FechaApertura
        nvarchar EstadoArchivo
        nvarchar UbicacionFisica
        datetime2 UltimaRotacion
        bit DigitalizacionCompleta
    }
    
    CITAS {
        uniqueidentifier CitaID PK
        uniqueidentifier PacienteID FK
        uniqueidentifier MedicoID FK
        uniqueidentifier ConsultorioID FK
        datetime2 FechaCita
        nvarchar TipoCita
        uniqueidentifier EspecialidadID FK
        nvarchar EstadoCita
        nvarchar MotivoConsulta
        datetime2 FechaCreacion
    }
    
    CONSULTAS_MEDICAS {
        uniqueidentifier ConsultaID PK
        uniqueidentifier CitaID FK
        uniqueidentifier HistoriaID FK
        datetime2 FechaConsulta
        nvarchar MotivoConsulta
        nvarchar Anamnesis
        nvarchar ExamenFisico
        nvarchar Diagnostico
        nvarchar TratamientoIndicado
        uniqueidentifier MedicoResponsable FK
    }
    
    PRODUCTOS_FARMACIA {
        uniqueidentifier ProductoID PK
        varchar CodigoProducto UK
        nvarchar NombreComercial
        nvarchar NombreGenerico
        nvarchar Concentracion
        nvarchar FormaFarmaceutica
        int StockActual
        int StockMinimo
        decimal PrecioUnitario
        date FechaCaducidad
        bit RequiereReceta
    }
    
    ESTUDIOS_IMAGENES {
        uniqueidentifier EstudioID PK
        uniqueidentifier ConsultaID FK
        nvarchar TipoEstudio
        nvarchar AreaAnatomica
        nvarchar IndicacionMedica
        datetime2 FechaSolicitud
        datetime2 FechaProgramada
        datetime2 FechaRealizacion
        nvarchar ResultadoEstudio
        nvarchar ArchivosDigitales
        nvarchar EstadoEstudio
    }
    
    CONSULTAS_ODONTOLOGIA {
        uniqueidentifier ConsultaOdontoID PK
        uniqueidentifier ConsultaID FK
        nvarchar Odontograma
        nvarchar TratamientosRealizados
        nvarchar TratamientosProgramados
        datetime2 ProximaConsultaOdonto
    }
```

## 5. Seguridad y Compliance

### Matriz de Seguridad
| Componente | Amenaza | Control | Implementación |
|------------|---------|---------|----------------|
| Autenticación | Acceso no autorizado | Multi-factor Authentication | Azure AD + SMS |
| Autorización | Escalación privilegios | Role-Based Access Control | Claims-based security |
| Datos HC | Acceso no autorizado | Cifrado + Auditoría | AES-256 + Logs detallados |
| Comunicación | Interceptación | Cifrado en tránsito | TLS 1.3 |
| Base Datos | Inyección SQL | Prepared statements | Entity Framework |
| Archivos Médicos | Acceso no autorizado | Cifrado archivos | Azure Key Vault |

### Cumplimiento Normativo Peruano
- **Ley N° 29733**: Ley de Protección de Datos Personales
- **Ley N° 26842**: Ley General de Salud
- **Norma Técnica N° 022-MINSA/DGSP-V.02**: Historia Clínica
- **Resolución Ministerial N° 518-2015/MINSA**: Telemedicina

## 6. Métricas y Monitoreo

### KPIs del Sistema
| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Tiempo respuesta promedio | < 2 segundos | APM tools |
| Disponibilidad sistema | 99.9% | Uptime monitoring |
| Tiempo programación cita | < 5 minutos | User analytics |
| Satisfacción usuario | > 4.5/5 | Encuestas |
| Errores sistema | < 0.1% | Error tracking |
| Tiempo recuperación HC | < 30 segundos | Performance monitoring |

### Dashboard de Monitoreo
```mermaid
graph TD
    subgraph "Monitoreo Técnico"
        CPU[CPU Usage<br/>< 80%]
        MEM[Memory Usage<br/>< 85%]
        DISK[Disk Usage<br/>< 90%]
        NET[Network<br/>Latency < 100ms]
    end
    
    subgraph "Monitoreo Aplicación"
        RESP[Response Time<br/>< 2 segundos]
        AVAIL[Availability<br/>99.9%]
        ERR[Error Rate<br/>< 0.1%]
        TPS[Transactions/sec<br/>Monitor trending]
    end
    
    subgraph "Monitoreo Negocio"
        CITAS[Citas Programadas<br/>Monitor diario]
        HC[Historias Consultadas<br/>Monitor frecuencia]
        FARM[Medicamentos Dispensados<br/>Monitor stock]
        USERS[Usuarios Activos<br/>Monitor concurrencia]
    end
```

## 7. Plan de Implementación

### Fases de Desarrollo
1. **Fase 1 (3 meses)**: Módulo Pacientes + Citas Básicas
2. **Fase 2 (2 meses)**: Historia Clínica + Consultas Médicas
3. **Fase 3 (2 meses)**: Farmacia + Inventario
4. **Fase 4 (2 meses)**: Diagnóstico por Imágenes
5. **Fase 5 (1 mes)**: Odontología + Especialidades
6. **Fase 6 (1 mes)**: Optimización + Go Live

### Tecnologías Recomendadas por Presupuesto

#### Opción Económica (< $50,000)
- **Backend**: .NET Core + PostgreSQL
- **Frontend**: React + Bootstrap
- **Hosting**: Azure App Service Basic
- **Storage**: Azure Blob Storage

#### Opción Estándar ($50,000 - $150,000)
- **Backend**: .NET 8 + SQL Server Standard
- **Frontend**: React + Material UI
- **Hosting**: Azure App Service Standard + Redis
- **Storage**: Azure Premium Storage

#### Opción Enterprise (> $150,000)
- **Backend**: Microservicios + SQL Server Enterprise
- **Frontend**: React + Custom UI
- **Hosting**: Azure Kubernetes Service
- **Storage**: Azure Premium + CDN