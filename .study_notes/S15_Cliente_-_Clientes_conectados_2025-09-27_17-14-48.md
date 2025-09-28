## Resumen de avance
# S15 Cliente - Clientes conectados

En esta sección, se implementa la funcionalidad para que el servidor notifique a todos los clientes conectados cada vez que un nuevo cliente se une o se desconecta. Esto permite que cada cliente tenga una lista actualizada en tiempo real de todos los participantes en el WebSocket.

### Backend: Emisión de la Lista de Clientes

Para notificar a todos los clientes, necesitamos acceso al servidor de WebSockets en su totalidad, no solo al cliente individual que desencadena el evento.

1.  **Inyección del Servidor WebSocket (`WebSocketServer`)**:
    Se utiliza el decorador `@WebSocketServer()` para inyectar una instancia del servidor de Socket.IO (`wss`). Esto nos da control para emitir eventos a todos los clientes conectados.

    ```typescript
    // src/messages-ws/messages-ws.gateway.ts

    import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
    import { Server, Socket } from 'socket.io';
    import { MessagesWsService } from './messages-ws.service';

    @WebSocketGateway({ cors: true })
    export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

        @WebSocketServer() wss: Server;

        constructor(
            private readonly messagesWsService: MessagesWsService
        ) {}
    ```

2.  **Modificación del Servicio**:
    El método `getConnectedClients` en `messages-ws.service.ts` se actualizó para devolver un arreglo de los IDs de los clientes (`string[]`) en lugar de solo la cantidad (`number`).

    ```typescript
    // src/messages-ws/messages-ws.service.ts

    // Antes
    getConnectedClients(): number {
        return Object.keys(this.connectedClients).length;
    }

    // Después
    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);
    }
    ```

3.  **Emisión de Eventos en Conexión y Desconexión**:
    Tanto en `handleConnection` como en `handleDisconnect`, después de registrar o eliminar un cliente, se utiliza `this.wss.emit()` para enviar el evento `clients-updated` con la lista actualizada de clientes a todos los sockets conectados.

    ```typescript
    // src/messages-ws/messages-ws.gateway.ts

    handleConnection(client: Socket) {
        this.messagesWsService.registerClient(client);
        // Emite la lista a todos los clientes
        this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    }

    handleDisconnect(client: Socket) {
        this.messagesWsService.removeClient(client.id);
        // Emite la lista a todos los clientes
        this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    }
    ```

### Frontend: Recepción y Visualización de la Lista

El cliente ahora debe escuchar el nuevo evento `clients-updated` y renderizar la lista de clientes en el DOM.

1.  **Actualización del HTML**:
    En `main.ts`, se añade una lista `<ul>` para mostrar los clientes.

    ```html
    <!-- 05-ws-client/src/main.ts -->

    <div>
        <h1> Websocket - Client </h1>
        <span id="server-status">offline</span>

        <ul id="clients-ul">
            <!-- Los clientes se renderizarán aquí -->
        </ul>
    </div>
    ```

2.  **Escuchar el Evento `clients-updated`**:
    En `socket-client.ts`, se añade un nuevo listener para el evento `clients-updated`. Cuando se recibe este evento, el callback se encarga de tomar el arreglo de IDs de clientes y generar dinámicamente los elementos `<li>` para mostrarlos en la lista `clients-ul`.

    ```typescript
    // 05-ws-client/src/socket-client.ts

    const addListeners = (socket: Socket) => {
        const clientsUl = document.querySelector('#clients-ul')!;

        // ... otros listeners

        socket.on('clients-updated', (clients: string[]) => {
            let clientsHtml = '';
            clients.forEach(clientId => {
                clientsHtml += `
                    <li>${clientId}</li>
                `;
            });
            clientsUl.innerHTML = clientsHtml;
        });
    };
    ```

Con estos cambios, cada vez que un usuario se conecta o desconecta, todos los clientes verán la lista de participantes actualizada en tiempo real.
