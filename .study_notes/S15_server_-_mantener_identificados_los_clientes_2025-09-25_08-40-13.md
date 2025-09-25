## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S15: Mantener Identificados los Clientes del Servidor WebSocket

En esta sesión, se implementó una mejora fundamental para nuestra aplicación de WebSockets: la capacidad de rastrear y administrar activamente a todos los clientes que están conectados al servidor. Anteriormente, solo registrábamos en la consola cuándo un cliente se conectaba o desconectaba, pero no manteníamos un estado persistente de las conexiones activas.

Este cambio es crucial porque nos permite saber en todo momento *quién* está conectado, sentando las bases para futuras funcionalidades como enviar mensajes a clientes específicos, a grupos de clientes o a todos a la vez.

---

### 1. Centralización de la Lógica en `MessagesWsService`

La responsabilidad de administrar los clientes se ha movido al servicio `MessagesWsService`. Esto sigue el principio de separación de preocupaciones, manteniendo el *gateway* limpio y enfocado en manejar los eventos de conexión y desconexión, mientras que el *servicio* se encarga de la lógica de negocio y el estado.

Se introdujeron los siguientes elementos clave:

*   **Interfaz `ConnectedClients`**: Define la estructura de nuestro objeto de almacenamiento. Será un diccionario donde cada llave es el `id` del socket del cliente y el valor es la instancia completa del `Socket`.
*   **Propiedad `connectedClients`**: Un objeto privado que almacena en memoria a todos los clientes conectados.
*   **Métodos de Gestión**:
    *   `registerClient(client: Socket)`: Añade un nuevo cliente al objeto `connectedClients`.
    *   `removeClient(clientId: string)`: Elimina un cliente usando su `id`.
    *   `getConnectedClients(): number`: Devuelve el número total de clientes conectados actualmente.

// 04-teslo-shop/src/messages-ws/messages-ws.service.ts

import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
	[id: string]: Socket
}

@Injectable()
export class MessagesWsService {

	private connectedClients: ConnectedClients = {}

	registerClient(client: Socket) {
		this.connectedClients[client.id] = client;
	}

	removeClient(clientId: string) {
		delete this.connectedClients[clientId];
	}

	getConnectedClients(): number {
		return Object.keys(this.connectedClients).length;
	}
}

### 2. Integración con el Gateway

El `MessagesWsGateway` ahora inyecta y utiliza `MessagesWsService` para registrar y dar de baja a los clientes durante los eventos del ciclo de vida de la conexión.

*   **`handleConnection(client: Socket)`**: Cuando un cliente se conecta, se llama a `messagesWsService.registerClient()` para añadirlo a nuestra lista.
*   **`handleDisconnect(client: any)`**: Cuando un cliente se desconecta, se invoca a `messagesWsService.removeClient()` para eliminarlo de la lista.

En ambos métodos, se añadió un `console.log` para mostrar en tiempo real el número de clientes conectados, permitiéndonos verificar que nuestro sistema de seguimiento funciona correctamente.

// 04-teslo-shop/src/messages-ws/messages-ws.gateway.ts

// ... imports
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	// ... inyección de dependencia

	handleConnection(client: Socket) {
		// console.log('Cliente conectado', client.id);
		this.messagesWsService.registerClient(client);

		console.log({ ClientesConectados: this.messagesWsService.getConnectedClients() });
	}

	handleDisconnect(client: any) {
		// console.log('Cliente desconectado', client.id);
		this.messagesWsService.removeClient(client.id);

		console.log({ ClientesConectados: this.messagesWsService.getConnectedClients() });
	}
}

### Importancia de Este Cambio

*   **Gestión de Estado**: Es el primer paso para construir una aplicación de chat real. Sin saber quién está conectado, es imposible dirigir mensajes.
*   **Escalabilidad y Orden**: Centralizar la lógica en un servicio hace que el código sea más limpio, mantenible y fácil de testear.
*   **Base para el Futuro**: Con esta lista de clientes, ahora podemos implementar funcionalidades como:
    *   Transmitir mensajes a todos los usuarios.
    *   Enviar mensajes privados a un usuario específico.
    *   Mostrar una lista de "usuarios en línea".
