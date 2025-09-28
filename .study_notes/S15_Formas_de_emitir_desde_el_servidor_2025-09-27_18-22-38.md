## Resumen de avance
# S15: Formas de Emitir Mensajes desde el Servidor WebSocket

En esta sección, exploramos las diferentes maneras en que un servidor de WebSockets, construido con NestJS, puede emitir mensajes a los clientes conectados. La elección del método de emisión depende del comportamiento deseado en la comunicación.

### 1. Cambios en el Gateway del Servidor

El archivo `messages-ws.gateway.ts` fue modificado para ilustrar tres estrategias principales de emisión de mensajes desde el método `onMessageFromClient`.

#### Estrategias de Emisión:

1.  **`client.emit()`**: Envía un mensaje exclusivamente al cliente que originó el evento. Es útil para respuestas directas o confirmaciones.

    ```typescript
    // Emite unicamente al cliente que envió el mensaje
    client.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    });
    ```

2.  **`client.broadcast.emit()`**: Envía un mensaje a todos los clientes conectados, **excepto** al que originó el evento. Ideal para notificar a los demás sobre la acción de un usuario.

    ```typescript
    // Emite a todos los clientes menos al que envio el mensaje
    client.broadcast.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    });
    ```

3.  **`this.wss.emit()`**: Envía un mensaje a **todos** los clientes conectados, sin excepción. Esta es la implementación final adoptada en el commit y es la más común para salas de chat donde todos deben ver todos los mensajes.

    ```typescript
    // Implementación final: emite a todos los clientes
    this.wss.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    });
    ```

### 2. Cambios en el Cliente

Para poder visualizar los mensajes recibidos del servidor, se realizaron ajustes en el lado del cliente.

#### Actualización de la Interfaz (HTML)

En `main.ts`, se añadió una lista `<ul>` que servirá como contenedor para los mensajes del chat.

```typescript
// 05-ws-client/src/main.ts

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <!-- ... -->
    <form id="message-form">
      <input placeholder="Message" id="message-input" />
    </form>

    <h3>Messages</h3>
    <ul id="messages-ul"></ul>

  </div>
`
```

#### Lógica para Escuchar y Renderizar Mensajes

En `socket-client.ts`, se implementó la lógica para escuchar el evento `message-from-server` y mostrar los mensajes en la interfaz.

-   Se obtiene la referencia al nuevo elemento `<ul>`.
-   Se crea un listener para el evento `message-from-server`.
-   Cuando se recibe un mensaje, se crea dinámicamente un elemento `<li>` con el nombre del remitente y el contenido del mensaje, y se añade a la lista.

```typescript
// 05-ws-client/src/socket-client.ts

const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

// ...

socket.on('message-from-server', (payload: { fullName: string, message: string }) => {

  const newMessage = `
  <li>
    <strong>${payload.fullName}</strong>
    <span>${payload.message}</span>
  </li>
  `;

  const li = document.createElement('li');
  li.innerHTML = newMessage;

  messagesUl.append(li);
});
```

### Importancia de los Cambios

Estos cambios son fundamentales para crear una aplicación de chat funcional. Al utilizar `this.wss.emit()`, nos aseguramos de que cada mensaje enviado por un cliente sea retransmitido a todos los participantes, creando una experiencia de comunicación en tiempo real compartida. El cliente ahora puede recibir y visualizar estos mensajes, completando el flujo de comunicación bidireccional.
