## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# S13: Insertar `UserId` en los Productos

En esta sección, implementamos una funcionalidad crucial: asociar cada producto con el usuario que lo crea o lo modifica. Esto nos permite saber quién es el propietario de cada registro en la base de datos, lo cual es fundamental para futuras reglas de negocio, auditorías o simplemente para mostrar información más detallada en la aplicación.

Para lograrlo, aprovecharemos el decorador `@GetUser()` que creamos anteriormente.

### Paso 1: Modificar el Controlador

El primer paso es actualizar los *endpoints* de creación y actualización en `products.controller.ts` para que reciban al usuario autenticado.

Usamos el decorador `@GetUser()` para inyectar la entidad `User` completa en nuestros métodos. Luego, pasamos este usuario al servicio correspondiente.

#### `products.controller.ts`

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Auth(ValidRoles.admin)
	create(
		@Body() createProductDto: CreateProductDto,
		@GetUser() user: User,
	) {
		return this.productsService.create(createProductDto, user);
	}

	//...

	@Patch(':id')
	@Auth(ValidRoles.admin)
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
		@GetUser() user: User,
	) {
		return this.productsService.update(id, updateProductDto, user);
	}

	//...
}

### Paso 2: Actualizar el Servicio de Productos

Ahora, `ProductsService` debe ser capaz de manejar este nuevo dato. Actualizamos los métodos `create` y `update` para que acepten el `user` y lo asignen al producto antes de guardarlo en la base de datos.

#### `products.service.ts`

**Método `create`:**

Al crear un producto, simplemente esparcimos el `createProductDto` y añadimos la propiedad `user`. TypeORM se encargará de insertar el `userId` en la columna correspondiente gracias a la relación que definimos previamente.

//...
import { ProductImage, Product } from './entities';
import { User } from '../auth/entities/user.entity';

//...

	async create(createProductDto: CreateProductDto, user: User) {

		try {

			const { images = [], ...productDetails } = createProductDto;

			const product = this.productRepository.create({
				...productDetails,
				images: images.map(
					image => this.productImageRepository.create({ url: image })
				),
				user // <-- Aquí se asocia el usuario
			});
			await this.productRepository.save(product);

			return { ...product, images };

		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

**Método `update`:**

En la actualización, después de preparar los datos del producto, asignamos el `user` que realizó la modificación. Esto significa que el último usuario en editar el producto quedará como su "propietario".

//...
	async update(id: string, updateProductDto: UpdateProductDto, user: User) {

		const { images, ...toUpdate } = updateProductDto;

		const product = await this.productRepository.preload({ id, ...toUpdate });

		if (!product) throw new NotFoundException(`Product with id: ${id} not found`);

		// Create query runner
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {

			if (images) {
				await queryRunner.manager.delete(ProductImage, { product: { id } });

				product.images = images.map(
					image => this.productImageRepository.create({ url: image })
				)
			}

			product.user = user; // <-- Se actualiza el usuario asociado
			await queryRunner.manager.save(product);


			await queryRunner.commitTransaction();
			await queryRunner.release();

			return this.findOnePlain(id);

		} catch (error) {

			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			this.handleDBExceptions(error);
		}
	}
//...

### Paso 3: Ajuste en el Seed

Un efecto secundario de este cambio es que nuestro servicio de *seeding* (población inicial de datos) deja de funcionar. El método `productsService.create` ahora requiere un objeto `User`, pero el *seed* se ejecuta sin un usuario autenticado.

Por ahora, hemos comentado el código del *seed* para evitar errores. Más adelante, tendremos que refactorizarlo para que pueda crear los productos iniciales asociándolos a un usuario administrador por defecto.

#### `seed.service.ts`

//...
export class SeedService {

	constructor(
		private readonly productsService: ProductsService,
	) { }

	async runSeed() {
		await this.insertNewProducts();
		return 'SEED EXECUTED';
	}

	private async insertNewProducts() {
		await this.productsService.deleteAllProducts();

		const products = initialData.products;

		// for (const product of products) {
		//   await this.productsService.create(product)
		// }

		return true;
	}
}

### Conclusión

Con estos cambios, hemos fortalecido nuestro modelo de datos al crear una relación explícita entre los productos y los usuarios. Cada producto ahora "pertenece" a un usuario, abriendo la puerta a funcionalidades más complejas de autorización y personalización.
