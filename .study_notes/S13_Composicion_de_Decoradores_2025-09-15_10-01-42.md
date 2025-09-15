## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S13 | Composición de Decoradores

En el desarrollo de aplicaciones con NestJS, es común encontrarnos repitiendo la misma combinación de decoradores en múltiples rutas. Por ejemplo, para proteger un *endpoint* y verificar roles, podríamos necesitar aplicar `@UseGuards()` y nuestro decorador `@RoleProtected()` juntos cada vez. Esto no solo es tedioso, sino que también va en contra del principio **DRY** (*Don't Repeat Yourself*).

NestJS ofrece una solución elegante para este problema: la **composición de decoradores**. Podemos crear un decorador personalizado que agrupe y aplique un conjunto de otros decoradores, simplificando nuestro código y mejorando la mantenibilidad.

### Creación del Decorador `@Auth`

El cambio principal es la creación de un nuevo decorador `@Auth` que encapsula la lógica de protección de rutas.

**`04-teslo-shop/src/auth/decorators/auth.decorator.ts`**
import { UserRolesGuard } from './../guards/user-roles.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {

	return applyDecorators(
		RoleProtected(...roles),
		UseGuards(AuthGuard(), UserRolesGuard),
	);
}

-	**`applyDecorators`**: Esta función de NestJS nos permite combinar múltiples decoradores en uno solo.
-	**`RoleProtected(...roles)`**: Aplica nuestro decorador existente para registrar los roles permitidos en los metadatos de la ruta.
-	**`UseGuards(AuthGuard(), UserRolesGuard)`**: Aplica los guardias necesarios. `AuthGuard()` (de Passport) verifica el JWT y `UserRolesGuard` comprueba si el usuario tiene los roles requeridos.

No olvides exportar el nuevo decorador desde el archivo "barrel" (`index.ts`) para facilitar su importación en otros módulos.

**`04-teslo-shop/src/auth/decorators/index.ts`**
export { GetUser } from "./get-user.decorator";
export { RawHeaders } from "./raw-headers.decorator";
export { RoleProtected } from "./role-protected.decorator";
export { Auth } from "./auth.decorator"

### Implementación del Decorador Compuesto

Ahora, en lugar de usar varios decoradores para proteger una ruta, podemos usar únicamente `@Auth`.

**`04-teslo-shop/src/auth/auth.controller.ts`**
// ... otros imports
import { Auth, GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto, LoginUserDto } from './dto/index';
// ...

// ...

	@Get('private3')
	@Auth(ValidRoles.user)
	privateRoute3(
		@GetUser() user: User
	) {

		return {
			Ok: true,
			user
		}
	}
Como puedes ver, la ruta `private3` ahora está protegida y requiere el rol `user` con una sola línea: `@Auth(ValidRoles.user)`. Esto hace que el código del controlador sea mucho más limpio y declarativo.

Este mismo decorador se aplicó también en el `SeedController` para proteger el *endpoint* de la semilla.

**`04-teslo-shop/src/seed/seed.controller.ts`**
import { Controller, Get } from '@nestjs/common';
import { ValidRoles } from '../auth/interfaces';
import { Auth } from '../auth/decorators';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
	constructor(private readonly seedService: SeedService) {}


	@Get()
	@Auth(ValidRoles.user)
	exceuteSeed() {
		return this.seedService.runSeed();
	}
}

### Importancia y Ventajas

-	**Código Limpio y Legible**: El código del controlador es más fácil de leer. `@Auth(ValidRoles.user)` dice exactamente lo que hace sin el ruido de múltiples decoradores.
-	**Reutilización y Mantenimiento**: Si en el futuro necesitamos añadir un nuevo guardia a todas nuestras rutas protegidas, solo tenemos que modificar el decorador `Auth` en un único lugar.
-	**Menos Errores**: Al reducir la repetición, minimizamos la posibilidad de olvidar aplicar un decorador en alguna ruta, lo que podría generar un agujero de seguridad.
