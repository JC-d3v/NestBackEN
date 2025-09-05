## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# Creación de Rutas Privadas y Autenticación con `AuthGuard`

En esta sesión, implementamos un mecanismo fundamental en cualquier aplicación: la protección de rutas. Ahora, no todos los *endpoints* serán públicos; algunos requerirán que el usuario esté autenticado para poder acceder a ellos. Además, realizamos una corrección importante en la definición de nuestra entidad de usuario.

## 1. Protección de Rutas con `@UseGuards` y `AuthGuard`

El cambio principal se realizó en `auth.controller.ts` para añadir una ruta de prueba que demuestra cómo restringir el acceso.

Para proteger un *endpoint* en NestJS, utilizamos el decorador `@UseGuards()`, que actúa como un *middleware* para verificar si una solicitud puede proceder. Dentro de este decorador, pasamos una instancia de `AuthGuard()`, proporcionada por el paquete `@nestjs/passport`.

`AuthGuard()` se integra automáticamente con la estrategia JWT que configuramos previamente. Cuando una solicitud llega a una ruta protegida por este guardia:

1.  Busca un *token* JWT en los encabezados de la solicitud.
2.  Valida el *token* utilizando la `JwtStrategy`.
3.  Si el *token* es válido, permite el acceso a la ruta.
4.  Si el *token* no existe o no es válido, devuelve automáticamente una respuesta de error `401 Unauthorized`.

### Código en `auth.controller.ts`

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto/index';

@Controller('auth')
export class AuthController {
	// ... otros métodos (login, createUser)
	
	@Get('private')
	@UseGuards(AuthGuard())
	testingPrivateRoute() {
		return {
			ok: true,
			message: 'Hola Mundo'
		}
	}
}

Con este simple cambio, el *endpoint* `GET /auth/private` ahora es una ruta privada. Solo los usuarios que presenten un JWT válido podrán recibir la respuesta `{ "ok": true, "message": "Hola Mundo" }`.

## 2. Corrección del Tipo de Dato en la Entidad `User`

Se realizó un ajuste menor pero importante en la entidad `User` (`user.entity.ts`) para garantizar la correcta correspondencia de tipos entre TypeORM y PostgreSQL.

El tipo de la columna `isActive` se cambió de `'bool'` a `'boolean'`.

### Código en `user.entity.ts`

// ...
@Column('boolean', {
	default: true
})
isActive: boolean;
// ...

**Importancia del cambio:**

Aunque PostgreSQL a menudo abrevia `boolean` como `bool`, utilizar el tipo `'boolean'` explícitamente en la definición de la entidad de TypeORM es la práctica recomendada. Esto asegura una mayor portabilidad y claridad, evitando posibles inconsistencias o errores de mapeo de datos entre la aplicación y la base de datos.
