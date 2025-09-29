## Resumen de avance
# S15: Validar un JWT en el Handshake de WebSockets

Para asegurar que solo los clientes autenticados puedan conectarse a nuestro WebSocket, es fundamental validar su JSON Web Token (JWT) durante el proceso de "handshake" o negociación inicial.

### Pasos Clave de la Implementación

#### 1. Disponibilizar el `AuthModule`

Para poder utilizar `JwtService` en nuestro módulo de WebSockets, primero debemos importar `AuthModule`, que es el encargado de configurar y exportar dicho servicio.

**`04-teslo-shop/src/messages-ws/messages-ws.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
    providers: [MessagesWsGateway, MessagesWsService],
    imports: [AuthModule], // Se importa AuthModule
})
export class MessagesWsModule { }
```
> **Importancia:** Sin esta importación, NestJS no sabría cómo inyectar `JwtService` en nuestro gateway, resultando en un error de dependencias.

---

#### 2. Validar el Token en la Conexión del Gateway

El método `handleConnection` se ejecuta cada vez que un nuevo cliente intenta establecer una conexión. Este es el lugar ideal para implementar nuestra lógica de autenticación.

**`04-teslo-shop/src/messages-ws/messages-ws.gateway.ts`**
```typescript
import { JwtService } from '@nestjs/jwt';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server;

    constructor(
        private readonly messagesWsService: MessagesWsService,
        // 1. Inyectamos el JwtService
        private readonly jwtService: JwtService
    ) { }


    async handleConnection(client: Socket) {
        // 2. Extraemos el token del handshake
        const token = client.handshake.headers.authentication as string;
        let payload: JwtPayload;

        try {
            // 3. Verificamos si el token es válido
            payload = this.jwtService.verify(token);
            await this.messagesWsService.registerClient(client, payload.id);

        } catch (error) {
            // 4. Si el token no es válido, se desconecta al cliente
            client.disconnect();
            return;
        }

        this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    }

    // ... resto del código
}
```

### Resumen de la Lógica

1.  **Inyección de Dependencias:** Se inyecta `JwtService` en el constructor del gateway.
2.  **Extracción del Token:** Al conectarse un cliente, se obtiene el token JWT que se envía en los encabezados (`headers`) del handshake.
3.  **Verificación:** Se utiliza un bloque `try...catch` para validar el token con `jwtService.verify()`.
    *   **Éxito:** Si el token es válido, se extrae el `payload` y se procede a registrar al cliente.
    *   **Fallo:** Si la verificación falla (token inválido, expirado o malformado), se captura el error y se desconecta al cliente inmediatamente con `client.disconnect()`.

> **Concepto Fundamental:** Esta implementación es un patrón de seguridad crucial. Actúa como un "guardián" en la puerta de enlace de nuestros WebSockets, garantizando que toda comunicación en tiempo real provenga exclusivamente de usuarios autenticados y válidos.
