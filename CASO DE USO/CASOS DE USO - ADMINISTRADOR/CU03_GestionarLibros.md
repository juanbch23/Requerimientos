# Caso de Uso: Gestionar Libros
## Referencias
RF3.1, RF3.1.1, RF3.1.2, RF3.1.3, RF3.1.4, RF3.2, RF3.3, RF3.4

## Actores
Administrador

## Tipo
Primario

## Propósito
Permitir al administrador realizar operaciones completas sobre el catálogo de libros: crear, modificar, consultar libros y gestionar sus ejemplares físicos.

## Resumen
El administrador accede al módulo de gestión de libros donde puede ver el catálogo completo, buscar libros específicos, crear nuevos registros de libros con sus autores y editorial, modificar información existente, y gestionar los ejemplares físicos de cada libro incluyendo su disponibilidad y estado.

## CURSO NORMAL DE EVENTOS

| Acción del Actor | Respuesta del Sistema |
|------------------|----------------------|
| 1. El caso de uso comienza cuando el administrador selecciona "Gestionar Libros" desde el dashboard administrativo. | 2. El sistema muestra la interfaz de gestión de libros con lista de libros existentes y opciones de búsqueda. |
| 3. El administrador puede realizar una de las siguientes acciones: Ver lista, Buscar libro, Crear libro, Editar libro, Gestionar ejemplares. | 4a. **Crear Libro**: El sistema muestra formulario con campos: ISBN, título, editorial, autores, fecha publicación, edición, páginas. |
| 5a. El administrador ingresa los datos del nuevo libro y selecciona/crea autores y editorial. | 6a. El sistema valida que el ISBN sea único (si se proporciona) y que los campos obligatorios estén completos. |
| 7a. El administrador confirma la creación del libro. | 8a. El sistema guarda el libro y sus relaciones con autores en la base de datos. |
| | 9a. El sistema muestra confirmación "Libro creado exitosamente" y actualiza la lista. |
| **3b.** El administrador selecciona "Editar" en un libro existente. | **4b.** El sistema muestra el formulario prellenado con los datos actuales del libro. |
| **5b.** El administrador modifica los datos necesarios (título, autores, editorial, etc.). | **6b.** El sistema valida los cambios y verifica integridad referencial. |
| **7b.** El administrador confirma las modificaciones. | **8b.** El sistema actualiza el registro del libro manteniendo la relación con ejemplares existentes. |
| **3c.** El administrador selecciona "Gestionar Ejemplares" en un libro. | **4c.** El sistema muestra la lista de ejemplares del libro con sus estados. |
| **5c.** El administrador puede agregar nuevos ejemplares o cambiar estado de existentes. | **6c.** El sistema asigna códigos únicos a nuevos ejemplares y actualiza estados. |

## CURSOS ALTERNATIVOS

**6a.1** Si el ISBN ya existe en el sistema:
- El sistema muestra "El ISBN ya está registrado para otro libro"
- Vuelve al paso 5a para corrección

**6a.2** Si faltan campos obligatorios (título):
- El sistema resalta campos faltantes en rojo
- Muestra mensajes de error específicos
- Vuelve al paso 5a

**8a.1** Si ocurre error al guardar en base de datos:
- El sistema muestra "Error al crear libro. Intente nuevamente"
- No se crean registros parciales
- Vuelve al paso 5a manteniendo datos ingresados

**6b.1** Si se intenta modificar ISBN por uno ya existente:
- El sistema muestra "El ISBN ya pertenece a otro libro"
- Mantiene el valor original
- Permite continuar con otros cambios

**6c.1** Si se intenta cambiar estado de ejemplar prestado a "no disponible":
- El sistema muestra "No se puede cambiar estado: ejemplar prestado actualmente"
- Mantiene estado actual
- Permite otras operaciones

## Diagrama PlantUML

