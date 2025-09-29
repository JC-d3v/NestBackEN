## Resumen de avance
# S15: Preparar un Cliente para Enviar un JWT

En esta sección, implementamos la autenticación para nuestra conexión de WebSockets utilizando JSON Web Tokens (JWT). A diferencia de las peticiones HTTP tradicionales, donde los headers se envían con cada solicitud, en los WebSockets la autenticación se maneja comúnmente durante el establecimiento de la conexión inicial (handshake).

### Cambios Clave

1.  **Frontend**: Se modifica la aplicación cliente para incluir un campo de texto donde el usuario puede pegar un JWT. La conexión con el servidor WebSocket no se inicia hasta que el usuario presiona un botón "Conectar".
2.  **Envío del Token**: Al conectarse, el cliente envía el JWT al servidor a través de `extraHeaders`, una opción de configuración del cliente de Socket.IO.
3.  **Backend**: El servidor (Gateway) está configurado para leer este token desde los encabezados de la conexión entrante y, aunque por ahora solo lo muestra en consola, este es el punto de entrada para validar el JWT y permitir o denegar la conexión.

---

### 1. Cliente (Frontend) - Captura y Envío del Token

Se actualizó la interfaz de usuario para permitir la inserción manual de un JWT y se añadió un botón para iniciar la conexión.

**`05-ws-client/src/main.ts`**

```typescript
// Se añade un input para el JWT y un botón para conectar
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2> Websocket - Client </h2>

    <input id="jwt-token" placeholder="Json Web Token" />
    <button id="btn-connect">Connect</button>
    <br />

    <span id="server-status">offline</span>

    <ul id="clients-ul">
    </ul>

    <form id="message-form">
      <input placeholder="message" id="message-input" />
    </form>

    <h3>Messages</h3>
    <ul id="messages-ul"></ul>

  </div>
`

// Se obtiene referencia a los nuevos elementos
const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!;
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;

// Se añade un listener al botón para iniciar la conexión
btnConnect.addEventListener('click', () => {

  if (jwtToken.value.trim().length <= 0) return alert('Enter a valid JWT');

  // Se llama a la función de conexión, pasando el token
  connectToServer(jwtToken.value.trim());

});
```

Para enviar el token, modificamos la función `connectToServer` para que lo incluya en los `extraHeaders` de la conexión.

**`05-ws-client/src/socket-client.ts`**

```typescript
import { Manager } from 'socket.io-client';

// La función ahora recibe el token como argumento
export const connectToServer = (token: string) => {

  const manager = new Manager('http://181.115.165.214:3000/socket.io/socket.io.js', {
    // Se utiliza la opción extraHeaders para enviar información adicional
    extraHeaders: {
      hola: 'mundo',
      authentication: token // Aquí enviamos el JWT
    }
  });

  const socket = manager.socket('/');
  // ... resto de la lógica del socket
}
```

### 2. Servidor (Backend) - Recepción del Token

En el gateway del servidor, se actualiza el método `handleConnection` para leer el token que viene en los encabezados de la solicitud de conexión.

**`04-teslo-shop/src/messages-ws/messages-ws.gateway.ts`**

```typescript
// ... imports

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) {}


  handleConnection(client: Socket) {
    // El token se extrae del objeto 'handshake' del cliente
    const token = client.handshake.headers.authentication as string;
    console.log({ token }); // Por ahora, solo lo mostramos en consola

    this.messagesWsService.registerClient(client);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  // ... resto de la clase
}
```

Este mecanismo es fundamental para securizar las comunicaciones por WebSockets, ya que permite al servidor verificar la identidad del cliente antes de establecer una conexión persistente.
