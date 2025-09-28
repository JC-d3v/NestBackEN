## Resumen de avance
# S15: Emitir desde el Cliente y Escuchar en el Servidor

En esta sesión, se implementa la comunicación desde el cliente hacia el servidor. El cliente ahora puede emitir eventos con un payload (datos), y el servidor está configurado para escuchar estos eventos, procesar los datos recibidos y realizar acciones, como mostrarlos en la consola.

## Cambios Clave

### 1. **Backend: Escuchando Eventos del Cliente (`@SubscribeMessage`)**

Para que el servidor pueda recibir y procesar mensajes específicos del cliente, se utiliza el decorador `@SubscribeMessage`.

- **`NewMessageDto`**: Se creó un DTO para definir la estructura y las reglas de validación de los mensajes que llegan del cliente. Esto asegura que el `payload` contenga un `message` de tipo `string` y no esté vacío.

  ```typescript
  // 04-teslo-shop/src/messages-ws/dtos/new-message.dto.ts
  import { IsString, MinLength } from "class-validator";

  export class NewMessageDto {
    @IsString()
    @MinLength(1)
    message: string;
  }
  ```

- **`MessagesWsGateway`**: Se añadió un método `onMessageFromClient` decorado con `@SubscribeMessage('message-from-client')`. Este método se ejecutará cada vez que un cliente emita un evento con el nombre `message-from-client`.

  ```typescript
  // 04-teslo-shop/src/messages-ws/messages-ws.gateway.ts
  import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { MessagesWsService } from './messages-ws.service';
  import { NewMessageDto } from './dtos/new-message.dto';

  @WebSocketGateway({ cors: true })
  export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    // ... código anterior ...

    @SubscribeMessage('message-from-client')
    onMessageFromClient(client: Socket, payload: NewMessageDto) {
      console.log(client.id, payload);
    }
  }
  ```

### 2. **Frontend: Emitiendo Eventos al Servidor (`socket.emit`)**

El cliente ahora cuenta con una interfaz para enviar mensajes.

- **HTML**: Se agregó un formulario en `index.html` para que el usuario pueda escribir y enviar mensajes.

  ```html
  <!-- 05-ws-client/src/main.ts -->
  <form id="message-form">
    <input placeholder="Message" id="message-input" />
  </form>
  ```

- **Lógica del Cliente**: En `socket-client.ts`, se captura el evento `submit` del formulario. Cuando se envía, se utiliza `socket.emit()` para mandar el mensaje al servidor bajo el evento `message-from-client`.

  ```typescript
  // 05-ws-client/src/socket-client.ts
  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit('message-from-client', {
      id: 'yo', // Temporalmente, luego será gestionado por el backend
      message: messageInput.value
    });
    
    messageInput.value = '';
  });
  ```

## Importancia

Este commit establece el flujo de comunicación bidireccional fundamental en una aplicación de WebSockets:

- **Cliente a Servidor**: El cliente ya no solo reacciona a los eventos del servidor, sino que puede iniciar la comunicación enviando datos estructurados.
- **Validación en el Backend**: El uso de DTOs (`NewMessageDto`) con `class-validator` en el gateway asegura que los datos recibidos del cliente son íntegros y cumplen con el formato esperado antes de ser procesados.
- **Manejo de Eventos Específicos**: `@SubscribeMessage` permite crear "endpoints" para diferentes tipos de eventos de WebSocket, organizando la lógica del servidor de manera clara y escalable.
