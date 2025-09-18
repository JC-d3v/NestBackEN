## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S14: Documentación de API con Swagger y OpenAPI en NestJS

En esta sección, integramos Swagger en nuestro proyecto NestJS para generar automáticamente documentación interactiva de nuestra API. Esto es fundamental para facilitar el desarrollo, las pruebas y la colaboración entre equipos de frontend y backend.

## ¿Qué es Swagger (OpenAPI)?

OpenAPI Specification (anteriormente Swagger Specification) es un estándar para describir, producir, consumir y visualizar APIs RESTful. Swagger UI ofrece una interfaz web que presenta la documentación de la API, permitiendo a los desarrolladores y usuarios finales interactuar con los recursos de la API sin tener lógica de implementación.

## 1. Instalación de Dependencias

El primer paso es añadir el paquete de NestJS para Swagger. Este paquete contiene las herramientas necesarias para integrar la especificación OpenAPI en nuestra aplicación.

**Archivo modificado:** `package.json`

"dependencies": {
    // ... otras dependencias
    "@nestjs/swagger": "^11.2.0",
    // ... otras dependencias
}

Esto se logra ejecutando:

yarn add @nestjs/swagger
# o
npm install @nestjs/swagger

## 2. Configuración en `main.ts`

Para que Swagger funcione, debemos configurarlo en el punto de entrada de nuestra aplicación, el archivo `main.ts`. Aquí es donde se construye y se monta la documentación.

**Archivo modificado:** `src/main.ts`

### Importaciones Necesarias

Primero, importamos `DocumentBuilder` y `SwaggerModule` del paquete que acabamos de instalar.

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

### Implementación

Luego, dentro de la función `bootstrap`, creamos una configuración base para nuestra documentación y la asociamos a nuestra aplicación.

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger('Bootstrap');

	app.setGlobalPrefix('api');

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	);

	// --- Inicio de la configuración de Swagger ---

	const config = new DocumentBuilder()
		.setTitle('Teslo RESFul API')
		.setDescription('The teslo Shop endpoints')
		.setVersion('1.0')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	// --- Fin de la configuración de Swagger ---

	await app.listen(process.env.PORT ?? 3000);
	logger.log(`App runnging on port: ${process.env.PORT}`);
}

### Desglose de la Configuración

*   **`DocumentBuilder`**: Es una clase de ayuda que nos permite construir un documento base que se ajusta a la Especificación OpenAPI.
    *   `.setTitle()`: Establece el título principal de la documentación.
    *   `.setDescription()`: Proporciona una breve descripción de la API.
    *   `.setVersion()`: Define la versión actual de la API.
*   **`SwaggerModule.createDocument()`**: Toma la instancia de la aplicación y la configuración del `DocumentBuilder` para generar el documento de especificación completo, escaneando todos los decoradores `@Api...` en nuestros controladores (que veremos más adelante).
*   **`SwaggerModule.setup()`**: Este es el método clave.
    *   El primer argumento (`'api'`) es la ruta donde se servirá la documentación de la API. En este caso, será accesible en `http://localhost:3000/api`.
    *   El segundo argumento es la instancia de la aplicación.
    *   El tercer argumento es el documento generado.

## Resultado

Con estos cambios, al iniciar la aplicación y navegar a la ruta `/api`, ahora veremos una completa e interactiva documentación de nuestra API, la cual se actualizará automáticamente a medida que añadamos más endpoints y decoradores de Swagger en nuestro código.
