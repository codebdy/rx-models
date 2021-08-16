import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MailConfig } from 'src/entity-interface/MailConfig';
import { CHANNEL_MAILER, EVENT_REGISTER_MAIL_CLIENT } from './consts';
import { MailerEvent, MAILER_EVENT_NAME } from './mailer.event';

@WebSocketGateway({ namespace: CHANNEL_MAILER })
export class MailerGateway {
  @WebSocketServer() wss: Server;

  @SubscribeMessage(EVENT_REGISTER_MAIL_CLIENT)
  registerClient(client: Socket, message: { accountId: number }) {
    console.log('register client:', message.accountId);
    client.on('disconnect', () => {
      console.log('Client disconnect:', message.accountId);
    });
  }

  broadcastMessage(mailerEvent: MailerEvent) {
    this.wss.emit(MAILER_EVENT_NAME, mailerEvent);
  }
}
