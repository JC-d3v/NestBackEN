## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S13: Creación de un Custom Guard para Roles de Usuario

En esta sección, exploramos cómo construir un sistema de autorización basado en roles utilizando herramientas personalizadas de NestJS. El objetivo es crear un `Guard` que restrinja el acceso a ciertas rutas según los roles asignados a un usuario. Para lograr esto de manera declarativa y reutilizable, combinaremos un `Guard` personalizado con decoradores de metadatos.

## Pasos Clave del Commit

### 1. Creación del `UserRolesGuard`

El cambio más significativo es la introducción de un nuevo `Guard` llamado `UserRolesGuard`. Este guard es responsable de verificar si el usuario que realiza la solicitud tiene los permisos necesarios para acceder a un endpoint específico.

**`04-teslo-shop/src/auth/guards/user-roles/user-roles.guard.ts`**

import {
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common';
import {
	Reflector
} from '@nestjs/core';
import {
	Observable
} from 'rxjs';

@Injectable()
export class UserRolesGuard implements CanActivate {

	constructor(
		private readonly reflector: Reflector
	) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise < boolean > | Observable < boolean > {

		const validRoles: string[] = this.reflector.get('roles', context.getHandler())

		console.log({
			validRoles
		});

		return true;
	}
}

**Puntos importantes:**

*   **`implements CanActivate`**: Para que una clase funcione como un `Guard`, debe implementar la interfaz `CanActivate`.
*   **`constructor(private readonly reflector: Reflector)`**: Inyectamos el servicio `Reflector`. Esta es una clase de utilidad de NestJS que nos permite leer los metadatos adjuntos a los controladores y sus métodos.
*   **`canActivate(context: ExecutionContext)`**: Este es el método principal que NestJS invoca para decidir si una solicitud debe ser procesada o denegada.
*   **`this.reflector.get('roles', context.getHandler())`**: Aquí es donde ocurre la "magia". Usamos el `reflector` para leer un metadato con la clave `'roles'`. `context.getHandler()` nos da una referencia al método del controlador que se está ejecutando, permitiéndonos leer los metadatos específicos de esa ruta.
*   **`return true`**: En este commit inicial, el `Guard` siempre permite el acceso. La lógica de validación real (comparar `validRoles` con los roles del usuario) se agregaría aquí en pasos futuros.

### 2. Aplicando el Guard y los Metadatos en el Controlador

Para que nuestro `UserRolesGuard` sepa qué roles se requieren para una ruta, necesitamos "decorar" esa ruta con los metadatos correspondientes.

**`04-teslo-shop/src/auth/auth.controller.ts`**

import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	Req,
	Headers,
	SetMetadata // Importado
} from '@nestjs/common';
import {
	AuthGuard
} from '@nestjs/passport';
// ... otros imports
import {
	User
} from './entities/user.entity';
import {
	UserRolesGuard
} from './guards/user-roles/user-roles.guard'; // Importado

@Controller('auth')
export class AuthController {

	// ... otros métodos

	@Get('private2')
	@SetMetadata('roles', ['admin', 'super-user']) // <-- Paso 1: Definir metadatos
	@UseGuards( // <-- Paso 2: Aplicar los Guards
		AuthGuard(),
		UserRolesGuard
	)
	privateRoute2(
		@GetUser() user: User
	) {

		return {
			Ok: true,
			user
		}
	}
}

**Puntos importantes:**

*   **`@SetMetadata('roles', ['admin', 'super-user'])`**: Este decorador, importado de `@nestjs/common`, nos permite adjuntar un par clave-valor de metadatos a la ruta `private2`. La clave es `'roles'` y el valor es un array de strings que representan los roles permitidos.
*   **`@UseGuards(AuthGuard(), UserRolesGuard)`**: Aplicamos los `Guards` en orden.
    1.  `AuthGuard()`: Primero, nos aseguramos de que el usuario esté autenticado (que tenga un JWT válido).
    2.  `UserRolesGuard`: Si la autenticación es exitosa, nuestro `Guard` personalizado se ejecuta para verificar los roles.

## Importancia y Concepto

Este enfoque es fundamental para crear sistemas de autorización robustos y desacoplados.

*   **Declarativo**: En lugar de escribir lógica de roles directamente en cada ruta, simplemente declaramos qué roles se necesitan a través de metadatos.
*   **Reutilizable**: El `UserRolesGuard` es genérico. No contiene nombres de roles específicos, sino que los lee de los metadatos. Esto significa que podemos usar el mismo `Guard` para proteger cualquier ruta, cada una con sus propios requisitos de roles.
*   **Separación de Responsabilidades**: El controlador se enfoca en manejar la solicitud HTTP, mientras que el `Guard` se encarga exclusivamente de la lógica de autorización.

Este commit sienta las bases para un sistema de control de acceso basado en roles (RBAC) flexible y mantenible en una aplicación NestJS.
