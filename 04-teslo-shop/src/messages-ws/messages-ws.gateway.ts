import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(

    private readonly messagesWsService: MessagesWsService
  ) { }


  handleConnection(client: Socket) {
    // console.log('Cliente conectado', client.id);
    this.messagesWsService.registerClient(client);

    console.log({ ClientesConectados: this.messagesWsService.getConnectedClients() });

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
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    }); // to all clients    

  }

}
