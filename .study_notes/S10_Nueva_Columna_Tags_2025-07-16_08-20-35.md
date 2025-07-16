## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

# Lección: Añadir Campo de Etiquetas (Tags) a Productos

En esta lección, mejoramos nuestra entidad `Product` añadiendo un campo para `tags` (etiquetas). Esto nos permitirá categorizar los productos de forma más flexible y potente, una característica común en aplicaciones de e-commerce. Los cambios se reflejan tanto en la capa de datos (Entidad) como en la de transferencia de datos (DTO).

## Modificaciones Clave

### 1. Actualización del DTO (`create-product.dto.ts`)

Para permitir que los `tags` se envíen al crear un producto, añadimos una nueva propiedad opcional `tags` al `CreateProductDto`.

// 04-teslo-shop/src/products/dto/create-product.dto.ts

// ... (otras propiedades)

	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	tags?: string[];

**Importancia y Explicación:**

*   `@IsArray()`: Asegura que el valor recibido para `tags` sea un arreglo.
*   `@IsString({ each: true })`: Valida que cada elemento *dentro* de ese arreglo sea un `string`. La opción `{ each: true }` es crucial para validar los contenidos de un arreglo.
*   `@IsOptional()`: Hace que el campo `tags` no sea obligatorio. Un producto puede ser creado sin necesidad de especificarle etiquetas.

### 2. Actualización de la Entidad (`product.entity.ts`)

Para persistir las etiquetas en la base de datos, añadimos una columna `tags` a la entidad `Product` usando decoradores de TypeORM.

// 04-teslo-shop/src/products/entities/product.entity.ts

// ... (otras propiedades)

	@Column('json', {
		default: '[]'
	})
	tags: string[];

// ...

**Importancia y Explicación:**

*   `@Column('json', ...)`: Le indicamos a TypeORM que esta columna almacenará los datos en un formato de tipo `JSON` en la base de datos (en este caso, PostgreSQL). Esto es ideal para guardar estructuras como arreglos u objetos de manera eficiente.
*   `default: '[]'`: Establecemos un valor por defecto → un arreglo JSON vacío. Esta es una excelente práctica para asegurar que el campo siempre tenga un valor de arreglo válido y evitar errores por valores `null` en nuestra lógica de negocio.
*   `tags: string[]`: Aunque en la base de datos se guarda como `json`, en nuestra aplicación la propiedad es un arreglo de strings (`string[]`), permitiendo un manejo de tipos seguro y claro.

## Conclusión

Estos cambios introducen una forma estructurada y validada de manejar datos complejos como arreglos en nuestras entidades y DTOs. El uso del tipo `json` en la base de datos nos da la flexibilidad de almacenar listas de etiquetas de longitud variable para cada producto, mejorando significativamente las capacidades de filtrado y categorización de nuestra aplicación.

---
*Este apunte fue generado automáticamente.*
