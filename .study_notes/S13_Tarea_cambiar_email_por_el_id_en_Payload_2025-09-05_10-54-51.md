## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# S13: Tarea—Cambiar Email por ID en el Payload del JWT

En esta sección, se realizó una refactorización crucial para mejorar la seguridad y la robustez del sistema de autenticación. Se cambió el identificador del usuario en el payload del JSON Web Token (JWT) del `email` a la `id` única del usuario.

### ¿Por Qué es Importante Este Cambio?

Usar la `id` (generalmente un UUID) en lugar del `email` como identificador principal en el JWT es una práctica recomendada por varias razones:

1.  **Inmutabilidad**: La `id` de un usuario es única y nunca cambia. En cambio, un usuario podría querer cambiar su dirección de correo electrónico. Si el JWT dependiera del email, todos los tokens emitidos previamente quedarían invalidados o, peor aún, podrían generar conflictos.
2.  **Seguridad y Privacidad**: Exponer el correo electrónico en el payload del JWT, aunque esté codificado, revela información personal identificable (PII). Usar una `id` interna y no secuencial es más seguro y protege la privacidad del usuario.
3.  **Consistencia**: Es la forma estándar de referenciar entidades en una base de datos. Al alinear el JWT con el identificador primario de la base de datos, el código se vuelve más consistente y predecible.

## Análisis de los Cambios en el Código

La implementación de este cambio afectó a tres archivos clave en el módulo de autenticación.

### 1. Actualización de la Interfaz del Payload

El primer paso es definir la nueva "forma" que tendrá nuestro payload. Se modifica la interfaz `JwtPayload` para que espere una `id` en lugar de un `email`.

**Archivo**: `04-teslo-shop/src/auth/interfaces/jwt-payload.interface.ts`

// Antes
export interface JwtPayload {
	email: string;
	// ...
}

// Después
export interface JwtPayload {
	id: string;
	// ...
}

### 2. Modificación del Servicio de Autenticación

A continuación, se ajusta el `AuthService` para que, al momento de crear un usuario o iniciar sesión, genere el JWT utilizando la `id` del usuario.

**Archivo**: `04-teslo-shop/src/auth/auth.service.ts`

En el método `create`, se asegura de que el token se genere con la `id`.

// ...
	return {
		...user,
		// Antes
		// token: this.getJwtToken({ email: user.email })
		
		// Después
		token: this.getJwtToken({ id: user.id })
	};
// ...

De igual forma, en el método `login`, se actualiza la consulta para obtener la `id` de la base de datos y se usa para firmar el nuevo token.

// ...
	const user = await this.userRepository.findOne({
		where: { email },
		select: {
			email: true,
			password: true,
			id: true, // Se añade la selección del ID
		}
	})
// ...
	return {
		...user,
		// Antes
		// token: this.getJwtToken({ email: user.email })
		
		// Después
		token: this.getJwtToken({ id: user.id })
	};
// ...

### 3. Adaptación de la Estrategia de JWT

Finalmente, la estrategia de validación del JWT (`JwtStrategy`) debe ser actualizada. Esta estrategia se encarga de recibir el token en cada petición protegida, decodificarlo y validar que el usuario exista y esté activo.

Ahora, en lugar de buscar al usuario por su `email`, lo buscará por su `id`.

**Archivo**: `04-teslo-shop/src/auth/strategies/jwt.strategy.ts`

// ...
export class JwtStrategy extends PassportStrategy(Strategy) {

	// ...

	async validate(payload: JwtPayload): Promise<User> {

		// Antes
		// const { email } = payload;
		// const user = await this.userRepository.findOneBy({ email });

		// Después
		const { id } = payload;
		const user = await this.userRepository.findOneBy({ id });

		if (!user)
			throw new UnauthorizedException('Token not valid...');

		if (!user.isActive)
			throw new UnauthorizedException('User is Inactive...');

		return user;
	}
}

Con estos cambios, el sistema de autenticación ahora opera de una manera más segura, estándar y robusta, utilizando el identificador inmutable del usuario para la gestión de sesiones a través de JWT.
