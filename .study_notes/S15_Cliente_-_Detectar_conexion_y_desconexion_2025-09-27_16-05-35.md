## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

### S15: Cliente — Detección de Conexión y Desconexión

En esta sección, implementamos la capacidad del cliente para detectar y mostrar el estado de la conexión con el servidor WebSocket en tiempo real. Esto es fundamental para la experiencia del usuario, ya que proporciona retroalimentación inmediata sobre si la comunicación está activa o no.

#### 1. Preparación del HTML

Para poder mostrar el estado dinámicamente, primero modificamos el archivo `05-ws-client/src/main.ts`. Se reemplazó el texto estático `"offline"` por un elemento `<span>` con un `id` único. Esto nos permite seleccionarlo y manipularlo fácilmente desde nuestro código TypeScript.

**Cambio en `05-ws-client/src/main.ts`:**

// ...
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1> Websocket - Client </h1>
    <span id="server-status">offline</span>
  </div>
`
// ...

#### 2. Escuchando Eventos de Conexión del Socket

El núcleo de esta funcionalidad reside en el archivo `05-ws-client/src/socket-client.ts`. Aquí, creamos una nueva función llamada `addListeners` que se encarga de registrar los eventos que nos interesan.

La librería `socket.io-client` nos provee de eventos nativos para manejar el ciclo de vida de la conexión:

*   **`connect`**: Se dispara cuando el cliente se conecta exitosamente al servidor.
*   **`disconnect`**: Se dispara cuando la conexión con el servidor se pierde.

Dentro de `addListeners`, seleccionamos el `<span>` que creamos anteriormente y actualizamos su contenido (`innerHTML`) según el evento que se reciba.

**Implementación en `05-ws-client/src/socket-client.ts`:**

import { Manager, Socket } from 'socket.io-client';

export const connectToServer = () => {

	const manager = new Manager('http://localhost:3000/socket.io/socket.io.js');

	const socket = manager.socket('/');

	addListeners(socket);

}

const addListeners = (socket: Socket) => {
	const serverStatusLabel = document.querySelector('#server-status')!;

	socket.on('connect', () => {
		serverStatusLabel.innerHTML = 'Connected';
	})

	socket.on('disconnect', () => {
		serverStatusLabel.innerHTML = 'Disconnected';
	})

}

#### Importancia del Cambio

Con esta implementación, la aplicación web ahora reacciona en tiempo real al estado de la conexión del WebSocket. El usuario puede ver claramente si está `"Connected"` o `"Disconnected"`, lo cual mejora significativamente la usabilidad y previene confusiones sobre si la aplicación está funcionando correctamente.
