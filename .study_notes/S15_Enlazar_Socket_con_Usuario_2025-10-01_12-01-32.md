## Resumen de avance
# S15: Enlazar Socket con Usuario y Autenticación JWT

En esta sesión, integramos el sistema de autenticación con nuestro WebSocket para asociar cada cliente conectado con un usuario registrado en la base de datos. Esto nos permite identificar quién envía un mensaje y personalizar la comunicación.

## Cambios Clave

### 1. Actualización del Servicio (`messages-ws.service.ts`)

El cambio más importante ocurre en el servicio. Ahora, en lugar de solo almacenar el socket del cliente, guardamos tanto el socket como la información completa del usuario.

- **Inyección del Repositorio de `User`**: Para acceder a la información de los usuarios, inyectamos el `UserRepository`.
- **Modificación de `ConnectedClients`**: La interfaz que define la estructura de nuestros clientes conectados ahora almacena un objeto que contiene el `socket` y la entidad `user`.

	```typescript
	import { User } from './../auth/entities/user.entity';
	import { Injectable } from '@nestjs/common';
	import { InjectRepository } from '@nestjs/typeorm';
	import { Socket } from 'socket.io';
	import { Repository } from 'typeorm';

	interface ConnectedClients {
		[id: string]: {
			socket: Socket,
			user: User
		}
	}
	```

- **Actualización de `registerClient`**: El método ahora es asíncrono y recibe el `userId`. Busca al usuario en la base de datos, verifica que exista y esté activo, y luego lo almacena junto con su socket.

	```typescript
	@Injectable()
	export class MessagesWsService {

		private connectedClients: ConnectedClients = {}

		constructor(
			@InjectRepository(User)
			private readonly userRepository: Repository<User>
		) { };

		async registerClient(client: Socket, userId: string) {

			const user = await this.userRepository.findOneBy({ id: userId });
			if (!user) throw new Error('User not found');
			if (!user.isActive) throw new Error('User is not active');

			this.connectedClients[client.id] = {
				socket: client,
				user: user
			};
		}
	```
- **Nuevo método `getUserFullName`**: Se añade una función para obtener el nombre completo del usuario a partir del `socketId`, permitiendo identificar quién envía un mensaje.

	```typescript
	getUserFullName(socketId: string) {
		return this.connectedClients[socketId].user.fullName;
	}
	```

### 2. Autenticación en el Gateway (`messages-ws.gateway.ts`)

El gateway ahora se encarga de autenticar al cliente en el momento de la conexión.

- **`handleConnection` asíncrono**: El método se convierte en `async` para poder realizar operaciones asíncronas, como la validación del usuario en la base de datos.
- **Verificación del JWT**: Al conectarse un cliente, se extrae el token JWT de los `handshake.headers`. Se utiliza `JwtService` para verificarlo. Si el token no es válido, la conexión se rechaza.
- **Registro del Cliente con ID de Usuario**: Si el token es válido, se llama a `registerClient` con el `id` del usuario extraído del payload del JWT.

	```typescript
	async handleConnection(client: Socket) {
		const token = client.handshake.headers.authentication as string;
		let payload: JwtPayload;

		try {
			payload = this.JwtService.verify(token);
			await this.messagesWsService.registerClient(client, payload.id);

		} catch (error) {
			client.disconnect();
			return;
		}
	```
- **Mensajes Personalizados**: Al enviar un mensaje desde el servidor, ahora se utiliza `getUserFullName(client.id)` para mostrar el nombre real del remitente en lugar de un texto estático.

	```typescript
	this.wss.emit('message-from-server', {
		fullName: this.messagesWsService.getUserFullName(client.id),
		message: payload.message || 'no-message!!'
	});
	```

### 3. Importación del `AuthModule` (`messages-ws.module.ts`)

Para que el `MessagesWsModule` tenga acceso al `JwtService` y al `UserRepository`, es crucial importar el `AuthModule`.

```typescript
import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
	providers: [MessagesWsGateway, MessagesWsService],
	imports: [AuthModule],
})
export class MessagesWsModule { }
```

## Importancia

Asociar una conexión de WebSocket con un usuario autenticado es un paso fundamental para construir aplicaciones en tiempo real seguras y funcionales. Esto permite:
- **Identificar a los usuarios**: Saber exactamente qué usuario está conectado a través de qué socket.
- **Autorización**: Implementar lógica de permisos para que solo ciertos usuarios puedan realizar acciones específicas.
- **Comunicación Personalizada**: Enviar mensajes dirigidos a usuarios específicos.
- **Persistencia**: Mantener una relación entre la actividad en tiempo real y los datos del usuario en la base de datos.
