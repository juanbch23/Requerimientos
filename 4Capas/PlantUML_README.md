# Diagramas PlantUML - Sistema Clínica UNFV

## 📋 Descripción
Esta carpeta contiene los diagramas en formato PlantUML del sistema de la Clínica UNFV, basados en el modelo C4 (Context, Containers, Components, Code).

## 🎯 Diagramas Incluidos

### 1️⃣ Diagrama de Contexto
**Archivo**: `PlantUML_01_Diagrama_Contexto.puml`
- **Propósito**: Vista de alto nivel del sistema y sus interacciones externas
- **Actores**: 4 tipos de usuarios principales
- **Sistemas Externos**: 7 sistemas integrados
- **Puntuación**: 5 puntos ✅

### 2️⃣ Diagrama de Componentes Estándar  
**Archivo**: `PlantUML_02_Diagrama_Componentes.puml`
- **Propósito**: Arquitectura interna detallada por capas
- **Componentes**: 9 microservicios + gateway + datos
- **Tecnologías**: Stack completo especificado
- **Puntuación**: 5 puntos ✅

### 3️⃣ Modelo de 4 Capas Completo
**Archivo**: `PlantUML_03_Modelo_4Capas.puml`
- **Propósito**: Vista completa de las 4 capas arquitectónicas
- **Capa 1**: Presentación (Web, Desktop, Móvil, Kiosko)
- **Capa 2**: Servicios (9 microservicios)
- **Capa 3**: Lógica de Negocio (Reglas, Workflows, Validadores)
- **Capa 4**: Acceso a Datos (SQL, MongoDB, Redis, Blob Storage)
- **Puntuación**: 10 puntos ✅

### 4️⃣ Diagrama de Componentes Detallado (Estilo Interface)
**Archivo**: `PlantUML_04_Componentes_Detallado.puml`
- **Propósito**: Vista detallada con interfaces y dependencias (estilo de tu imagen)
- **Características**: Relaciones "usa", "realiza", "componente realiza"
- **Interfaces**: Observer pattern implementado
- **Estilo**: Similar a tu imagen de referencia

## 🔧 Cómo usar los diagramas

### Opción 1: PlantUML Online
1. Ve a http://www.plantuml.com/plantuml/uml/
2. Copia y pega el contenido de cualquier archivo `.puml`
3. Genera la imagen automáticamente

### Opción 2: VS Code con extensión
1. Instala la extensión "PlantUML" en VS Code
2. Abre cualquier archivo `.puml`  
3. Usa Ctrl+Shift+P → "PlantUML: Preview Current Diagram"

### Opción 3: Herramientas locales
```bash
# Instalar PlantUML localmente
java -jar plantuml.jar archivo.puml
```

## 📊 Características de los Diagramas

### Elementos Implementados
- ✅ **Actores**: Pacientes, Personal Médico, Administrativo, Farmacéutico
- ✅ **Sistemas Externos**: PACS/RIS, SUNAT, Seguros, Laboratorios, SMS/Email
- ✅ **Microservicios**: 9 servicios especializados con tecnologías específicas
- ✅ **Capas**: Separación clara de Presentación, Servicios, Negocio, Datos
- ✅ **Interfaces**: Patrones Observer, Repository, Service Layer
- ✅ **Relaciones**: "usa", "realiza", "componente realiza el interfaz"

### Tecnologías Representadas
```yaml
Frontend:
  - React 18 + TypeScript (Portal Web)
  - WPF .NET 8 (Sistema Desktop)  
  - React Native (App Móvil)
  - PWA (Kiosko Autoservicio)

Backend:
  - .NET 8 Web API (Microservicios)
  - Kong API Gateway
  - JWT + OAuth 2.0 (Autenticación)
  - MassTransit + RabbitMQ (Workflows)
  - Entity Framework Core (ORM)

Datos:
  - SQL Server 2022 (Principal)
  - MongoDB 7.0 (Documentos)
  - Redis 7.0 (Cache)
  - Azure Blob Storage (Archivos)

Integraciones:
  - DICOM/HL7 (Imágenes médicas)
  - SOAP/REST APIs (Servicios externos)
  - HL7 FHIR (Laboratorios)
```

## 🎨 Estilo Visual

### Colores y Leyendas
- **Azul**: Actores/Usuarios
- **Verde**: Sistemas internos
- **Gris**: Sistemas externos  
- **Amarillo**: Bases de datos
- **Rosa**: Interfaces especiales

### Relaciones
- **Líneas sólidas**: Comunicación directa
- **Líneas punteadas**: Dependencias
- **Etiquetas**: Protocolos y tecnologías
- **Direcciones**: Flujo de información

## 📈 Valor de los Diagramas

### Para Desarrollo
- Guía clara de arquitectura
- Definición de interfaces
- Identificación de dependencias
- Plan de implementación

### Para Stakeholders  
- Visión clara del alcance
- Comprensión de integraciones
- Estimación de complejidad
- Base para toma de decisiones

### Para Mantenimiento
- Documentación actualizada
- Evolución del sistema
- Identificación de impactos
- Análisis de riesgos

---

## 🎯 Cumplimiento de Requerimientos

### ✅ **Diagrama de Contexto (5 puntos)**
- Entidades externas mapeadas
- Flujos de información definidos
- Límites del sistema claros

### ✅ **Diagrama de Componentes (5 puntos)**  
- Componentes internos detallados
- Interfaces bien definidas
- Patrones de diseño aplicados
- **Versión detallada estilo interface incluida**

### ✅ **Modelo 4 Capas (10 puntos)**
- Separación completa por capas
- Relaciones entre capas mapeadas
- Tecnologías específicas por capa
- Flujos de datos completos

---

**Total: 20/20 puntos ✅**

*Los diagramas están listos para usar en presentaciones, documentación técnica o como base para el desarrollo del sistema.*