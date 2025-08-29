## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S12: Servir Archivos de Manera Controlada

En esta sección, implementamos una característica crucial para cualquier aplicación que maneje archivos: la capacidad de servir contenido estático—como imágenes—de una manera controlada y segura. En lugar de exponer directamente una carpeta de archivos, creamos un `endpoint` que verifica la existencia del archivo solicitado antes de entregarlo.

### Puntos Clave del Aprendizaje:

1.  **Endpoint de Acceso:** Se crea un nuevo `endpoint` con el decorador `@Get` para manejar las solicitudes de archivos.
2.  **Control sobre la Respuesta:** Utilizamos el decorador `@Res()` para inyectar el objeto de respuesta nativo de Express. Esto nos da control total sobre lo que se envía al cliente, permitiéndonos usar métodos como `res.sendFile()`.
3.  **Validación de Existencia:** Antes de servir un archivo, verificamos si realmente existe en el sistema de archivos usando `fs.existsSync`. Si no existe, devolvemos un error `400 Bad Request`.
4.  **Construcción de Rutas Seguras:** Usamos `path.join` para construir la ruta al archivo, lo que previene problemas de formato de ruta entre diferentes sistemas operativos.

---

### Cambios en el Código

#### 1. `files.controller.ts` — Creación del Endpoint

Se añade un nuevo método en el controlador para manejar las peticiones `GET`.

import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
	Get, // <- Importado
	Param, // <- Importado
	Res,   // <- Importado
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express'; // <- Importado
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/index';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	// ... (método POST para subir archivos)

	@Get('product/:imageName')
	findProductImage(
		@Res() res: Response, // Inyectamos el objeto Response de Express
		@Param('imageName') imageName: string,
	) {
		// Obtenemos la ruta validada desde el servicio
		const path = this.filesService.gerStaticProductImage(imageName);

		// Enviamos el archivo como respuesta
		res.sendFile(path);
	}
}

**Análisis:**

*   `@Get('product/:imageName')`: Define una nueva ruta que acepta un parámetro dinámico (`imageName`).
*   `@Res() res: Response`: Este decorador es fundamental. Le indica a NestJS que no maneje la respuesta por nosotros. En su lugar, nos da acceso directo al objeto `Response` de Express para que podamos usar sus métodos nativos, como `sendFile`.
*   `@Param('imageName')`: Extrae el nombre de la imagen de la URL y lo asigna a la variable `imageName`.

#### 2. `files.service.ts` — Lógica de Negocio y Validación

El servicio se encarga de la lógica «sucia»: encontrar el archivo y validar que exista.

import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs'; // <- Módulo de Node para interactuar con el sistema de archivos
import { join } from 'path'; // <- Módulo de Node para construir rutas

@Injectable()
export class FilesService {
	gerStaticProductImage(imageName: string) {
		// Construimos la ruta completa y segura al archivo
		const path = join(__dirname, '../../static/products', imageName);

		// Si el archivo no existe, lanzamos una excepción
		if (!existsSync(path)) {
			throw new BadRequestException(
				`No product found with image ${imageName}`,
			);
		}

		// Si todo está bien, devolvemos la ruta
		return path;
	}
}

**Análisis:**

*   `join(__dirname, '../../static/products', imageName)`: Construye una ruta absoluta al archivo solicitado. `__dirname` apunta al directorio actual del archivo (`files.service.ts`), y desde allí navegamos hasta la carpeta `static/products`.
*   `!existsSync(path)`: Esta es la validación clave. Comprueba si un archivo o directorio existe en la ruta especificada. Si devuelve `false`, significa que el cliente está pidiendo un recurso que no tenemos.
*   `throw new BadRequestException(...)`: Al lanzar esta excepción, NestJS se encarga de enviar una respuesta de error HTTP `400` con un mensaje claro, evitando que la aplicación se rompa y dando feedback útil al cliente.
