## Resumen de apuntes
Claro, aquí tienes el apunte de estudio en formato Markdown, explicando los cambios del commit.

***

# Apunte de Estudio: Búsqueda de Productos Case-Insensitive

## Contexto

Este apunte se basa en una actualización realizada en el `products.service.ts` del proyecto **Teslo Shop**. El cambio mejora la funcionalidad de búsqueda de un producto por su término (título o slug).

## El Cambio Clave: Búsquedas Flexibles

La modificación principal se centra en cómo la base de datos compara el término de búsqueda, pasando de una búsqueda estricta (sensible a mayúsculas y minúsculas) a una flexible e inteligente.

### Código Anterior

Antes, la búsqueda era directa y sensible a mayúsculas/minúsculas. Si un producto se llamaba “Shirt” y el usuario buscaba “shirt”, no lo encontraba.

.where('title = :title OR slug = :slug', {
  title: term,
  slug: term,
})

### Código Nuevo

Ahora, la consulta se transforma para ignorar las diferencias entre mayúsculas y minúsculas, mejorando la experiencia del usuario.

.where('UPPER(title) = :title OR slug = :slug', {
  title: term.toUpperCase(),
  slug: term.toLowerCase(),
})

## Análisis de la Mejora

1.  **Búsqueda por Título Case-Insensitive**:
    *   `UPPER(title) = :title`: Esta es la parte más importante. Se utiliza la función `UPPER()` de SQL para convertir el campo `title` de la base de datos a mayúsculas *antes* de compararlo.
    *   `title: term.toUpperCase()`: Para que la comparación funcione, el término de búsqueda que introduce el usuario (`term`) también se convierte a mayúsculas desde la aplicación.
    *   **Resultado**: No importa si el usuario busca “Tesla”, “tesla” o “TESLA”; la base de datos siempre comparará versiones en mayúsculas, encontrando el producto correcto.

2.  **Estandarización de la Búsqueda por Slug**:
    *   `slug: term.toLowerCase()`: Aunque la comparación del slug no cambió en la base de datos, se estandarizó el término de búsqueda a minúsculas. Esto es una buena práctica, ya que los slugs—por convención—casi siempre se guardan en minúsculas. Asegura consistencia en las búsquedas.

## Lección Principal para el Desarrollador

La experiencia de usuario (UX) es fundamental. Una búsqueda que no encuentra resultados por una simple diferencia de mayúsculas puede ser frustrante y percibirse como un error.

Este cambio nos enseña a:
*   **Anticipar el comportamiento del usuario**: Los usuarios no distinguen entre mayúsculas y minúsculas al buscar.
*   **Utilizar funciones de la base de datos**: Aprovechar funciones como `UPPER()` o `LOWER()` directamente en la consulta (a través del QueryBuilder del ORM) es mucho más eficiente que traer los datos a la aplicación para luego procesarlos.
*   **Estandarizar los datos**: Normalizar las entradas (como convertir a mayúsculas o minúsculas) antes de realizar operaciones con ellas hace que el código sea más robusto y predecible.

---
*Este apunte fue generado automáticamente.*
