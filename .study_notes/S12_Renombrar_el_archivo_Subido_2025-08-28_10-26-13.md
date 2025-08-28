## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown.

---

# Apunte de Estudio: Renombrar Archivos Subidos

En esta lección, se implementó una mejora crucial en la gestión de archivos subidos: la asignación de nombres únicos para evitar colisiones y sobrescrituras. También se introdujo un patrón de diseño para organizar y simplificar las importaciones de funciones auxiliares.

## Cambios Clave

### 1. Lógica para Renombrar el Archivo (`fileNamer.helper.ts`)

Se creó un nuevo "helper" o función auxiliar llamada `fileNamer`. Su propósito es generar un nombre de archivo único cada vez que se sube una imagen.

**Funcionamiento:**

1.  **Validación:** Primero, verifica que el archivo realmente exista.
2.  **Extensión del Archivo:** Extrae la extensión original del archivo (ej. `jpg`, `png`) a partir de su `mimetype`.
3.  **Nombre Único:** Utiliza la librería `uuid` para generar un identificador único universal (UUID) como nombre del archivo.
4.  **Ensamblaje:** Concatena el UUID con la extensión del archivo (ej. `uuid-generado.jpg`).
5.  **Callback:** Devuelve el nuevo nombre a Multer para que lo use al guardar el archivo.

// src/files/helpers/fileNamer.helper.ts

import { v4 as uuid } from "uuid";

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

	if (!file) return callback(new Error('File is Empty'), false);

	const fileExtension = file.mimetype.split('/')[1];

	const fileName = `${uuid()}.${fileExtension}`;

	callback(null, fileName);
}

### 2. Centralización de Ayudantes (`index.ts`)

Para mantener el código limpio y facilitar las importaciones, se creó un archivo "de barril" (`index.ts`) en el directorio `helpers`. Este archivo exporta todas las funciones auxiliares desde un único punto.

// src/files/helpers/index.ts

export { fileFilter } from "./fileFilter.helper";
export { fileNamer } from "./fileNamer.helper";

Gracias a esto, en lugar de tener múltiples importaciones como:
`import { fileFilter } from './helpers/fileFilter.helper';`
`import { fileNamer } from './helpers/fileNamer.helper';`

Ahora podemos tener una sola línea mucho más limpia:
`import { fileFilter, fileNamer } from './helpers/index';`

### 3. Integración en el Controlador (`files.controller.ts`)

Finalmente, se actualizó el `FilesController` para utilizar la nueva lógica de renombrado y la importación centralizada.

**Cambios en `diskStorage`:**

*   `destination`: Se cambió la carpeta de destino a `./static/products` para organizar mejor los archivos.
*   `filename`: Se asignó nuestra nueva función `fileNamer` para que Multer la ejecute y determine el nombre del archivo a guardar.

// src/files/files.controller.ts

import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/index'; // <- Importación simplificada

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('product')
	@UseInterceptors(FileInterceptor('file', {
		fileFilter: fileFilter,
		storage: diskStorage({
			destination: './static/products', // <- Destino actualizado
			filename: fileNamer             // <- Lógica de renombrado aplicada
		}),
	}))
	uploadProductImage(
		@UploadedFile() file: Express.Multer.File,
	) {
		// ...
	}
}

## Importancia y Conceptos

*   **Prevención de Colisión de Nombres:** Usar el nombre original del archivo es arriesgado. Si dos usuarios suben un archivo llamado `foto.jpg`, el segundo sobrescribirá al primero. Usar UUIDs garantiza que cada archivo tenga un nombre único.
*   **Organización del Código:** Separar la lógica en funciones auxiliares (helpers) y centralizar sus exportaciones con un archivo de barril es una excelente práctica que escala muy bien en proyectos grandes, manteniendo el código modular y fácil de mantener.
*   **Seguridad:** Aunque no se ve en este commit, evitar que los usuarios controlen directamente el nombre del archivo en el servidor también es una medida de seguridad para prevenir ataques de "Path Traversal".

---
*Este apunte fue generado automáticamente.*
