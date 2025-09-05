## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S13 Decorador de Propiedad Personalizado -- GetUser

En esta sección, hemos introducido un decorador de NestJS personalizado llamado `@GetUser`. El objetivo principal de este decorador es simplificar la forma en que accedemos a la información del usuario autenticado dentro de nuestros controladores.

## ¿Por Qué Crear un Decorador Personalizado?

Anteriormente, para obtener el usuario en una ruta protegida, necesitábamos inyectar el objeto `request` completo y luego acceder a `request.user`. Esto no solo es repetitivo, sino que también acopla nuestro controlador a la estructura del objeto `request` de Express.

Crear un decorador `@GetUser` nos permite abstraer esa lógica, haciendo nuestro código más limpio, más fácil de leer y reutilizable.

## Creación del Decorador: `get-user.decorator.ts`

Se creó un nuevo archivo para nuestro decorador. Este utiliza la función `createParamDecorator` de NestJS para fabricar un decorador de parámetro.

import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
	(data, context: ExecutionContext) => {
		const req = context.switchToHttp().getRequest();
		const user = req.user;

		if (!user)
			throw new InternalServerErrorException('User not found (request)');

		return user;
	},
);

### Puntos Clave del Código:

1.  **`createParamDecorator`**: Es una función de fábrica que NestJS nos proporciona para crear nuestros propios decoradores.
2.  **`ExecutionContext`**: Ofrece información sobre el contexto de ejecución actual, como el controlador, el manejador de la ruta y, lo más importante, el objeto de la solicitud (`request`).
3.  **`context.switchToHttp().getRequest()`**: Con esto, obtenemos acceso al objeto `request` nativo del framework subyacente (por ejemplo, Express).
4.  **`const user = req.user`**: Extraemos el objeto `user`, que fue previamente validado y adjuntado a la solicitud por nuestra estrategia de Passport (`JwtStrategy`).
5.  **Validación**: Se añade una comprobación crucial. Si por alguna razón el objeto `user` no existe en la solicitud (lo cual no debería ocurrir en una ruta protegida), lanzamos una excepción `InternalServerErrorException`. Esto previene errores inesperados en tiempo de ejecución.
6.  **`return user`**: El valor que retorna la función del decorador es lo que se inyectará en el parámetro del método del controlador donde se use `@GetUser`.

## Implementación en el Controlador: `auth.controller.ts`

Con el decorador ya creado, lo utilizamos para refactorizar nuestro método `testingPrivateRoute`.

import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator'; // 1. Importamos el decorador

import { CreateUserDto, LoginUserDto } from './dto/index';
import { User } from './entities/user.entity'; // 2. Importamos la entidad para tipado

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// ... otros métodos

	@Get('private')
	@UseGuards(AuthGuard())
	testingPrivateRoute(
		// La forma anterior (ahora comentada):
		// @Req() request: Express.Request

		// 3. La nueva forma, mucho más limpia:
		@GetUser() user: User,
	) {
		return {
			ok: true,
			message: 'Hola Mundo private',
			user, // 4. Retornamos el usuario obtenido
		};
	}
}

### Puntos Clave del Código:

1.  **Importación**: Importamos nuestro nuevo decorador `GetUser`.
2.  **Tipado Fuerte**: Importamos la entidad `User` para tener un tipado estricto en el parámetro, lo que nos da autocompletado y seguridad de tipos.
3.  **Uso del Decorador**: Reemplazamos `@Req()` por `@GetUser() user: User`. Ahora, la variable `user` contiene directamente el objeto del usuario autenticado, sin pasos intermedios.
4.  **Respuesta**: Devolvemos el objeto `user` en la respuesta para verificar que el decorador funciona correctamente.

## Importancia y Beneficios

*   **Código Limpio y Declarativo**: Los controladores son más legibles. En lugar de lógica imperativa para extraer datos, declaramos lo que necesitamos: `@GetUser()`.
*   **Reutilización**: Podemos usar `@GetUser` en cualquier ruta protegida de nuestra aplicación.
*   **Mantenibilidad**: Si la forma de acceder al usuario cambia en el futuro, solo necesitamos modificar la lógica dentro del decorador `get-user.decorator.ts`, sin tocar ningún controlador.
*   **Single Responsibility Principle (SRP)**: La responsabilidad de obtener el usuario de la solicitud ahora recae únicamente en el decorador, no en el controlador.