```plantuml
@startuml
title Caso de Uso: Gestionar Libros

actor "Administrador" as A
participant "ControladorGestión\nLibros" as CGL
participant "LibroService" as LS
participant "AutorService" as AS
participant "EditorialService" as ES
participant "EjemplarService" as EjS
participant "LibroRepository" as LR
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
        LS -> AS: procesarAutores(autores)
        AS -> LS: autores procesados
        LS -> ES: procesarEditorial(editorial)
        ES -> LS: editorial procesada
        
        LS -> LR: save(nuevoLibro)
        LR -> BD: INSERT INTO LIBRO
        BD -> LR: libro guardado
        
        LS -> CGL: Libro creado exitosamente
        CGL -> A: "Libro creado exitosamente"
    end

else Editar Libro
    A -> CGL: Selecciona libro y "Editar"
    CGL -> LS: obtenerLibroPorId(id)
    LS -> LR: findById(id)
    LR -> BD: SELECT * FROM LIBRO WHERE id = ?
    BD -> LR: Datos del libro
    LR -> LS: Libro encontrado
    LS -> CGL: Datos del libro
    CGL -> A: Formulario prellenado
    
    A -> CGL: Modifica datos y confirma
    CGL -> LS: actualizarLibro(id, nuevosDatos)
    LS -> LR: save(libroModificado)
    LR -> BD: UPDATE LIBRO SET ... WHERE id = ?
    BD -> LR: confirmación
    LR -> LS: libro actualizado
    LS -> CGL: Actualización exitosa
    CGL -> A: "Libro actualizado exitosamente"

else Gestionar Ejemplares
    A -> CGL: Selecciona libro y "Gestionar Ejemplares"
    CGL -> EjS: obtenerEjemplaresPorLibro(libroId)
    EjS -> BD: SELECT * FROM EJEMPLAR WHERE libro_id = ?
    BD -> EjS: Lista de ejemplares
    EjS -> CGL: Lista de ejemplares
    CGL -> A: Interfaz de gestión de ejemplares
    
    alt Agregar Ejemplar
        A -> CGL: "Agregar Ejemplar"
        CGL -> EjS: crearEjemplar(libroId)
        EjS -> EjS: generarCodigoUnico()
        EjS -> BD: INSERT INTO EJEMPLAR
        BD -> EjS: ejemplar creado
        EjS -> CGL: Ejemplar agregado
        CGL -> A: "Ejemplar agregado exitosamente"
    
    else Cambiar Estado Ejemplar
        A -> CGL: Selecciona ejemplar y nuevo estado
        CGL -> EjS: cambiarEstadoEjemplar(ejemplarId, nuevoEstado)
        EjS -> BD: UPDATE EJEMPLAR SET estado = ? WHERE id = ?
        BD -> EjS: confirmación
        EjS -> CGL: Estado actualizado
        CGL -> A: "Estado actualizado exitosamente"
    end
end

@enduml
```

## Precondiciones
- El administrador debe estar autenticado y autorizado
- El sistema debe tener conexión a la base de datos
- Deben existir al menos los estados básicos de ejemplares en el sistema

## Postcondiciones
- **Éxito Crear**: Nuevo libro registrado con relaciones a autores y editorial
- **Éxito Editar**: Libro actualizado manteniendo integridad referencial  
- **Éxito Ejemplares**: Ejemplares creados/actualizados con códigos únicos
- **Fallo**: No se realizan cambios parciales en la base de datos

## Reglas de Negocio
- **RN1**: El ISBN debe ser único si se proporciona (opcional)
- **RN2**: El título del libro es obligatorio
- **RN3**: Un libro puede tener múltiples autores
- **RN4**: Un libro debe tener una editorial asociada
- **RN5**: Los ejemplares deben tener códigos únicos generados automáticamente
- **RN6**: No se puede eliminar un libro que tiene ejemplares prestados
- **RN7**: Los estados de ejemplares son: DISPONIBLE, PRESTADO, RESERVADO, DAÑADO, PERDIDO
- **RN8**: Solo ejemplares DISPONIBLES pueden ser prestados
- **RN9**: La fecha de publicación no puede ser futura
- **RN10**: Las páginas deben ser un número positivo