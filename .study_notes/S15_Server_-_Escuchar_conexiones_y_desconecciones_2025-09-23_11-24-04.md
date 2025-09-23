## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# S15: Servidor — Escuchando Conexiones y Desconexiones

En esta sección, se establecen las bases para la comunicación en tiempo real en nuestra aplicación NestJS. El objetivo principal es configurar el servidor de WebSockets para que pueda detectar y reaccionar activamente cuando un nuevo cliente se conecta y cuando se desconecta. Este es un paso fundamental para cualquier aplicación que requiera interactividad instantánea.

### 1. Instalación de la Dependencia `socket.io`

Para que nuestro backend pueda manejar conexiones de WebSockets, primero es necesario añadir la librería `socket.io`. Este paquete es el estándar de facto para crear aplicaciones web en tiempo real.

El cambio se refleja en el archivo `package.json`:

{
    "dependencies": {
        "socket.io": "^4.8.1"
    }
}

### 2. Implementación de los Lifecycle Hooks del Gateway

NestJS simplifica enormemente el manejo del ciclo de vida de las conexiones WebSocket a través de *hooks* (ganchos) o interfaces. Para detectar conexiones y desconexiones, implementamos dos interfaces clave en nuestro `MessagesWsGateway`:

*   `OnGatewayConnection`: Requiere que la clase tenga un método `handleConnection()`.
*   `OnGatewayDisconnect`: Requiere que la clase tenga un método `handleDisconnect()`.

La firma de nuestra clase `MessagesWsGateway` se actualiza para implementar estas interfaces:

import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private readonly messagesWsService: MessagesWsService
    ) {}

    // ... métodos de conexión/desconexión
}

### 3. Manejo de Nuevas Conexiones

El método `handleConnection()` se ejecuta automáticamente cada vez que un cliente establece una conexión exitosa con nuestro servidor.

*   **Parámetro `client: Socket`**: Este objeto, importado de `socket.io`, contiene toda la información sobre el cliente recién conectado, como su `id` único, cabeceras, etc.
*   **Funcionalidad**: Por ahora, simplemente mostraremos en la consola el `id` del cliente para verificar que la conexión fue exitosa.

    handleConnection(client: Socket) {
        console.log('Cliente conectado', client.id);
    }

### 4. Manejo de Desconexiones

De manera similar, el método `handleDisconnect()` se dispara en el momento en que un cliente se desconecta del servidor (ya sea cerrando la pestaña del navegador, perdiendo la conexión a internet, etc.).

*   **Funcionalidad**: Este hook es crucial para realizar tareas de limpieza, como eliminar al usuario de una lista de "conectados" o notificar a otros usuarios sobre su partida.
*   **Implementación**: Al igual que con la conexión, registramos en la consola el `id` del cliente que se ha desconectado.

    handleDisconnect(client: any) {
        console.log('Cliente desconectado', client.id);
    }

### Importancia de estos Cambios

Implementar estos dos manejadores de eventos es el pilar sobre el cual se construyen las aplicaciones en tiempo real. Nos otorgan la capacidad de **saber en todo momento qué clientes están activos**. Con esta base, podemos empezar a construir funcionalidades más complejas, como:

*   Mantener una lista de usuarios en línea.
*   Enviar mensajes a clientes específicos.
*   Actualizar el estado de la aplicación para todos los participantes cuando alguien se une o se va.
