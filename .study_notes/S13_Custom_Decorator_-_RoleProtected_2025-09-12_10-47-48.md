## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# S13 Custom Decorator — RoleProtected

En esta sección, refactorizamos la forma en que protegemos las rutas basadas en roles. Creamos un decorador personalizado llamado `@RoleProtected` para reemplazar el uso genérico de `@SetMetadata`. Este cambio mejora significativamente la legibilidad, mantenibilidad y seguridad de tipos en nuestro código.

### 1. Creación del Enum `ValidRoles`

Para evitar el uso de "magic strings" (cadenas de texto propensas a errores de tipeo) y para tener una fuente única de verdad para los roles válidos en la aplicación, se creó un `enum` de TypeScript.

> **`04-teslo-shop/src/auth/interfaces/valid-roles.ts`**
> export enum ValidRoles {
> 	admin = 'ADMIN',
> 	superUser = 'SUPER-ADMIN',
> 	user = 'USER'
> }
>
> - **Importancia**: Centralizar los roles en un `enum` nos permite reutilizarlos en toda la aplicación con autocompletado y verificación de tipos, reduciendo drásticamente la posibilidad de errores.

### 2. Creación del Decorador Personalizado `@RoleProtected`

El cambio principal es la creación de un decorador específico para la protección de rutas. Este decorador encapsula la lógica de `SetMetadata`, proporcionando una API más clara y semántica.

> **`04-teslo-shop/src/auth/decorators/role-protected.decorator.ts`**
> import { SetMetadata } from '@nestjs/common';
> import { ValidRoles } from '../interfaces';
>
> export const META_ROLES = 'roles';
>
> export const RoleProtected = (...args: ValidRoles[]) => {
> 	return SetMetadata(META_ROLES, args);
> };
>
> - **`META_ROLES`**: Se exporta una constante para la clave de los metadatos. Esto evita errores de tipeo al recuperar la metadata en el Guard.
> - **`RoleProtected`**: Es una función que acepta un número variable de argumentos (`...args`) del tipo `ValidRoles` y los asigna a los metadatos de la ruta.

### 3. Actualización del `UserRolesGuard`

El `Guard` que valida los roles ahora utiliza la constante `META_ROLES` para obtener los roles permitidos, acoplándose de manera segura al decorador.

> **`04-teslo-shop/src/auth/guards/user-roles.guard.ts`**
> // ... imports
> import { META_ROLES } from '../decorators/role-protected.decorator';
>
> @Injectable()
> export class UserRolesGuard implements CanActivate {
> 	// ... constructor
>
> 	canActivate(
> 		context: ExecutionContext,
> 	): boolean | Promise<boolean> | Observable<boolean> {
>
> 		const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
>
> 		if (!validRoles) return true;
> 		// ... resto de la lógica
> 	}
> }
>
> - **Importancia**: Al usar `META_ROLES`, nos aseguramos de que el `Guard` y el decorador siempre usen la misma clave de metadatos. Si la clave necesita cambiar, solo se modifica en un lugar.

### 4. Implementación en el `AuthController`

Finalmente, vemos cómo este nuevo decorador simplifica y clarifica el código en el controlador.

**Antes:**
> // ...
> @Get('private2')
> @SetMetadata('roles', ['ADMIN', 'super-user'])
> @UseGuards(AuthGuard(), UserRolesGuard)
> testingPrivateRoute(
> 	// ...
> ) { // ... }

**Después:**
> **`04-teslo-shop/src/auth/auth.controller.ts`**
> // ...
> import { RoleProtected } from './decorators/role-protected.decorator';
> import { ValidRoles } from './interfaces';
> // ...
>
> @Get('private2')
> @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
> @UseGuards(AuthGuard(), UserRolesGuard)
> testingPrivateRoute(
> 	@GetUser() user: User
> ) {
> 	return {
> 		ok: true,
> 		user
> 	}
> }
>
> - **Claridad**: `@RoleProtected(ValidRoles.superUser)` es mucho más descriptivo que `@SetMetadata('roles', ['SUPER-ADMIN'])`.
> - **Seguridad de Tipos**: El decorador solo acepta valores del `enum` `ValidRoles`, lo que previene errores en tiempo de compilación si se intenta usar un rol que no existe.

### 5. Mejoras en la Organización (Archivos de Barril)

Se crearon archivos `index.ts` en las carpetas `decorators` e `interfaces`. Estos archivos (conocidos como "barrel files") exportan todos los módulos de su directorio, permitiendo importaciones más limpias y agrupadas en otros lugares de la aplicación.

> **`04-teslo-shop/src/auth/decorators/index.ts`**
> export { GetUser } from "./get-user.decorator";
> export { RawHeaders } from "./raw-headers.decorator";
> export { RoleProtected } from "./role-protected.decorator";
>
> Esto permite hacer: `import { GetUser, RoleProtected } from './decorators';` en lugar de tener múltiples líneas de importación.
