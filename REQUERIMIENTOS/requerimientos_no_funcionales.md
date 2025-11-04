# REQUERIMIENTOS NO FUNCIONALES
## SISTEMA DE GESTIÓN DE BIBLIOTECA UNFV

### RNF1. RENDIMIENTO

**RNF1.1** Tiempo de respuesta
- **RNF1.1.1** Las consultas al catálogo deben responder en menos de 3 segundos
- **RNF1.1.2** El login de usuarios debe completarse en menos de 2 segundos
- **RNF1.1.3** La creación de préstamos debe completarse en menos de 5 segundos
- **RNF1.1.4** Los reportes simples deben generarse en menos de 10 segundos

**RNF1.2** Capacidad
- **RNF1.2.1** El sistema debe soportar hasta 500 usuarios concurrentes
- **RNF1.2.2** El sistema debe manejar hasta 50,000 libros en el catálogo
- **RNF1.2.3** El sistema debe procesar hasta 1,000 préstamos diarios
- **RNF1.2.4** La base de datos debe soportar hasta 100,000 registros de préstamos históricos

**RNF1.3** Escalabilidad
- **RNF1.3.1** El sistema debe permitir incrementar usuarios sin degradación significativa
- **RNF1.3.2** El sistema debe permitir agregar nuevos módulos sin afectar funcionalidad existente
- **RNF1.3.3** La arquitectura debe soportar despliegue distribuido en el futuro

### RNF2. SEGURIDAD

**RNF2.1** Autenticación
- **RNF2.1.1** Las contraseñas deben estar encriptadas usando BCrypt o superior
- **RNF2.1.2** El sistema debe implementar sesiones seguras con timeout automático
- **RNF2.1.3** Debe existir control de acceso basado en roles (RBAC)
- **RNF2.1.4** Las sesiones deben expirar después de 30 minutos de inactividad

**RNF2.2** Autorización
- **RNF2.2.1** Los usuarios solo deben acceder a funciones de su rol
- **RNF2.2.2** Debe validarse la autorización en cada solicitud al servidor
- **RNF2.2.3** Los alumnos solo deben ver sus propios datos personales
- **RNF2.2.4** Los administradores deben tener acceso completo con auditoría

**RNF2.3** Protección de datos
- **RNF2.3.1** Los datos personales deben estar protegidos según normativas de privacidad
- **RNF2.3.2** Las comunicaciones deben usar HTTPS en producción
- **RNF2.3.3** Debe implementarse validación de entrada para prevenir inyección SQL
- **RNF2.3.4** Los datos sensibles no deben aparecer en logs del sistema

**RNF2.4** Auditoría
- **RNF2.4.1** Todas las acciones administrativas deben quedar registradas
- **RNF2.4.2** Los intentos de acceso fallidos deben ser logueados
- **RNF2.4.3** Los cambios en datos críticos deben mantener trazabilidad
- **RNF2.4.4** Los logs de auditoría deben conservarse por al menos 1 año

### RNF3. USABILIDAD

**RNF3.1** Interfaz de usuario
- **RNF3.1.1** La interfaz debe ser intuitiva y requerir mínima capacitación
- **RNF3.1.2** Debe seguir estándares de diseño web moderno (Bootstrap/CSS)
- **RNF3.1.3** Los formularios deben incluir validación en tiempo real
- **RNF3.1.4** Debe proporcionar mensajes de error claros y constructivos

**RNF3.2** Accesibilidad
- **RNF3.2.1** La interfaz debe ser responsive para diferentes dispositivos
- **RNF3.2.2** Debe soportar navegadores web modernos (Chrome, Firefox, Edge)
- **RNF3.2.3** Los textos deben ser legibles con contraste adecuado
- **RNF3.2.4** Debe incluir shortcuts de teclado para operaciones frecuentes

**RNF3.3** Experiencia de usuario
- **RNF3.3.1** La navegación debe ser consistente en todo el sistema
- **RNF3.3.2** Las búsquedas deben incluir sugerencias automáticas
- **RNF3.3.3** Debe mostrar indicadores de progreso para operaciones largas
- **RNF3.3.4** Los usuarios deben recibir confirmación de acciones importantes

### RNF4. CONFIABILIDAD

**RNF4.1** Disponibilidad
- **RNF4.1.1** El sistema debe tener 99% de disponibilidad durante horario laboral
- **RNF4.1.2** Las interrupciones planificadas deben notificarse con 24 horas de anticipación
- **RNF4.1.3** El tiempo de recuperación ante fallas no debe exceder 4 horas
- **RNF4.1.4** Debe implementarse monitoreo automático del estado del sistema

**RNF4.2** Tolerancia a fallos
- **RNF4.2.1** El sistema debe manejar errores de conexión a base de datos gracefully
- **RNF4.2.2** Debe implementarse respaldo automático de transacciones críticas
- **RNF4.2.3** Los fallos parciales no deben afectar módulos no relacionados
- **RNF4.2.4** Debe existir rollback automático para transacciones fallidas

**RNF4.3** Integridad de datos
- **RNF4.3.1** La base de datos debe mantener consistencia referencial
- **RNF4.3.2** Las transacciones deben cumplir propiedades ACID
- **RNF4.3.3** Debe implementarse validación de integridad a nivel de aplicación
- **RNF4.3.4** Los respaldos de datos deben verificarse automáticamente

