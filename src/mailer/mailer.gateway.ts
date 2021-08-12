import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/mailer' })
export class MailerGateway {
  @WebSocketServer() wsServer: Server;

  broadcastMessage(msg: string) {
    this.wsServer.emit('alertToClient', {});
  }
}
