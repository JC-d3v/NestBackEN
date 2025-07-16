## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S11: Relaciones OneToMany y ManyToOne con TypeORM

En esta sección, exploramos cómo establecer relaciones de base de datos `One-to-Many` (uno a muchos) y `Many-to-One` (muchos a uno) utilizando los decoradores de TypeORM. Este tipo de relación es fundamental en aplicaciones complejas, como nuestro Teslo-Shop, donde un producto puede tener múltiples imágenes asociadas.

## Conceptos Clave

*   **Relación Uno a Muchos (`@OneToMany`):** Se establece en la entidad "principal". En nuestro caso, un `Product` puede tener muchas `ProductImage`. Esta es la "punta del uno" en la relación.
*   **Relación Muchos a Uno (`@ManyToOne`):** Se establece en la entidad "relacionada". Muchas `ProductImage` pueden pertenecer a un solo `Product`. Esta es la "punta del muchos".
*   **Lado Propietario (Owning Side):** En TypeORM, la relación `@ManyToOne` es la que contiene la clave foránea en la base de datos y, por lo tanto, es considerada el "lado propietario" de la relación.
*   **Cascada (`cascade`):** Es una opción poderosa que permite que las operaciones (como inserciones, actualizaciones o eliminaciones) en la entidad principal se propaguen automáticamente a sus entidades relacionadas.

---

## Implementación en el Código

Analicemos cómo se implementaron estas relaciones en nuestras entidades.

### 1. Entidad `Product` (El "Uno")

En la entidad `Product`, hemos añadido una propiedad `images` para almacenar la colección de imágenes asociadas.

**`04-teslo-shop/src/products/entities/product.entity.ts`**

import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany, // 👈 Se importa el decorador
	PrimaryGeneratedColumn
} from "typeorm";
import { ProductImage } from "./"; // 👈 Se importa la entidad relacionada

@Entity()
export class Product {
	
	// ... otras propiedades ...

	@OneToMany(
		() => ProductImage,
		(productImage) => productImage.product,
		{ cascade: true }
	)
	images: ProductImage;

	// ... resto de la clase ...
}

**Explicación:**

*   `@OneToMany(...)`: Este decorador define la relación.
    *   `() => ProductImage`: Especifica que la relación es con la entidad `ProductImage`.
    *   `(productImage) => productImage.product`: Es una función que le indica a TypeORM cómo encontrar la relación inversa. Apunta a la propiedad `product` dentro de la entidad `ProductImage`.
    *   `{ cascade: true }`: ¡Muy importante! Esta opción le dice a TypeORM que si guardamos un `Product`, también debe guardar (o actualizar) todas las entidades `ProductImage` asociadas en la propiedad `images`. Simplifica enormemente las operaciones de la base de datos.

### 2. Entidad `ProductImage` (El "Muchos")

En la entidad `ProductImage`, necesitamos establecer el vínculo de regreso al `Product` al que pertenece.

**`04-teslo-shop/src/products/entities/product-image.entity.ts`**

import {
	Column,
	Entity,
	ManyToOne, // 👈 Se importa el decorador
	PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "./"; // 👈 Se importa la entidad principal

@Entity()
export class ProductImage {

	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	url: string;

	@ManyToOne(
		() => Product,
		(product) => product.images
	)
	product: Product
}

**Explicación:**

*   `@ManyToOne(...)`: Este decorador define la contraparte de la relación.
    *   `() => Product`: Especifica que esta entidad pertenece a un `Product`.
    *   `(product) => product.images`: Apunta a la propiedad `images` en la entidad `Product` para establecer el vínculo inverso.
*   `product: Product`: Esta propiedad contendrá la instancia del `Product` al que la imagen está asociada. A nivel de base de datos, TypeORM creará automáticamente una columna de clave foránea (ej: `productId`) en la tabla `product_image`.

## Importancia de la Relación

Establecer esta relación `OneToMany`/`ManyToOne` nos permite:

1.  **Integridad de Datos:** Asegura que cada imagen esté vinculada a un producto válido a nivel de base de datos.
2.  **Consultas Eficientes:** Facilita la carga de un producto junto con todas sus imágenes de una sola vez.
3.  **Manejo Simplificado:** Gracias a la opción `cascade`, podemos crear un producto y sus imágenes en una única operación de guardado, haciendo nuestro código de servicio más limpio y menos propenso a errores.

---
*Este apunte fue generado automáticamente.*
