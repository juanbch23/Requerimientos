# Diagrama de Componentes - Clínica UNFV

## Descripción
El diagrama de componentes muestra la arquitectura interna del sistema de la Clínica UNFV y las interfaces entre componentes.

## Componentes Principales:

### 1. Componente de Gestión de Pacientes
- **Responsabilidad**: Registro y gestión de datos de pacientes
- **Interfaces**: IPaciente, IHistoriaClinica
- **Dependencias**: Base de Datos Pacientes

### 2. Componente de Gestión de Citas
- **Responsabilidad**: Programación y control de citas
- **Interfaces**: ICita, IHorario
- **Dependencias**: Componente Pacientes, Componente Personal Médico

### 3. Componente de Historia Clínica
- **Responsabilidad**: Almacenamiento y gestión de historias médicas
- **Interfaces**: IHistoriaClinica, IArchivo
- **Dependencias**: Base de Datos Historias, Sistema de Archivos

### 4. Componente de Farmacia
- **Responsabilidad**: Gestión de medicamentos e inventario
- **Interfaces**: IFarmacia, IInventario
- **Dependencias**: Base de Datos Inventario

### 5. Componente de Diagnóstico por Imágenes
- **Responsabilidad**: Gestión de estudios médicos
- **Interfaces**: IImagenes, IEstudio
- **Dependencias**: Sistema de Archivos Imágenes

### 6. Componente de Odontología
- **Responsabilidad**: Gestión especializada dental
- **Interfaces**: IOdontologia, ITratamiento
- **Dependencias**: Componente Historia Clínica

### 7. Componente de Facturación
- **Responsabilidad**: Gestión de pagos y seguros
- **Interfaces**: IFacturacion, IPago
- **Dependencias**: Componente Seguros

```mermaid
graph TB
    %% Capa de Presentación
    subgraph "Capa de Presentación"
        WEB[Aplicación Web]
        DESK[Aplicación Desktop]
        MOV[Aplicación Móvil]
    end
    
    %% Capa de Servicios
    subgraph "Capa de Servicios"
        SERV_PAC[Servicio Pacientes]
        SERV_CITAS[Servicio Citas]
        SERV_HC[Servicio Historia Clínica]
        SERV_FARM[Servicio Farmacia]
        SERV_IMG[Servicio Imágenes]
        SERV_ODON[Servicio Odontología]
        SERV_FACT[Servicio Facturación]
    end
    
    %% Capa de Negocio
    subgraph "Capa de Negocio"
        COMP_PAC[Componente Pacientes]
        COMP_CITAS[Componente Citas]
        COMP_HC[Componente Historia Clínica]
        COMP_FARM[Componente Farmacia]
        COMP_IMG[Componente Diagnóstico]
        COMP_ODON[Componente Odontología]
        COMP_FACT[Componente Facturación]
    end
    
    %% Capa de Datos
    subgraph "Capa de Datos"
        DB_PAC[BD Pacientes]
        DB_HC[BD Historias Clínicas]
        DB_FARM[BD Farmacia]
        DB_CITAS[BD Citas]
        FILE_SYS[Sistema de Archivos]
    end
    
    %% Conexiones Capa Presentación -> Servicios
    WEB --> SERV_PAC
    WEB --> SERV_CITAS
    WEB --> SERV_HC
    DESK --> SERV_FARM
    DESK --> SERV_IMG
    DESK --> SERV_ODON
    MOV --> SERV_PAC
    MOV --> SERV_CITAS
    
    %% Conexiones Servicios -> Componentes
    SERV_PAC --> COMP_PAC
    SERV_CITAS --> COMP_CITAS
    SERV_HC --> COMP_HC
    SERV_FARM --> COMP_FARM
    SERV_IMG --> COMP_IMG
    SERV_ODON --> COMP_ODON
    SERV_FACT --> COMP_FACT
    
    %% Conexiones entre Componentes
    COMP_CITAS --> COMP_PAC
    COMP_HC --> COMP_PAC
    COMP_ODON --> COMP_HC
    COMP_FACT --> COMP_PAC
    COMP_FACT --> COMP_FARM
    
    %% Conexiones Componentes -> Datos
    COMP_PAC --> DB_PAC
    COMP_HC --> DB_HC
    COMP_FARM --> DB_FARM
    COMP_CITAS --> DB_CITAS
    COMP_IMG --> FILE_SYS
    COMP_HC --> FILE_SYS
```

## Interfaces Principales:

### IPaciente
```java
interface IPaciente {
    void registrarPaciente(DatosPaciente datos);
    Paciente buscarPaciente(String dni);
    void actualizarPaciente(Paciente paciente);
    List<Paciente> listarPacientes();
}
```

### ICita
```java
interface ICita {
    void programarCita(Cita cita);
    void cancelarCita(String idCita);
    List<Cita> consultarCitasPaciente(String dniPaciente);
    List<Cita> consultarCitasMedico(String idMedico);
}
```

### IHistoriaClinica
```java
interface IHistoriaClinica {
    void crearHistoria(String dniPaciente);
    void agregarConsulta(ConsultaMedica consulta);
    HistoriaClinica obtenerHistoria(String dniPaciente);
    void archivarHistoria(String numeroHistoria);
}
```

## Patrones Aplicados:
- **Repository Pattern**: Para acceso a datos
- **Service Layer**: Para lógica de negocio
- **Dependency Injection**: Para desacoplamiento
- **Factory Pattern**: Para creación de objetos
- **Observer Pattern**: Para notificaciones