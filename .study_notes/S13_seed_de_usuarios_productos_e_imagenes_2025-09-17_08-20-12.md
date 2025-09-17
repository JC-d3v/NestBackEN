## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# S13: Seed de Usuarios, Productos e Imágenes

En esta sección, se ha mejorado significativamente el *seed* de la base de datos. El objetivo principal es no solo poblar la base de datos con productos de prueba, sino también con usuarios, y establecer una relación entre ellos. Esto es fundamental para simular un entorno de desarrollo más realista donde las entidades (como los productos) están asociadas a un usuario creador.

## Puntos Clave

1.  **Limpieza Completa:** Antes de insertar nuevos datos, se eliminan todos los registros de las tablas de productos y usuarios para evitar duplicados y conflictos.
2.  **Inserción de Usuarios:** Se crea un conjunto de usuarios de prueba con diferentes roles (`ADMIN`, `USER`, `SUPER`).
3.  **Asociación de Productos a Usuarios:** Cada producto creado durante el *seed* ahora está vinculado a un usuario específico (en este caso, el primer usuario administrador creado).
4.  **Ajuste de Roles:** Se ha estandarizado el nombre del rol `superUser` de `'SUPER-ADMIN'` a `'SUPER'` para mayor consistencia.

---

## Análisis del Código

### 1. `seed.service.ts` — El Corazón de la Lógica

Este servicio ahora orquesta todo el proceso de siembra.

-   **Inyección de Dependencias:** Se inyecta el `UserRepository` para poder interactuar con la tabla de usuarios.

    import { Injectable } from '@nestjs/common';
    import { Repository } from 'typeorm';
    import { InjectRepository } from '@nestjs/typeorm';
    import { ProductsService } from '../products/products.service';
    import { initialData } from './data/seed-data';
    import { User } from './../auth/entities/user.entity';

    @Injectable()
    export class SeedService {

    	constructor(
    		private readonly productsService: ProductsService,

    		@InjectRepository(User)
    		private readonly userRepository: Repository<User>,
    	) { }

-   **Nuevo Flujo de Ejecución (`runSeed`):** El método principal ahora sigue una secuencia lógica:
    1.  `deleteTables()`: Limpia las tablas.
    2.  `insertUsers()`: Inserta los usuarios y obtiene el usuario administrador.
    3.  `insertNewProducts(adminUser)`: Inserta los productos, asociándolos al usuario administrador.

    async runSeed() {

    	await this.deleteTables();

    	const adminUser = await this.insertUsers()

    	await this.insertNewProducts(adminUser);

    	return "SEED EXECUTED"
    }

-   **Métodos Privados:**
    -   `deleteTables()`: Utiliza el `productsService` para borrar productos y un `queryBuilder` para limpiar la tabla de usuarios.

      private async deleteTables() {
      	await this.productsService.deleteAllProducts();

      	const queryBuilder = this.userRepository.createQueryBuilder();
      	await queryBuilder
      		.delete()
      		.where({})
      		.execute()
      }

    -   `insertUsers()`: Lee los usuarios del `seed-data`, los crea en la base de datos y devuelve el primer usuario (el administrador).

      private async insertUsers() {

      	const seedUsers = initialData.users;
      	const users: User[] = [];

      	seedUsers.forEach(user => {
      		users.push(this.userRepository.create(user))
      	});

      	const dbUsers = await this.userRepository.save(seedUsers);

      	return dbUsers[0];
      }

    -   `insertNewProducts(user: User)`: Este método ahora recibe un `user` y lo pasa al `productsService.create`, estableciendo la relación.

      private async insertNewProducts(user: User) {
      	await this.productsService.deleteAllProducts()

      	const products = initialData.products;

      	for (const product of products) {
      		await this.productsService.create(product, user)
      	}

      	return true;
      }

### 2. `seed/data/seed-data.ts` — Los Datos de Prueba

El archivo de datos iniciales se ha expandido para incluir una lista de usuarios.

-   Se define la interfaz `SeedUser` para tipar los datos de los usuarios.
-   `initialData` ahora contiene una propiedad `users` con un array de objetos de usuario, cada uno con `email`, `fullName`, `password` y `roles`.

    interface SeedUser {
    	email: string;
    	fullName: string;
    	password: string;
    	roles: string[];
    }

    interface SeedData {
    	users: SeedUser[],
    	products: SeedProduct[];
    }

    export const initialData: SeedData = {
    	users: [
    		{
    			email: 'jorge1@gmail.com',
    			fullName: 'User One',
    			password: 'pass123',
    			roles: ['ADMIN']
    		},
    		{
    			email: 'jorge2@gmail.com',
    			fullName: 'User two',
    			password: 'pass123',
    			roles: ['USER', 'SUPER']
    		},
    		// ...
    	],
    	products: [
    		// ...
    	]
    }

### 3. `seed.controller.ts` — Desactivación Temporal de la Autenticación

Para facilitar la ejecución del *seed* sin necesidad de un token de autenticación, el decorador `@Auth` se ha comentado. Esto es una práctica común en desarrollo para puntos finales de configuración o depuración.

@Get()
// @Auth(ValidRoles.user)
exceuteSeed() {
	return this.seedService.runSeed();
}

## Conclusión

Estos cambios son un paso crucial para construir una aplicación robusta. Al simular datos relacionales desde el principio, facilitamos el desarrollo de funcionalidades que dependen de la propiedad de los datos y los roles de usuario, como la autorización para editar o eliminar recursos. El *seed* se convierte en una herramienta poderosa para garantizar un estado inicial consistente y predecible en la base de datos durante todo el ciclo de desarrollo.
