## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S13 -- Creación de la Entidad de Usuarios y Módulo de Autenticación

En esta sesión, sentamos las bases para el sistema de autenticación de nuestra aplicación. Esto implica la creación de una entidad `User` para representar a los usuarios en la base de datos y la generación de un nuevo módulo `Auth` que contendrá toda la lógica relacionada con la autenticación y autorización.

## 1. Creación de la Entidad `User`

El cambio más significativo es la creación de la entidad `User`. Esta entidad define la estructura de nuestra tabla `users` en la base de datos utilizando TypeORM.

**`04-teslo-shop/src/auth/entities/user.entity.ts`**

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text', {
		unique: true
	})
	email: string;

	@Column('text')
	password: string;


	@Column('text')
	fullName: string;

	@Column('boolean')
	isActive: boolean;

	@Column('json', {
		default: '["USER"]'
	})
	roles: string[];

}

### Puntos Clave de la Entidad `User`:

*   **`@Entity('users')`**: Este decorador le indica a TypeORM que esta clase es una entidad y que debe mapearse a una tabla llamada `users` en la base de datos.
*   **`@PrimaryGeneratedColumn('uuid')`**: Se utiliza un `uuid` como clave primaria. Esta es una excelente práctica de seguridad y escalabilidad, ya que evita exponer IDs numéricos secuenciales que podrían ser predecibles.
*   **`email`**: Es de tipo `text` y se marca como `unique: true` para asegurar que no haya dos usuarios con el mismo correo electrónico.
*   **`password`**: Almacenará la contraseña del usuario. En futuras sesiones, nos aseguraremos de que esta contraseña se almacene de forma segura (hasheada).
*   **`roles`**: Se utiliza un campo de tipo `json` para almacenar los roles del usuario (por ejemplo, "ADMIN", "USER"). Esto nos da flexibilidad para gestionar permisos en el futuro.

## 2. Creación del Módulo de Autenticación (`AuthModule`)

Se ha generado un nuevo módulo específico para la autenticación utilizando el CLI de NestJS. Este módulo agrupará el controlador, el servicio y la entidad relacionados con la autenticación.

**`04-teslo-shop/src/auth/auth.module.ts`**

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from './entities/user.entity';


@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		TypeOrmModule.forFeature([User])
	],
	exports: [TypeOrmModule]
})
export class AuthModule { }

### Puntos Clave del Módulo:

*   **`imports: [TypeOrmModule.forFeature([User])]`**: Este es el paso crucial que registra la entidad `User` dentro del contexto de este módulo. Permite que el `AuthService` pueda inyectar y utilizar el repositorio de `User` para interactuar con la base de datos.
*   **`exports: [TypeOrmModule]`**: Exportar `TypeOrmModule` permite que otros módulos que importen `AuthModule` también tengan acceso a las entidades registradas aquí, si fuera necesario.

## 3. Integración en el Módulo Principal (`AppModule`)

Finalmente, para que la aplicación reconozca el nuevo `AuthModule`, se importa en el módulo raíz `AppModule`.

**`04-teslo-shop/src/app.module.ts`**

- import { FilesModule } from './files/files.module';
+ import { FilesModule } from './files/files.module';
+ import { AuthModule } from './auth/auth.module';
 
 @Module({
   imports: [ConfigModule.forRoot(),
@@ -33,7 +34,8 @@
     ProductsModule,
     CommonModule,
     SeedModule,
-    FilesModule],
+    FilesModule,
+    AuthModule],
 
   controllers: [],
   providers: [],

Este paso "activa" el módulo de autenticación, haciendo que sus controladores y rutas (como `/auth`) estén disponibles en la aplicación.

## Resumen

Con estos cambios, hemos establecido la estructura fundamental para la gestión de usuarios. Hemos definido cómo se verán nuestros usuarios en la base de datos y hemos creado un módulo dedicado que manejará toda la lógica de autenticación, siguiendo las mejores prácticas de arquitectura modular de NestJS.
