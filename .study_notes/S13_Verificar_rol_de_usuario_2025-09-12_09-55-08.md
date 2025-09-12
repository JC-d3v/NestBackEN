## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

### S13: Verificación de Rol de Usuario

En esta lección, implementamos un `Guard` personalizado para verificar los roles de un usuario. Esto es fundamental para la autorización, permitiendo restringir el acceso a ciertas rutas según los permisos que tenga el usuario autenticado.

#### Implementación del `UserRolesGuard`

El corazón de esta funcionalidad es el `UserRolesGuard`. Este guard utiliza el `Reflector` de NestJS para leer la metadata (los roles permitidos) que definimos en el controlador para una ruta específica.

La lógica del guard ha sido actualizada para realizar una verificación real:

// 04-teslo-shop/src/auth/guards/user-roles/user-roles.guard.ts

import {
	CanActivate,
	ExecutionContext,
	Injectable,
	BadRequestException,
	ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRolesGuard implements CanActivate {

	constructor(
		private readonly reflector: Reflector
	) { }

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

		const validRoles: string[] = this.reflector.get('roles', context.getHandler());

		if (!validRoles) return true;
		if (validRoles.length === 0) return true;

		const req = context.switchToHttp().getRequest();
		const user = req.user as User;

		if (!user)
			throw new BadRequestException('User not found');

		for (const role of user.roles) {
			if (validRoles.includes(role)) {
				return true;
			}
		}

		throw new ForbiddenException(
			`${user.fullName} need a valid role: [${validRoles}]`
		);
	}
}

**Análisis del Guard:**

1.  **Obtención de Roles**: `this.reflector.get('roles', ...)` lee el array de roles que fue definido en el controlador con el decorador `@SetMetadata`.
2.  **Validaciones Iniciales**: Si la ruta no requiere roles específicos (`!validRoles` o `validRoles.length === 0`), el guard permite el acceso (`return true`).
3.  **Obtención del Usuario**: Se extrae el objeto `user` de la petición (`req`). Es crucial que un `AuthGuard` se haya ejecutado **antes** para que este objeto esté disponible y verificado.
4.  **Manejo de Errores**:
    *   Si por alguna razón el objeto `user` no está en la `request`, se lanza un `BadRequestException`.
    *   Si el usuario no posee ninguno de los roles requeridos, se lanza un `ForbiddenException`, informando qué roles son válidos. Esto es mucho más claro que un simple error "403 Forbidden".
5.  **Lógica de Autorización**: Se itera sobre los roles que tiene el usuario (`user.roles`). Si alguno de sus roles coincide con los `validRoles` de la ruta, se concede el acceso.

#### Aplicación en el Controlador

Para proteger una ruta, aplicamos el `UserRolesGuard` y le pasamos los roles necesarios a través de metadata.

// 04-teslo-shop/src/auth/auth.controller.ts

// ...

@Get('private2')
@SetMetadata('roles', ['ADMIN', 'super-user'])
@UseGuards(
	AuthGuard(),
	UserRolesGuard
)
@Auth()
testingPrivateRoute(
	@GetUser() user: User
) {
	return {
		ok: true,
		user
	}
}

// ...

**Puntos Clave:**

*   **`@UseGuards(AuthGuard(), UserRolesGuard)`**: El orden es importante. Primero, `AuthGuard()` verifica que el JWT sea válido y adjunta el usuario a la `request`. Después, `UserRolesGuard` toma ese usuario y verifica sus roles.
*   **`@SetMetadata('roles', ['ADMIN', 'super-user'])`**: Así se define la metadata que el `Reflector` leerá en el guard. Esta ruta ahora solo es accesible para usuarios con el rol `ADMIN` o `super-user`.
*   **Consistencia de Roles**: Se cambió `'admin'` a `'ADMIN'`. La consistencia en los nombres de los roles (mayúsculas, minúsculas, etc.) es vital, ya que la comparación es estricta y deben coincidir con los valores en la base de datos.

Con estos cambios, hemos creado un sistema de autorización robusto y declarativo, permitiendo reutilizar la lógica de validación de roles en cualquier parte de la aplicación de forma limpia.
