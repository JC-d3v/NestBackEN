## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

# S13: Relacionar Productos con el Usuario Creador

En esta sección, establecemos una relación fundamental en nuestra base de datos: vincular cada producto con el usuario que lo ha creado. Esto nos permite saber qué usuario es el propietario de cada producto, una funcionalidad esencial para la gestión de inventario y autorización.

## Objetivos Clave

1.  **Establecer una relación `One-to-Many`** desde el `Usuario` hacia los `Productos`.
2.  **Establecer la relación inversa `Many-to-One`** desde el `Producto` hacia el `Usuario`.
3.  **Cargar automáticamente la información del usuario** al consultar un producto.

---

### 1. Modificación en la Entidad `User`

Para que un usuario pueda "tener" muchos productos, añadimos una relación `OneToMany` en su entidad.

**`04-teslo-shop/src/auth/entities/user.entity.ts`**

import { Product } from '../../products/entities';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany, // Importamos OneToMany
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
	// ... otras propiedades
	@Column({
		type: 'text',
		array: true,
		default: ['user'],
	})
	roles: string[];

	// Nueva Relación
	@OneToMany(() => Product, (product) => product.user)
	product: Product;

	@BeforeInsert()
	chechFieldsBeforeInsert() {
		// ...
	}

	// ...
}

#### Importancia del Cambio:

*   `@OneToMany(...)`: Este decorador le dice a TypeORM que un `User` puede estar relacionado con múltiples instancias de `Product`.
*   `() => Product`: Especifica que la relación es con la entidad `Product`.
*   `(product) => product.user`: Esta es la parte crucial que define la relación inversa. Indica que en la entidad `Product`, hay una propiedad llamada `user` que gestiona el lado `ManyToOne` de la relación.

---

### 2. Modificación en la Entidad `Product`

Ahora, necesitamos que cada producto "conozca" a su creador. Para ello, añadimos la relación `ManyToOne` en la entidad `Product`.

**`04-teslo-shop/src/products/entities/product.entity.ts`**

import { User } from '../../auth/entities/user.entity'; // Importamos User
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne, // Importamos ManyToOne
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './';

@Entity({ name: 'products' })
export class Product {
	// ... otras propiedades

	@OneToMany(() => ProductImage, (productImage) => productImage.product, {
		cascade: true,
		eager: true,
	})
	images?: ProductImage[];

	// Nueva Relación
	@ManyToOne(() => User, (user) => user.product, { eager: true })
	user: User;

	@BeforeInsert()
	checkSlugInsert() {
		// ...
	}

	// ...
}

#### Importancia del Cambio:

*   `@ManyToOne(...)`: Este decorador establece que muchas instancias de `Product` pueden pertenecer a un único `User`.
*   `() => User`: Especifica que la relación es con la entidad `User`.
*   `(user) => user.product`: Define la relación inversa, apuntando a la propiedad `product` en la entidad `User`.
*   `{ eager: true }`: ¡Esta es una opción muy importante! Significa que cada vez que se cargue un `Product` desde la base de datos, TypeORM cargará automáticamente (`eager loading`) la instancia del `User` relacionado y la adjuntará a la propiedad `user`. Esto nos ahorra tener que hacer "joins" manuales en nuestras consultas.

### Conclusión

Con estos cambios, hemos creado una relación bidireccional entre `Users` y `Products`. Ahora, no solo podemos consultar los productos de un usuario, sino que cada producto tiene una referencia directa a su creador, la cual se carga de forma automática gracias a la carga `eager`. Esto simplifica enormemente el código en nuestros servicios y controladores a la hora de verificar permisos o mostrar información del propietario del producto.
