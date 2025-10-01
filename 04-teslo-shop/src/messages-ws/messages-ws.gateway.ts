import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(

    private readonly messagesWsService: MessagesWsService,
    private readonly JwtService: JwtService
  ) { }


  async handleConnection(client: Socket) {
    // console.log(client);
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.JwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);


    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload });

    // console.log('Cliente conectado', client.id);

    // console.log({ ClientesConectados: this.messagesWsService.getConnectedClients() });

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }


  handleDisconnect(client: any) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);

    console.log({ ClientesConectados: this.messagesWsService.getConnectedClients() });

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }


  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    // emite unicamente al cliente

    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // }); // to the client that sent the message


    // emite a todos los clientes menos al que envio el mensaje

    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // }); // to all clients except the one that sent the message



    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    }); // to all clients    

  }

}
