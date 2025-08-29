## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S12 — Otras Formas de Desplegar Archivos Estáticos

En el desarrollo de aplicaciones web, no todo es una API. A menudo, nuestro backend necesita servir archivos estáticos como imágenes, hojas de estilo (CSS) o incluso una aplicación de frontend completa (un *build* de React, por ejemplo). Este apunte explica cómo configurar un proyecto de NestJS para servir contenido estático de manera eficiente.

### 1. Instalación de la Dependencia

Para manejar archivos estáticos, NestJS cuenta con un módulo específico. El primer paso es añadirlo a nuestro proyecto.

yarn add @nestjs/serve-static

Este comando añade la dependencia `@nestjs/serve-static` al archivo `package.json`, permitiéndonos usar sus funcionalidades en la aplicación.

### 2. Configuración en el Módulo Principal

Una vez instalado, debemos configurar el `AppModule` (`src/app.module.ts`) para indicarle a NestJS qué carpeta contendrá los archivos estáticos que queremos servir públicamente.

Los cambios clave son:
*   Importar `ServeStaticModule` del paquete que acabamos de instalar.
*   Importar la función `join` del módulo `path` de Node.js para construir rutas de manera segura.
*   Añadir `ServeStaticModule.forRoot()` al arreglo de `imports` del `AppModule`.

import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
// ... otros módulos

@Module({
    imports: [
        // ... otras configuraciones
        
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),

        ProductsModule,
        // ... otros módulos
    ],
})
export class AppModule {}

#### ¿Qué hace `rootPath`?

La opción `rootPath` es fundamental. Le dice a `ServeStaticModule` en qué directorio del sistema de archivos se encuentra el contenido estático.

*   `__dirname`: Es una variable de entorno de Node.js que apunta al directorio del archivo actual (en este caso, una vez compilado, sería `dist/src`).
*   `'..'` : Sube un nivel en la estructura de directorios (de `dist/src` a `dist`).
*   `'public'`: Apunta a la carpeta `public` que se encuentra en la raíz del proyecto.

En resumen, `join(__dirname, '..', 'public')` construye una ruta absoluta y segura a la carpeta `/public` de nuestro proyecto.

### Importancia de la Configuración

Configurar un servidor de archivos estáticos directamente en NestJS simplifica enormemente la arquitectura de la aplicación. Permite que el propio backend sirva las imágenes de los productos, avatares de usuario o cualquier otro recurso sin necesidad de depender de un servidor web adicional como Nginx o Apache para esta tarea.

Ahora, cualquier archivo ubicado en la carpeta `public` (por ejemplo, `public/images/producto.jpg`) será accesible públicamente a través de la URL correspondiente (ej: `http://localhost:3000/images/producto.jpg`).
