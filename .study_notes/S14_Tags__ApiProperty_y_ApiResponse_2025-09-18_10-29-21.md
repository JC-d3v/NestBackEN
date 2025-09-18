## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# S14: Documentación de API con Swagger—Tags, ApiProperty y ApiResponse

En esta sección, mejoramos la documentación de nuestra API generada con OpenAPI (Swagger) utilizando decoradores específicos de `@nestjs/swagger`. Estos cambios son cruciales para que la API sea más fácil de entender, navegar y consumir por otros desarrolladores.

### 1. Agrupación de Endpoints con `@ApiTags`

Para organizar mejor nuestros *endpoints* en la interfaz de Swagger, utilizamos el decorador `@ApiTags`. Este decorador agrupa todos los *endpoints* de un controlador bajo un nombre específico, haciendo la documentación mucho más limpia y navegable.

**Ejemplo de implementación:**

Se aplicó `@ApiTags` a varios controladores para categorizarlos:

// src/auth/auth.controller.ts

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	// ...
}

// src/files/files.controller.ts

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
	// ...
}

### 2. Definición de Propiedades del Modelo con `@ApiProperty`

Para que Swagger pueda mostrar correctamente los esquemas de datos (DTOs y Entidades) que utiliza nuestra API, necesitamos decorar sus propiedades con `@ApiProperty`. Sin este decorador, las propiedades de nuestros modelos no serían visibles en la documentación.

**Ejemplo en la entidad `Product`:**

Añadimos `@ApiProperty()` a cada una de las propiedades de la entidad `Product` para que su estructura quede completamente documentada en Swagger.

// src/products/entities/product.entity.ts

import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column('text', {
		unique: true,
	})
	title: string;

	@ApiProperty()
	@Column('float', {
		default: 0,
	})
	price: number;

	// ... y así sucesivamente para las demás propiedades
}

### 3. Documentación de Respuestas de Endpoints con `@ApiResponse`

Es fundamental documentar las posibles respuestas que un *endpoint* puede devolver. El decorador `@ApiResponse` nos permite definir el código de estado HTTP, una descripción clara y el tipo de dato o entidad que se retorna.

**Ejemplo en `ProductsController`:**

En el método `create` del controlador de productos, especificamos las respuestas esperadas para diferentes escenarios:

// src/products/products.controller.ts

import { Product } from './entities/product.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
	// ...

	@Post()
	@Auth(ValidRoles.admin)
	@ApiResponse({ status: 201, description: 'Product was created', type: Product })
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@ApiResponse({ status: 403, description: 'Forbidden token related' })
	create(
		@Body() createProductDto: CreateProductDto,
		@GetUser() user: User,
	) {
		// ...
	}
}

-   **`@ApiResponse({ status: 201, ... })`**: Documenta la respuesta exitosa (`201 Created`), indicando que el producto fue creado y que se devolverá un objeto de tipo `Product`.
-   **`@ApiResponse({ status: 400, ... })`**: Informa sobre una posible respuesta de error (`400 Bad Request`) si los datos enviados son incorrectos.
-   **`@ApiResponse({ status: 403, ... })`**: Advierte sobre un error de autorización (`403 Forbidden`), generalmente relacionado con un token inválido o sin los permisos necesarios.

### Importancia de los Cambios

Estos tres decoradores (`@ApiTags`, `@ApiProperty` y `@ApiResponse`) enriquecen enormemente la documentación autogenerada de la API. El resultado es una guía interactiva, clara y precisa que facilita la integración y reduce la curva de aprendizaje para cualquier persona que necesite consumir nuestros *endpoints*.