### RNF5. MANTENIBILIDAD

**RNF5.1** Código
- **RNF5.1.1** El código debe seguir convenciones de nomenclatura Java estándar
- **RNF5.1.2** Debe mantener cobertura de pruebas de al menos 70%
- **RNF5.1.3** La documentación del código debe estar actualizada
- **RNF5.1.4** Debe implementarse arquitectura modular (MVC)

**RNF5.2** Configuración
- **RNF5.2.1** Los parámetros del sistema deben ser configurables externamente
- **RNF5.2.2** Las configuraciones de base de datos deben separarse por ambiente
- **RNF5.2.3** Debe existir documentación completa de instalación y configuración
- **RNF5.2.4** Los cambios de configuración no deben requerir recompilación

**RNF5.3** Monitoreo
- **RNF5.3.1** El sistema debe generar logs estructurados y consultables
- **RNF5.3.2** Debe implementarse métricas de uso y rendimiento
- **RNF5.3.3** Los errores críticos deben generar alertas automáticas
- **RNF5.3.4** Debe existir dashboard de salud del sistema

### RNF6. PORTABILIDAD

**RNF6.1** Plataforma
- **RNF6.1.1** El sistema debe ejecutarse en sistemas operativos Windows y Linux
- **RNF6.1.2** Debe ser compatible con Java 17 o superior
- **RNF6.1.3** Debe soportar PostgreSQL como base de datos principal
- **RNF6.1.4** La aplicación debe ser desplegable en contenedores Docker

**RNF6.2** Migración
- **RNF6.2.1** Debe existir proceso documentado para migración de datos
- **RNF6.2.2** El sistema debe permitir importación/exportación de datos
- **RNF6.2.3** Debe soportar migración desde sistemas legacy (Oracle)
- **RNF6.2.4** Los respaldos deben ser restaurables en diferentes ambientes

### RNF7. COMPATIBILIDAD

**RNF7.1** Navegadores
- **RNF7.1.1** Debe funcionar en Chrome 90+ , Firefox 88+, Edge 90+
- **RNF7.1.2** La interfaz debe renderizar correctamente en resoluciones 1024x768 o superior
- **RNF7.1.3** Debe funcionar sin plugins adicionales del navegador
- **RNF7.1.4** JavaScript debe funcionar con las configuraciones de seguridad estándar

**RNF7.2** Dispositivos
- **RNF7.2.1** Debe ser funcional en tablets (resolución 768px mínimo)
- **RNF7.2.2** Debe adaptarse a smartphones (responsive design)
- **RNF7.2.3** Las funciones críticas deben ser accesibles desde dispositivos móviles
- **RNF7.2.4** Debe funcionar sin conexión para consultas básicas (futuro)

### RNF8. ESTÁNDARES Y REGULACIONES

**RNF8.1** Estándares técnicos
- **RNF8.1.1** Debe cumplir estándares de codificación Java (Google Style Guide)
- **RNF8.1.2** La base de datos debe seguir normalización 3NF mínimo
- **RNF8.1.3** Las APIs deben seguir convenciones RESTful
- **RNF8.1.4** Debe implementar patrones de diseño estándar (Repository, Service)

**RNF8.2** Regulaciones institucionales
- **RNF8.2.1** Debe cumplir políticas de TI de la UNFV
- **RNF8.2.2** Los datos deben cumplir normativas de protección de datos personales
- **RNF8.2.3** Debe integrarse con sistemas existentes de la universidad (futuro)
- **RNF8.2.4** Debe seguir procedimientos de desarrollo de software institucional

### RNF9. DOCUMENTACIÓN

**RNF9.1** Documentación técnica
- **RNF9.1.1** Debe existir documentación de arquitectura del sistema
- **RNF9.1.2** Todos los endpoints deben estar documentados
- **RNF9.1.3** La base de datos debe tener diccionario de datos completo
- **RNF9.1.4** Debe existir documentación de casos de prueba

**RNF9.2** Documentación de usuario
- **RNF9.2.1** Debe existir manual de usuario para administradores
- **RNF9.2.2** Debe existir guía de uso para estudiantes
- **RNF9.2.3** Debe documentarse todos los mensajes de error y su solución
- **RNF9.2.4** Debe existir documentación de procedimientos operativos

### RNF10. CAPACITACIÓN Y SOPORTE

**RNF10.1** Capacitación
- **RNF10.1.1** El sistema debe requerir máximo 4 horas de capacitación para usuarios básicos
- **RNF10.1.2** Los administradores requieren máximo 8 horas de capacitación
- **RNF10.1.3** Debe incluir material de capacitación integrado (tooltips, ayuda)
- **RNF10.1.4** Debe existir ambiente de pruebas para capacitación

**RNF10.2** Soporte
- **RNF10.2.1** Debe incluir sistema de ayuda contextual
- **RNF10.2.2** Los errores deben incluir códigos únicos para soporte
- **RNF10.2.3** Debe generar información de diagnóstico para troubleshooting
- **RNF10.2.4** Debe existir procedimiento de escalamiento de incidencias