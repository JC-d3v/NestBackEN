## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio basado en los cambios del commit.

# S11: Creación de la Entidad de Imágenes de Producto

En esta sección, se ha implementado la funcionalidad para manejar múltiples imágenes por producto. Esto implica modificar tanto la entidad del producto, su DTO (Data Transfer Object), como la lógica en el servicio para gestionar la creación y actualización de estas imágenes de forma anidada.

## Puntos Clave

*   **Relación Uno a Muchos**: Se establece una relación `OneToMany` desde la entidad `Product` hacia una nueva (o existente) entidad `ProductImage`.
*   **Operaciones en Cascada**: Se utiliza la opción `{ cascade: true }` en la relación para que las operaciones (como inserciones) en la entidad `Product` se propaguen automáticamente a sus `ProductImage` relacionadas.
*   **Actualización del DTO**: Se modifica el `CreateProductDto` para aceptar un arreglo de URLs de imágenes.
*   **Lógica de Servicio**: El `ProductsService` se actualiza para manejar la creación de las entidades `ProductImage` a partir de las URLs recibidas y asociarlas con el producto que se está creando.

---

### 1. DTO de Creación (`create-product.dto.ts`)

Se ha añadido una nueva propiedad opcional `images` al DTO. Esta propiedad es un arreglo de `strings`, donde cada `string` representa la URL de una imagen.

*   `@IsString({ each: true })`: Valida que cada elemento del arreglo sea un `string`.
*   `@IsArray()`: Valida que el valor sea un arreglo.
*   `@IsOptional()`: Indica que esta propiedad no es obligatoria al crear un producto.

// 04-teslo-shop/src/products/dto/create-product.dto.ts

export class CreateProductDto {
	// ... otras propiedades
	
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	images?: string[];
}

---

### 2. Entidad del Producto (`product.entity.ts`)

La propiedad `images` en la entidad `Product` se ha modificado para reflejar la relación "uno a muchos". Ahora, en lugar de una sola imagen, un producto puede tener un arreglo de `ProductImage`.

// 04-teslo-shop/src/products/entities/product.entity.ts

import { ProductImage } from './product-image.entity';

// ...

export class Product {
	// ... otras propiedades

	@OneToMany(
		() => ProductImage,
		(productImage) => productImage.product,
		{ cascade: true }
	)
	images: ProductImage[];

	// ...
}

El cambio clave es `images: ProductImage[]`, que convierte la relación en una colección.

---

### 3. Lógica del Servicio (`products.service.ts`)

El servicio es donde ocurre la magia. Se ha modificado para orquestar la creación del producto junto con sus imágenes.

#### Inyección de Dependencias

Primero, se inyecta el repositorio de `ProductImage` para poder interactuar con su tabla en la base de datos.

// 04-teslo-shop/src/products/products.service.ts

import { ProductImage, Product } from './entities';

// ...

export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		@InjectRepository(ProductImage)
		private readonly productImageRepository: Repository<ProductImage>,
	) {}

// ...

#### Método `create`

La lógica de creación se ha vuelto más sofisticada:
1.  Se desestructura el `createProductDto` para separar las `images` del resto de los detalles del producto (`...productDetails`).
2.  Se crea una instancia de `Product` con los `productDetails`.
3.  Se itera sobre el arreglo de `images` (URLs) y, por cada una, se crea una instancia de `ProductImage` usando `this.productImageRepository.create({ url: image })`.
4.  Gracias a la opción `{ cascade: true }` en la entidad `Product`, cuando se guarda el producto (`productRepository.save(product)`), TypeORM automáticamente inserta las instancias de `ProductImage` asociadas en su propia tabla.
5.  Finalmente, se retorna el producto creado junto con sus imágenes.

// 04-teslo-shop/src/products/products.service.ts

async create(createProductDto: CreateProductDto) {

	try {
		const { images = [], ...productDetails } = createProductDto;

		const product = this.productRepository.create({
			...productDetails,
			images: images.map(
				image => this.productImageRepository.create({ url: image })
			)
		});

		await this.productRepository.save(product);

		return { ...product, images };

	} catch (error) {
		this.handleDBExceptions(error);
	}
}

#### Método `update`

En el método `update`, la llamada a `preload` se modifica para incluir `images: []`. Esto es una estrategia para manejar la actualización de imágenes, indicando que las imágenes se gestionarán por separado o se cargarán en un paso posterior.

// 04-teslo-shop/src/products/products.service.ts

async update(id: string, updateProductDto: UpdateProductDto) {
	
	const { images, ...toUpdate } = updateProductDto;

	const product = await this.productRepository.preload({
		id: id,
		...toUpdate,
		images: []
	});

	// ...
}

## Conclusión

Estos cambios establecen una base sólida para gestionar relaciones complejas en la base de datos a través de TypeORM. El uso de `cascade` simplifica enormemente el código en el servicio, permitiendo que la base de datos maneje la creación de registros relacionados de forma automática y transaccional.

---
*Este apunte fue generado automáticamente.*
