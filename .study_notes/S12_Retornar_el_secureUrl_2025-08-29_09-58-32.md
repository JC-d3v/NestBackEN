## Resumen de avance
Loaded cached credentials.
# S12: Retornar el `secureUrl`

En esta sección, se realizaron cambios clave para construir y retornar una URL segura (`secureUrl`) para los archivos subidos. A continuación, se detallan los cambios y su importancia en el desarrollo del curso.

## Cambios en el Código

### 1. Inyección de `ConfigService`

Se inyectó `ConfigService` en `FilesController` para acceder a las variables de entorno de la aplicación.

// 04-teslo-shop/src/files/files.controller.ts

import { ConfigService } from '@nestjs/config';
// ...

export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly configService: ConfigService,
    ) { }
    // ...
}

### 2. Construcción de la `secureUrl`

Se modificó la forma en que se construye la `secureUrl`, utilizando `ConfigService` para obtener el `HOST_API` y concatenarlo con el nombre del archivo.

// 04-teslo-shop/src/files/files.controller.ts

// ...
    // const secureUrl = `${file.filename}`
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename} `
// ...

### 3. Importación de `ConfigModule`

Para que `ConfigService` esté disponible en `FilesController`, se importó `ConfigModule` en `FilesModule`.

// 04-teslo-shop/src/files/files.module.ts

import { ConfigModule } from '@nestjs/config';
// ...

@Module({
    controllers: [FilesController],
    providers: [FilesService],
    imports: [ConfigModule]
})
export class FilesModule { }

### 4. Mejoras en `main.ts`

Se añadió un `Logger` en `main.ts` para mostrar un mensaje en la consola indicando el puerto en el que se está ejecutando la aplicación.

// 04-teslo-shop/src/main.ts

import { Logger, ValidationPipe } from '@nestjs/common';
// ...

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap')
    // ...
    await app.listen(process.env.PORT ?? 3000);
    logger.log(`App runnging on port: ${process.env.PORT}`);
}

## Importancia de los Cambios

Estos cambios son fundamentales para:

*   **Abstraer las Variables de Entorno**: El uso de `ConfigService` permite gestionar las variables de entorno de forma centralizada y segura, evitando "hardcodear" valores en el código.
*   **Portabilidad**: Al obtener el `HOST_API` de las variables de entorno, la aplicación es más portable entre diferentes entornos (desarrollo, producción, etc.), ya que solo es necesario cambiar el valor de la variable sin modificar el código.
*   **Claridad en el Inicio de la Aplicación**: El `Logger` en `main.ts` proporciona una retroalimentación clara al desarrollador sobre el estado de la aplicación al iniciarse.
