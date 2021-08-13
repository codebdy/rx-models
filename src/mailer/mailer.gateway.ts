import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MailerEvent, MAILER_EVENT_NAME } from './mailer.event';

@WebSocketGateway({ namespace: '/mailer' })
export class MailerGateway {
  @WebSocketServer() wsServer: Server;

  broadcastMessage(mailerEvent: MailerEvent) {
    this.wsServer.emit(MAILER_EVENT_NAME, mailerEvent);
  }
}
