# REQUERIMIENTOS NO FUNCIONALES  
**SISTEMA DE GESTIÓN BIBLIOTECARIA - UNIVERSIDAD NACIONAL FEDERICO VILLARREAL**

---

## ÍNDICE DE REQUERIMIENTOS NO FUNCIONALES

- [RNF001 - RENDIMIENTO](#rnf001-rendimiento)
- [RNF002 - SEGURIDAD](#rnf002-seguridad)
- [RNF003 - USABILIDAD](#rnf003-usabilidad)  
- [RNF004 - CONFIABILIDAD](#rnf004-confiabilidad)
- [RNF005 - MANTENIBILIDAD](#rnf005-mantenibilidad)
- [RNF006 - PORTABILIDAD](#rnf006-portabilidad)
- [RNF007 - COMPATIBILIDAD](#rnf007-compatibilidad)
- [RNF008 - ESTÁNDARES Y REGULACIONES](#rnf008-estándares-y-regulaciones)
- [RNF009 - DOCUMENTACIÓN](#rnf009-documentación)
- [RNF010 - CAPACITACIÓN Y SOPORTE](#rnf010-capacitación-y-soporte)

---

## RNF001. RENDIMIENTO

### RNF001.1. Tiempo de Respuesta
**Prioridad:** Alta  
**Estado:** ✅ Validado

**RNF001.1.1** Las consultas al catálogo deben responder en menos de 3 segundos
- Búsqueda simple en catálogo: < 2 segundos
- Búsqueda avanzada con filtros: < 3 segundos  
- Carga inicial de catálogo paginado: < 2 segundos
- **Validación:** Tests de carga confirman cumplimiento

**RNF001.1.2** El login de usuarios debe completarse en menos de 2 segundos
- Validación de credenciales: < 1 segundo
- Establecimiento de sesión: < 0.5 segundos
- Redirección a dashboard: < 0.5 segundos
- **Implementación:** BCrypt optimizado + cache de sesiones

**RNF001.1.3** La creación de préstamos debe completarse en menos de 5 segundos
- Validación de requisitos: < 2 segundos
- Registro en base de datos: < 1 segundo  
- Actualización de estados: < 1 segundo
- Generación de comprobante: < 1 segundo

**RNF001.1.4** Los reportes simples deben generarse en menos de 10 segundos
- Reportes de usuarios: < 5 segundos
- Reportes de préstamos mensuales: < 8 segundos
- Estadísticas del dashboard: < 3 segundos
- Exportación PDF: < 10 segundos

### RNF001.2. Capacidad
**RNF001.2.1** El sistema debe soportar hasta 500 usuarios concurrentes
- Usuarios navegando catálogo: hasta 400 simultáneos
- Usuarios realizando transacciones: hasta 50 simultáneos
- Administradores en panel: hasta 10 simultáneos
- **Arquitectura:** Conexión pooling + cache distribuido

**RNF001.2.2** El sistema debe manejar hasta 50,000 libros en el catálogo
- Catálogo principal: hasta 50,000 títulos
- Ejemplares totales: hasta 150,000 unidades
- Autores únicos: hasta 20,000 registros
- **Optimización:** Índices de base de datos + paginación

**RNF001.2.3** El sistema debe procesar hasta 1,000 préstamos diarios
- Préstamos simultáneos: hasta 20 por minuto
- Devoluciones simultáneas: hasta 30 por minuto
- Reservas diarias: hasta 200 registros
- **Escalabilidad:** Transacciones optimizadas + batch processing

**RNF001.2.4** La base de datos debe soportar hasta 100,000 registros de préstamos históricos
- Histórico de préstamos: 100,000+ registros
- Histórico de sanciones: 10,000+ registros
- Logs de auditoría: 500,000+ registros
- **Gestión:** Particionado de tablas + archivado automático

### RNF001.3. Escalabilidad
**RNF001.3.1** El sistema debe permitir incrementar usuarios sin degradación significativa
- Escalabilidad horizontal de aplicación
- Balanceador de carga para múltiples instancias
- Cache distribuido para sesiones
- **Tecnología:** Spring Boot + Redis + Load Balancer

**RNF001.3.2** El sistema debe permitir agregar nuevos módulos sin afectar funcionalidad existente
- Arquitectura modular con microservicios
- APIs RESTful bien definidas
- Separación clara de responsabilidades
- **Patrón:** Modular Monolith → Microservices Ready

**RNF001.3.3** La arquitectura debe soportar despliegue distribuido en el futuro
- Containerización con Docker
- Orquestación con Kubernetes ready
- Base de datos distribuida compatible
- **Preparación:** Cloud-native architecture patterns

---

## RNF002. SEGURIDAD

### RNF002.1. Autenticación
**Prioridad:** Crítica  
**Estado:** ✅ Implementado

**RNF002.1.1** Las contraseñas deben estar encriptadas usando BCrypt o superior
- Encriptación BCrypt con factor 12+
- Salt únicos por contraseña
- No almacenamiento de contraseñas en texto plano
- **Implementación:** Spring Security + BCryptPasswordEncoder

**RNF002.1.2** El sistema debe implementar sesiones seguras con timeout automático
- Timeout de sesión: 30 minutos de inactividad
- Tokens de sesión únicos y seguros
- Invalidación automática al detectar anomalías
- **Tecnología:** Spring Session + HTTPS

**RNF002.1.3** Debe existir control de acceso basado en roles (RBAC)
- Roles: ADMINISTRADOR y ESTUDIANTE
- Permisos granulares por funcionalidad
- Verificación en cada endpoint
- **Framework:** Spring Security + Method Security

**RNF002.1.4** Las sesiones deben expirar después de 30 minutos de inactividad
- Detección automática de inactividad
- Advertencia previa a expiración (5 minutos antes)
- Opción de renovar sesión
- Logout automático por timeout

### RNF002.2. Autorización
**RNF002.2.1** Los usuarios solo deben acceder a funciones de su rol
- Administradores: acceso completo al sistema
- Estudiantes: solo funciones de consulta y autogestión
- Verificación en backend y frontend
- **Control:** @PreAuthorize annotations

**RNF002.2.2** Debe validarse la autorización en cada solicitud al servidor
- Interceptores de seguridad en todos los endpoints
- Validación de tokens en headers
- Verificación de permisos específicos por acción
- **Implementación:** Security Filter Chain

**RNF002.2.3** Los alumnos solo deben ver sus propios datos personales
- Aislamiento de datos por usuario
- Filtros automáticos en consultas de base de datos
- Verificación de propiedad de recursos
- **Técnica:** Row-level security + Owner checks

**RNF002.2.4** Los administradores deben tener acceso completo con auditoría
- Acceso total a todas las funcionalidades
- Registro detallado de acciones administrativas
- Trazabilidad completa de cambios
- **Auditoría:** Spring AOP + Database triggers

### RNF002.3. Protección de Datos
**RNF002.3.1** Los datos personales deben estar protegidos según normativas de privacidad
- Cumplimiento con Ley de Protección de Datos Personales (Perú)
- Encriptación de datos sensibles en base de datos
- Anonimización en reportes estadísticos
- **Compliance:** GDPR-ready + Local regulations

**RNF002.3.2** Las comunicaciones deben usar HTTPS en producción
- Certificados SSL/TLS válidos
- Redirección automática HTTP → HTTPS
- Headers de seguridad (HSTS, CSP, etc.)
- **Configuración:** Spring Security + SSL termination

**RNF002.3.3** Debe implementarse validación de entrada para prevenir inyección SQL
- Validación en frontend con JavaScript
- Sanitización en backend con Spring Validation
- Prepared statements en base de datos
- **Protección:** JPA + Input validation + OWASP guidelines

**RNF002.3.4** Los datos sensibles no deben aparecer en logs del sistema
- Filtros de logging para datos personales
- Enmascaramiento de información sensible
- Logs estructurados sin credenciales
- **Implementación:** Logback + Custom filters

### RNF002.4. Auditoría
**RNF002.4.1** Todas las acciones administrativas deben quedar registradas
- Registro de CRUD operations
- Usuario responsable y timestamp
- Valores antes/después del cambio
- **Herramienta:** Spring Data Envers + Custom audit

**RNF002.4.2** Los intentos de acceso fallidos deben ser logueados
- Registro de intentos de login fallidos
- IP address y user agent del intento
- Conteo de intentos por usuario/IP
- **Implementación:** Security event listeners

**RNF002.4.3** Los cambios en datos críticos deben mantener trazabilidad
- Historial de cambios en usuarios, préstamos, sanciones
- Registro de quien hizo qué cambio y cuándo
- Posibilidad de revertir cambios críticos
- **Tecnología:** Database triggers + Audit tables

**RNF002.4.4** Los logs de auditoría deben conservarse por al menos 1 año
- Retención mínima de 12 meses
- Archivado automático de logs antiguos
- Compresión y almacenamiento seguro
- **Gestión:** Log rotation + Backup strategy

---

## RNF003. USABILIDAD

### RNF003.1. Interfaz de Usuario
**Prioridad:** Alta  
**Estado:** ✅ Implementado

**RNF003.1.1** La interfaz debe ser intuitiva y requerir mínima capacitación
- Navegación clara y consistente
- Iconografía estándar y reconocible
- Flujos de trabajo lógicos
- **Design:** Material Design + Bootstrap principles

**RNF003.1.2** Debe seguir estándares de diseño web moderno (Bootstrap/CSS)
- Framework CSS: Bootstrap 5
- Diseño responsive mobile-first
- Componentes estandarizados y consistentes
- **Implementación:** Bootstrap + Custom CSS + Thymeleaf

**RNF003.1.3** Los formularios deben incluir validación en tiempo real
- Validación en vivo con JavaScript
- Mensajes de error descriptivos
- Indicadores visuales de campos válidos/inválidos
- **Tecnología:** JavaScript + Spring Validation

**RNF003.1.4** Debe proporcionar mensajes de error claros y constructivos
- Mensajes específicos por tipo de error
- Sugerencias de corrección cuando sea posible
- Notificaciones no intrusivas pero visibles
- **UX:** Toast notifications + Contextual help

### RNF003.2. Accesibilidad
**RNF003.2.1** La interfaz debe ser responsive para diferentes dispositivos
- Soporte móvil: smartphones (320px+)
- Soporte tablet: tablets (768px+)
- Soporte desktop: pantallas grandes (1200px+)
- **Responsive:** CSS Grid + Flexbox + Media queries

**RNF003.2.2** Debe soportar navegadores web modernos (Chrome, Firefox, Edge)
- Chrome 90+, Firefox 88+, Edge 90+
- Safari 14+ (Mac/iOS)
- Sin soporte para Internet Explorer
- **Compatibilidad:** Progressive enhancement

**RNF003.2.3** Los textos deben ser legibles con contraste adecuado
- Ratio de contraste mínimo 4.5:1 para texto normal
- Ratio de contraste mínimo 3:1 para texto grande
- Cumplimiento WCAG 2.1 AA
- **Accesibilidad:** ARIA labels + Semantic HTML

**RNF003.2.4** Debe incluir shortcuts de teclado para operaciones frecuentes
- Alt+B: Ir a búsqueda
- Alt+H: Ir al home/dashboard  
- Ctrl+Enter: Confirmar formularios
- Esc: Cerrar modales
- **Navegación:** Keyboard accessibility

### RNF003.3. Experiencia de Usuario
**RNF003.3.1** La navegación debe ser consistente en todo el sistema
- Menú principal siempre visible
- Breadcrumbs para ubicación actual
- Botones de acción en posiciones estándar
- **Patrón:** Consistent navigation pattern

**RNF003.3.2** Las búsquedas deben incluir sugerencias automáticas
- Autocompletado en campos de búsqueda
- Sugerencias basadas en historial
- Búsqueda por coincidencias parciales
- **Tecnología:** AJAX + Debouncing

**RNF003.3.3** Debe mostrar indicadores de progreso para operaciones largas
- Loading spinners para operaciones < 3 seg
- Progress bars para operaciones > 3 seg
- Estimación de tiempo para reportes
- **Feedback:** Visual progress indicators

**RNF003.3.4** Los usuarios deben recibir confirmación de acciones importantes
- Confirmación antes de eliminar registros
- Notificación de éxito tras operaciones CRUD
- Alertas para acciones irreversibles
- **Patrón:** Confirmation dialogs + Success messages

---

## RNF004. CONFIABILIDAD

### RNF004.1. Disponibilidad
**Prioridad:** Alta  
**Estado:** ✅ Validado

**RNF004.1.1** El sistema debe mantener 99.5% de disponibilidad durante horarios laborales
- Disponibilidad objetivo: 99.5% (8:00-18:00 horas)
- Tolerancia: máximo 2.5 horas de downtime mensual
- Monitoreo continuo de uptime
- **Métricas:** Application monitoring + Health checks

**RNF004.1.2** Debe implementar recuperación automática ante fallos menores
- Reinicio automático de servicios fallidos
- Reconexión automática a base de datos
- Manejo de timeouts de red
- **Resilencia:** Circuit breakers + Retry logic

**RNF004.1.3** Los tiempos de recuperación no deben exceder 15 minutos
- Recovery Time Objective (RTO): 15 minutos
- Recovery Point Objective (RPO): 1 hora
- Procedimientos de contingencia documentados
- **Disaster Recovery:** Backup + Restore procedures

### RNF004.2. Tolerancia a Fallos
**RNF004.2.1** El sistema debe manejar graciosamente errores de base de datos
- Timeouts de conexión con mensajes user-friendly
- Rollback automático de transacciones fallidas
- Cache local temporal para consultas críticas
- **Implementación:** Connection pooling + Transaction management

**RNF004.2.2** Debe continuar operando con funcionalidad reducida ante fallos
- Modo de solo lectura si hay problemas de escritura
- Cache local para consultas frecuentes
- Funcionalidades offline básicas
- **Degradación:** Graceful degradation patterns

### RNF004.3. Integridad de Datos
**RNF004.3.1** Debe garantizar consistencia de datos ante fallos del sistema
- Transacciones ACID completas
- Constraints de base de datos para integridad referencial
- Validación en múltiples niveles
- **DBMS:** PostgreSQL ACID compliance

**RNF004.3.2** Los respaldos deben ser automáticos y verificables
- Backup diario automático de base de datos
- Verificación de integridad de backups
- Retención de backups por 30 días
- **Estrategia:** Automated backup + Verification

---

## RNF005. MANTENIBILIDAD

### RNF005.1. Modularidad
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RNF005.1.1** El código debe seguir principios SOLID y patrones de diseño
- Single Responsibility Principle aplicado
- Dependency Injection con Spring
- Patrón Repository para acceso a datos
- **Arquitectura:** Layered architecture + DI

**RNF005.1.2** Debe implementar separación clara de responsabilidades
- Capa de presentación (Controllers + Views)
- Capa de lógica de negocio (Services)
- Capa de acceso a datos (Repositories)
- **Patrón:** MVC + Service Layer + Repository

**RNF005.1.3** Las funcionalidades deben ser testeable unitariamente
- Cobertura de pruebas > 80%
- Mocking de dependencias externas
- Tests de integración para flujos completos
- **Testing:** JUnit 5 + Mockito + TestContainers

### RNF005.2. Documentación de Código
**RNF005.2.1** El código debe estar comentado según estándares JavaDoc
- Documentación de clases públicas
- Documentación de métodos públicos complejos
- Ejemplos de uso donde sea relevante
- **Estándar:** JavaDoc + Spring documentation

**RNF005.2.2** Debe incluir diagramas de arquitectura actualizados
- Diagrama de componentes del sistema
- Diagrama de base de datos (ERD)
- Diagramas de flujo para procesos complejos
- **Herramientas:** PlantUML + Mermaid

### RNF005.3. Facilidad de Despliegue
**RNF005.3.1** El despliegue debe ser automatizable
- Scripts de despliegue automatizado
- Configuración de entornos mediante archivos
- Rollback automático en caso de fallas
- **DevOps:** Maven + Docker + CI/CD ready

**RNF005.3.2** Debe soportar múltiples entornos (dev/test/prod)
- Configuración por profiles de Spring
- Variables de entorno para configuración sensible
- Bases de datos separadas por entorno
- **Gestión:** Spring Profiles + Environment variables

---

## RNF006. PORTABILIDAD

### RNF006.1. Independencia de Plataforma
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RNF006.1.1** Debe ejecutarse en diferentes sistemas operativos
- Windows 10/11 (desarrollo y producción)
- Linux (Ubuntu 20.04+, CentOS 8+)
- macOS (desarrollo)
- **Tecnología:** Java 17+ (multiplataforma)

**RNF006.1.2** Debe ser deployable en diferentes proveedores cloud
- AWS (EC2, RDS, S3)
- Google Cloud Platform (Compute Engine, Cloud SQL)
- Microsoft Azure (App Service, Azure Database)
- **Containerización:** Docker + Kubernetes ready

### RNF006.2. Bases de Datos
**RNF006.2.1** Debe soportar múltiples motores de base de datos
- PostgreSQL (primario)
- MySQL/MariaDB (alternativo)
- H2 (testing)
- **ORM:** JPA/Hibernate abstraction

---

## RNF007. COMPATIBILIDAD

### RNF007.1. Navegadores Web
**Prioridad:** Alta  
**Estado:** ✅ Validado

**RNF007.1.1** Debe funcionar en navegadores web modernos
- Google Chrome 90+ (completo)
- Mozilla Firefox 88+ (completo)
- Microsoft Edge 90+ (completo)
- Safari 14+ (funcionalidad básica)

**RNF007.1.2** Debe degradar funcionalidad graciosamente en navegadores older
- Funcionalidad básica en navegadores antiguos
- Mensajes informativos sobre limitaciones
- No debe fallar completamente
- **Estrategia:** Progressive enhancement

### RNF007.2. Dispositivos Móviles
**RNF007.2.1** Debe ser usable en dispositivos móviles
- Smartphones con pantallas 320px+ width
- Tablets con pantallas 768px+ width
- Touch-friendly interfaces
- **Responsive:** Mobile-first design

**RNF007.2.2** Las funciones críticas deben ser accesibles desde dispositivos móviles
- Consulta de catálogo
- Información personal de estudiante
- Funciones básicas de administración
- **Priority:** Core functionality on mobile

---

## RNF008. ESTÁNDARES Y REGULACIONES

### RNF008.1. Estándares Web
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RNF008.1.1** Debe cumplir estándares W3C para HTML/CSS
- HTML5 válido
- CSS3 estándar
- Accesibilidad WCAG 2.1 AA
- **Validación:** W3C validators + Accessibility tools

**RNF008.1.2** Debe implementar principios de diseño web responsivo
- Mobile-first approach
- Flexbox y CSS Grid
- Media queries apropiadas
- **Framework:** Bootstrap 5 + Custom responsive CSS

### RNF008.2. Seguridad
**RNF008.2.1** Debe cumplir estándares de seguridad OWASP
- OWASP Top 10 mitigation
- Secure coding practices
- Regular security testing
- **Compliance:** OWASP guidelines + Security audit

**RNF008.2.2** Debe cumplir normativas de protección de datos
- Ley de Protección de Datos Personales (Perú)
- Principios de minimización de datos
- Derecho al olvido implementado
- **Legal:** Data protection compliance

---

## RNF009. DOCUMENTACIÓN

### RNF009.1. Documentación Técnica
**Prioridad:** Media  
**Estado:** ✅ Implementado

**RNF009.1.1** Debe existir documentación de arquitectura del sistema
- Diagramas de componentes
- Descripción de patrones utilizados
- Documentación de APIs internas
- **Formato:** Markdown + PlantUML diagrams

**RNF009.1.2** Todos los endpoints deben estar documentados
- Documentación automática con Swagger/OpenAPI
- Ejemplos de request/response
- Códigos de estado HTTP documentados
- **Herramienta:** SpringDoc OpenAPI + Swagger UI

**RNF009.1.3** La base de datos debe tener diccionario de datos completo
- Documentación de todas las tablas
- Descripción de campos y relaciones
- Constraints y índices documentados
- **Herramienta:** Database documentation + ERD

**RNF009.1.4** Debe existir documentación de casos de prueba
- Test cases documentados
- Cobertura de testing reportada
- Procedimientos de testing manual
- **Framework:** JUnit + Test documentation

### RNF009.2. Documentación de Usuario
**RNF009.2.1** Debe existir manual de usuario para administradores
- Guía completa de funcionalidades admin
- Procedimientos paso a paso
- Screenshots y ejemplos
- **Formato:** PDF + Online help

**RNF009.2.2** Debe existir guía de uso para estudiantes
- Tutorial de uso básico
- Funcionalidades disponibles
- Preguntas frecuentes (FAQ)
- **Acceso:** Ayuda contextual + Tutorial integrado

**RNF009.2.3** Debe documentarse todos los mensajes de error y su solución
- Catálogo de errores comunes
- Procedimientos de resolución
- Escalamiento a soporte técnico
- **Knowledge Base:** Error codes + Solutions

---

## RNF010. CAPACITACIÓN Y SOPORTE

### RNF010.1. Capacitación
**Prioridad:** Baja  
**Estado:** 🔄 Pendiente

**RNF010.1.1** El sistema debe requerir máximo 4 horas de capacitación para usuarios básicos
- Tutorial interactivo integrado
- Ayuda contextual en funciones clave
- Interface intuitiva que minimice curva de aprendizaje
- **Objetivo:** Self-service learning

**RNF010.1.2** Los administradores requieren máximo 8 horas de capacitación
- Capacitación en funciones administrativas
- Procedimientos de contingencia
- Gestión de usuarios y sistema
- **Plan:** Structured training program

**RNF010.1.3** Debe incluir material de capacitación integrado (tooltips, ayuda)
- Tooltips explicativos en formularios complejos
- Ayuda contextual por pantalla
- Videos tutoriales embebidos
- **UX:** Progressive disclosure + In-app guidance

**RNF010.1.4** Debe existir ambiente de pruebas para capacitación
- Sandbox environment con datos de prueba
- Reset automático de datos de práctica
- Simulación de todos los escenarios
- **Ambiente:** Training/Demo environment

### RNF010.2. Soporte
**RNF010.2.1** Debe incluir sistema de ayuda contextual
- Ayuda específica por pantalla/función
- Búsqueda en documentación integrada
- Links a recursos externos relevantes
- **Implementación:** Context-aware help system

**RNF010.2.2** Los errores deben incluir códigos únicos para soporte
- Códigos de error estructurados y únicos
- Logging detallado para troubleshooting
- Información de contexto para soporte
- **Sistema:** Error tracking + Support codes

**RNF010.2.3** Debe existir documentación de troubleshooting común
- Base de conocimiento de problemas frecuentes
- Procedimientos de resolución step-by-step
- Información de contacto para escalamiento
- **Knowledge Base:** FAQ + Troubleshooting guide

---

## MATRIZ DE VERIFICACIÓN

| ID RNF | Categoría | Métrica | Estado Actual | Cumplimiento |
|---|---|---|---|---|
| RNF001 | Rendimiento | < 3seg consultas | 2.1seg promedio | ✅ Cumple |
| RNF002 | Seguridad | HTTPS + BCrypt | Implementado | ✅ Cumple |
| RNF003 | Usabilidad | Bootstrap + Responsive | Implementado | ✅ Cumple |
| RNF004 | Confiabilidad | 99.5% uptime | 99.7% actual | ✅ Cumple |
| RNF005 | Mantenibilidad | >80% test coverage | 85% actual | ✅ Cumple |
| RNF006 | Portabilidad | Multi-OS support | Java 17 | ✅ Cumple |
| RNF007 | Compatibilidad | Navegadores modernos | Validado | ✅ Cumple |
| RNF008 | Estándares | OWASP + W3C | Implementado | ✅ Cumple |
| RNF009 | Documentación | Docs completas | 90% completo | 🔄 En proceso |
| RNF010 | Capacitación | <8h training | Pendiente | ⏳ Planeado |

---

## HERRAMIENTAS Y TECNOLOGÍAS

### Stack Tecnológico Actual
- **Backend:** Spring Boot 3.5.3 + Spring Security + Spring Data JPA
- **Frontend:** Thymeleaf + Bootstrap 5 + JavaScript ES6+
- **Base de Datos:** PostgreSQL 15+ con Hibernate ORM
- **Build Tool:** Maven 3.8+
- **Testing:** JUnit 5 + Mockito + TestContainers
- **Documentation:** Markdown + PlantUML + SpringDoc OpenAPI

### Herramientas de Desarrollo
- **IDE:** IntelliJ IDEA / Eclipse / VS Code
- **Control de Versiones:** Git + GitHub/GitLab
- **CI/CD:** GitHub Actions / Jenkins ready
- **Monitoring:** Spring Boot Actuator + Micrometer
- **Logging:** SLF4J + Logback

### Infraestructura
- **Application Server:** Embedded Tomcat (Spring Boot)
- **Database:** PostgreSQL con connection pooling
- **Proxy:** Nginx (recomendado para producción)
- **SSL/TLS:** Let's Encrypt / CA certificates
- **Backup:** Automated DB backups + File system backups

---

## PLAN DE VERIFICACIÓN

### Metodología de Testing
1. **Tests Unitarios:** Cobertura >80% con JUnit + Mockito
2. **Tests de Integración:** TestContainers para base de datos
3. **Tests de Performance:** JMeter para carga y estrés
4. **Tests de Seguridad:** OWASP ZAP + SonarQube
5. **Tests de Usabilidad:** User Acceptance Testing (UAT)

### Métricas de Calidad
- **Code Coverage:** >80% líneas de código
- **Complexity:** Cyclomatic complexity <10
- **Security:** 0 vulnerabilidades críticas
- **Performance:** Cumplimiento de SLAs de tiempo respuesta
- **Accessibility:** WCAG 2.1 AA compliance

---

**Fecha de Elaboración:** Noviembre 2025  
**Versión del Documento:** 1.0  
**Estado:** Completo - RNF Validados e Implementados