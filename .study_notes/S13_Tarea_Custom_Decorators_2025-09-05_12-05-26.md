## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# Decoradores Personalizados en NestJS: `GetUser` y `RawHeaders`

En esta lección, exploramos cómo crear y mejorar decoradores personalizados en NestJS para optimizar nuestro código, hacerlo más legible y reutilizable. Analizaremos la evolución del decorador `@GetUser` y la creación de un nuevo decorador, `@RawHeaders`.

---

### 1. Mejorando el Decorador `@GetUser`

El decorador `@GetUser` nos permitía acceder al objeto `user` que se adjunta a la `request` después de pasar por el `AuthGuard`. Sin embargo, a menudo solo necesitamos una propiedad específica del usuario, como su `email` o `id`.

Para hacer nuestro decorador más flexible, lo hemos modificado para que acepte un argumento opcional.

#### Código del Decorador Actualizado (`get-user.decorator.ts`)

import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException
} from '@nestjs/common';


export const GetUser = createParamDecorator(
	(data: string, context: ExecutionContext) => {

		const req = context.switchToHttp().getRequest();
		const user = req.user;

		if (!user)
			throw new InternalServerErrorException('User not found (request)')

		return (!data) ?
			user :
			user[data];
	}
);

**Análisis del Cambio:**

*   El decorador ahora puede recibir un `data: string`.
*   Si `data` no se proporciona (`!data`), el decorador devuelve el objeto `user` completo, manteniendo su comportamiento original.
*   Si se proporciona `data` (por ejemplo, `'email'`), el decorador devuelve únicamente el valor de esa propiedad (`user[data]`).

### 2. Creación del Decorador `@RawHeaders`

A veces, necesitamos acceder a las cabeceras (`headers`) sin procesar de una solicitud. NestJS nos proporciona el decorador `@Headers()`, pero este devuelve un objeto ya parseado. Para obtener el array de strings "crudo", hemos creado un decorador específico.

#### Código del Nuevo Decorador (`raw-headers.decorator.ts`)

import {
	createParamDecorator,
	ExecutionContext
} from "@nestjs/common";
// TODO: AL SER UN DECORATOR COMUN SE RECOMIENDA QUE PASE A COMMON


export const RawHeaders = createParamDecorator(
	(data: string, context: ExecutionContext) => {

		const req = context.switchToHttp().getRequest();
		return req.rawHeaders;

	}
)

**Análisis del Código:**

*   Utiliza `createParamDecorator` para definir un nuevo decorador de parámetros.
*   Accede al objeto `request` a través del `ExecutionContext`.
*   Devuelve `req.rawHeaders`, que es un array de strings con las cabeceras tal como llegaron en la petición HTTP.
*   El comentario `TODO` es una nota importante de buenas prácticas: los decoradores reutilizables deberían moverse a un módulo común (`common`) para estar disponibles en toda la aplicación.

### 3. Aplicación en el Controlador

Ahora podemos usar estos decoradores en nuestros controladores para obtener la información de forma limpia y declarativa.

#### Uso en `auth.controller.ts`

import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	Req,
	Headers
} from '@nestjs/common';
import {
	AuthGuard
} from '@nestjs/passport';
import {
	IncomingHttpHeaders
} from 'http';
import {
	AuthService
} from './auth.service';
import {
	GetUser
} from './decorators/get-user.decorator';
import {
	RawHeaders
} from './decorators/raw-headers.decorator';

import {
	CreateUserDto,
	LoginUserDto
} from './dto/index';
import {
	User
} from './entities/user.entity';

// ...

@Get('private')
@UseGuards(AuthGuard())
testingPrivateRoute(
	@Req() request: Express.Request,
	@GetUser() user: User,
	@GetUser('email') userEmail: string,
	@RawHeaders() rawHeaders: string[],
	@Headers() headers: IncomingHttpHeaders,
) {

	return {
		ok: true,
		message: 'Hola Mundo private',
		user,
		userEmail,
		rawHeaders,
		headers,
	}
}

// ...

**Puntos Clave del Ejemplo:**

*   `@GetUser()`: Obtiene el objeto `user` completo.
*   `@GetUser('email')`: Extrae únicamente la propiedad `email` del usuario.
*   `@RawHeaders()`: Obtiene el array de cabeceras sin procesar.
*   `@Headers()`: Obtiene el objeto de cabeceras procesado por NestJS (se incluye para comparación).

---

### Conclusión

Los decoradores personalizados son una herramienta poderosa en NestJS para abstraer lógica repetitiva y mantener nuestros controladores limpios. Al permitir que acepten parámetros, aumentamos su flexibilidad y reducimos aún más el código "boilerplate", lo que resulta en un desarrollo más rápido y mantenible.
