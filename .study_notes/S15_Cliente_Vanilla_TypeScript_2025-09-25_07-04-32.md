## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S15 — Cliente Vanilla TypeScript

En esta sesión, creamos un cliente independiente utilizando **Vanilla TypeScript** para conectarnos a nuestro servidor de WebSockets. Este enfoque nos permite entender la comunicación en tiempo real sin depender de un framework de frontend como React o Angular.

## Puntos Clave

1.  **Nuevo Proyecto con Vite:** Se inicializó un nuevo proyecto (`05-ws-client`) configurado con Vite y TypeScript. Esto nos proporciona un entorno de desarrollo moderno y rápido.

2.  **Instalación de `socket.io-client`:** La dependencia clave para la comunicación es `socket.io-client`.

    *   **`package.json`**:
        {
        	"name": "ws-client",
        	"private": true,
        	"version": "0.0.0",
        	"type": "module",
        	"scripts": {
        		"dev": "vite --host",
        		"build": "tsc && vite build",
        		"preview": "vite preview"
        	},
        	"devDependencies": {
        		"typescript": "~5.8.3",
        		"vite": "^7.1.7"
        	},
        	"dependencies": {
        		"socket.io-client": "^4.8.1"
        	}
        }

3.  **Punto de Entrada (`main.ts`):**
    El archivo `main.ts` inicializa la aplicación. Configura una estructura HTML básica y llama a la función `connectToServer` para establecer la conexión con el WebSocket.

    *   **`src/main.ts`**:
        import { connectToServer } from './socket-client';
        import './style.css';

        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        	<div>
        		<h1> Websocket - Client </h1>
        		<span>offline</span>
        	</div>
        `

        connectToServer();

4.  **Lógica de Conexión (`socket-client.ts`):**
    Este es el núcleo de la implementación. Utilizamos el `Manager` de `socket.io-client` para administrar la conexión.

    *   **¿Por qué un `Manager`?** El `Manager` nos permite controlar de bajo nivel la conexión. Por ejemplo, podríamos reutilizar la misma conexión para diferentes *namespaces* si fuera necesario, optimizando los recursos.

    *   **`src/socket-client.ts`**:
        import { Manager } from 'socket.io-client';

        export const connectToServer = () => {

        	const manager = new Manager('http://172.20.133.9:3000/socket.io/socket.io.js');

        	const socket = manager.socket('/');
        	console.log({ socket });

        }
    *   **Importante:** La URL apunta directamente al recurso `socket.io.js` en el servidor, que es la forma en que el cliente de Socket.IO inicia la comunicación. Luego, con `manager.socket('/')`, obtenemos el *socket* específico para el namespace principal (`/`).
