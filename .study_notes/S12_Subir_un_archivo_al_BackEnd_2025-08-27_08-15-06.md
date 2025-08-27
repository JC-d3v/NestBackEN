## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S12 — Subir un Archivo al BackEnd

En esta sección, implementamos una funcionalidad crucial para muchas aplicaciones: la capacidad de subir archivos. Crearemos un endpoint específico en nuestro backend de NestJS para recibir imágenes de productos.

Para manejar la subida de archivos, NestJS utiliza internamente librerías de middleware como `multer` cuando se ejecuta sobre la plataforma Express. `multer` es un middleware especializado en manejar datos `multipart/form-data`, que es el formato estándar para el envío de archivos a través de formularios HTTP.

### 1. Instalación de Dependencias

Para asegurar que tengamos el soporte de tipado correcto al trabajar con los archivos en TypeScript, añadimos los tipos de `multer`.

*__`package.json`__*
{
	// ...
	"@types/jest": "^29.5.2",
	"@types/multer": "^2.0.0",
	"@types/node": "^20.3.1",
	// ...
}
> La adición de `@types/multer` es fundamental para que TypeScript entienda la estructura del objeto `file` que recibiremos en el controlador, proporcionando autocompletado y seguridad de tipos.

### 2. Creación del Módulo `Files`

Para mantener nuestro código organizado y modular, encapsulamos toda la lógica relacionada con la gestión de archivos en un nuevo módulo llamado `FilesModule`.

*__`src/files/files.module.ts`__*
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
	controllers: [FilesController],
	providers: [FilesService],
})
export class FilesModule {}
> Este módulo agrupa el `FilesController`, que manejará las rutas, y el `FilesService`, que contendrá la lógica de negocio (aún vacía).

### 3. Integración en el Módulo Principal

Una vez creado el `FilesModule`, debemos registrarlo en el módulo raíz de la aplicación (`AppModule`) para que NestJS lo reconozca y monte sus rutas.

*__`src/app.module.ts`__*
// ...
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';

@Module({
	imports: [
		// ...
		ProductsModule,
		CommonModule,
		SeedModule,
		FilesModule
	],
	// ...
})
export class AppModule {}

### 4. Implementación del Controlador

El controlador es el corazón de esta funcionalidad. Aquí definimos el endpoint y utilizamos los decoradores de NestJS para procesar el archivo entrante.

*__`src/files/files.controller.ts`__*
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) { }

	@Post('product')
	@UseInterceptors(FileInterceptor('file'))
	uploadProductImage(
		@UploadedFile()
		file: Express.Multer.File,
	) {

		return file;
	}
}

#### Puntos Clave del Controlador:

*   `@Controller('files')`: Define el prefijo de la ruta para todos los endpoints de este controlador. En este caso, será `/files`.
*   `@Post('product')`: Crea un endpoint que responde a peticiones `POST` en la ruta `/files/product`.
*   `@UseInterceptors(FileInterceptor('file'))`: Este es el decorador principal.
    *   `UseInterceptors` le dice a NestJS que aplique un interceptor a este endpoint.
    *   `FileInterceptor('file')` es un interceptor específico para la subida de archivos. Le indica a `multer` que espere un archivo en un campo llamado `file` dentro del `multipart/form-data` de la petición.
*   `@UploadedFile()`: Este decorador de parámetro se usa para inyectar el archivo, ya procesado por el `FileInterceptor`, en la variable `file` del método.
*   `file: Express.Multer.File`: Es el tipado del objeto del archivo. Gracias a `@types/multer`, TypeScript sabe que este objeto contendrá información útil como `originalname`, `mimetype`, `size` y el `buffer` con los datos del archivo.

En esta implementación inicial, el controlador simplemente devuelve el objeto `file` como respuesta. Esto es muy útil para verificar que el archivo se está recibiendo correctamente en el backend antes de implementar la lógica para guardarlo.

---
*Este apunte fue generado automáticamente.*
