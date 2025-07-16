## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio basado en el commit, formateado en Markdown y listo para usar.

---

# S11: Creación de la Entidad para Imágenes de Productos

En esta sesión, se introduce una nueva entidad, `ProductImage`, para gestionar las imágenes asociadas a nuestros productos. Este es un paso fundamental para poder manejar múltiples imágenes por producto y establecer una relación entre las tablas en nuestra base de datos.

## Cambios Clave

### 1. Creación de la Entidad `ProductImage`

Se ha creado un nuevo archivo para definir la estructura de las imágenes de nuestros productos en la base de datos.

**Archivo:** `04-teslo-shop/src/products/entities/product-image.entity.ts`

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductImage {

	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	url: string;

}

**Explicación:**

*   `@Entity()`: Este decorador marca la clase `ProductImage` como una entidad de TypeORM, lo que significa que se creará una tabla correspondiente en la base de datos (generalmente llamada `product_image`).
*   `@PrimaryGeneratedColumn()`: Define la propiedad `id` como la columna de clave primaria, y su valor será un número autoincremental.
*   `@Column('text')`: Define la propiedad `url` como una columna de tipo `text`, ideal para almacenar las URLs de las imágenes, que pueden ser largas.

### 2. Centralización de Exportaciones de Entidades

Para mantener el código más limpio y organizado, se ha creado un archivo "barril" (`index.ts`) que exporta todas las entidades del módulo desde un único lugar.

**Archivo:** `04-teslo-shop/src/products/entities/index.ts`

export { Product } from './product.entity';
export { ProductImage } from './product-image.entity';

**Importancia:**

*   **Simplifica las importaciones:** Ahora, en lugar de importar cada entidad desde su archivo específico, podemos importarlas todas desde la carpeta `entities`.
    *   **Antes:** `import { Product } from './entities/product.entity';`
    *   **Ahora:** `import { Product, ProductImage } from './entities';`

### 3. Registro de la Nueva Entidad en el Módulo

Finalmente, la nueva entidad `ProductImage` se ha registrado en el `ProductsModule` para que TypeORM la reconozca y la pueda utilizar dentro de este contexto.

**Archivo:** `04-teslo-shop/src/products/products.module.ts`

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';

// La importación ahora usa el archivo barril
import { Product, ProductImage } from './entities';

@Module({
	controllers: [ProductsController],
	providers: [ProductsService],
	// Se añade ProductImage al array de forFeature
	imports: [TypeOrmModule.forFeature([Product, ProductImage])]
})
export class ProductsModule { }

**Explicación:**

*   `TypeOrmModule.forFeature([...])`: Este método es crucial. Registra las entidades especificadas (`Product` y ahora `ProductImage`) en el alcance del módulo actual. Sin este registro, NestJS y TypeORM no sabrían cómo inyectar el repositorio para `ProductImage` ni cómo manejar esta entidad.

## Conceptos Fundamentales

*   **Entidades en TypeORM:** Son clases que se mapean a tablas de una base de datos. Los decoradores (`@Entity`, `@Column`, etc.) definen cómo se realiza este mapeo.
*   **Archivos Barril (`index.ts`):** Son una práctica recomendada en TypeScript/JavaScript para agrupar exportaciones de un directorio, simplificando las importaciones en otras partes de la aplicación y mejorando la mantenibilidad.
*   **Registro de Módulos en NestJS:** Cada pieza de la aplicación (controladores, servicios, entidades) debe estar correctamente declarada o registrada en un módulo (`@Module`) para que el sistema de inyección de dependencias de NestJS funcione correctamente.

---
*Este apunte fue generado automáticamente.*
