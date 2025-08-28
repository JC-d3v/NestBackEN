## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

---

### **S12 — Guardando Archivos en el Filesystem con `diskStorage` en NestJS**

En esta sección, aprenderemos a persistir los archivos que se suben a nuestro _backend_ directamente en el sistema de archivos del servidor. Por defecto, NestJS y `multer` manejan los archivos en memoria, pero para un almacenamiento permanente, necesitamos especificar una ubicación en el disco.

#### **Objetivo**

Configurar el `FileInterceptor` para que guarde los archivos subidos en una carpeta específica de nuestro proyecto, en lugar de mantenerlos en memoria.

#### **Cambios Clave en el Controlador**

El ajuste principal se realiza en el decorador `@UseInterceptors` dentro de nuestro `files.controller.ts`. Se añade la propiedad `storage` al objeto de configuración del `FileInterceptor`.

Para lograr esto, utilizamos el motor de almacenamiento `diskStorage` que importamos desde `multer`.

import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('product')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: fileFilter,
			// limits:{fileSize:1000}
			storage: diskStorage({
				destination: './static/uploads',
			}),
		}),
	)
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		// ... el resto de la lógica
	}
}

#### **Análisis del Código**

1.  **`import { diskStorage } from 'multer';`**
    *   Importamos la función `diskStorage`, que nos permite configurar el almacenamiento en disco.

2.  **`storage: diskStorage({ ... })`**
    *   Dentro de las opciones del `FileInterceptor`, la propiedad `storage` define el motor de almacenamiento que se usará.

3.  **`destination: './static/uploads'`**
    *   Esta es la opción clave dentro de `diskStorage`. Le indica a `multer` que todos los archivos subidos a través de este _endpoint_ deben ser guardados en la carpeta `./static/uploads`, relativa a la raíz del proyecto.

#### **Estructura de Directorios**

Para que esto funcione, se creó la carpeta `static/uploads`. Además, se añadió un archivo `.gitkeep` dentro de ella.

*   **¿Por qué `.gitkeep`?** Git no rastrea directorios vacíos. Al añadir un archivo (incluso uno vacío como `.gitkeep`), nos aseguramos de que la estructura de carpetas se mantenga en el repositorio, y otros desarrolladores la tendrán disponible al clonar el proyecto.

#### **Conclusión**

Al implementar `diskStorage`, hemos pasado de un manejo de archivos temporal (en memoria) a una solución de almacenamiento persistente en el sistema de archivos. Esto nos da control total sobre dónde se guardan los archivos y es un paso fundamental para manejar recursos como imágenes de productos, avatares de usuarios y más.

---
*Este apunte fue generado automáticamente.*
