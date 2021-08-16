import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MailConfig } from 'src/entity-interface/MailConfig';
import {
  CHANNEL_MAILER,
  EVENT_RECEIVEMAILS,
  EVENT_REGISTER_MAIL_CLIENT,
} from './consts';
import { MailerClientsPool } from './mailer.clients-pool';
import { MailerEvent, MAILER_EVENT_NAME } from './mailer.event';
import { MailerReceiveTasksPool } from './mailer.receive-tasks-pool';

@WebSocketGateway({ namespace: CHANNEL_MAILER })
export class MailerGateway {
  @WebSocketServer() wss: Server;

  constructor(
    private readonly clientsPool: MailerClientsPool,
    private readonly tasksPool: MailerReceiveTasksPool,
  ) {}

  @SubscribeMessage(EVENT_REGISTER_MAIL_CLIENT)
  registerClient(client: Socket, message: { accountId: number }) {
    console.debug('Register client:', client.id, message.accountId);
    const mailClient = {
      accountId: message.accountId,
      socket: client,
    };
    this.clientsPool.addClient(client.id, mailClient);
    client.on('disconnect', () => {
      console.debug('Client disconnect:', client.id, message.accountId);
      this.clientsPool.removeClient(client.id);
    });
    this.tasksPool.getTask(message.accountId)?.emitStatusToClient(mailClient);
  }

  @SubscribeMessage(EVENT_RECEIVEMAILS)
  receiveMails(
    client: Socket,
    message: { accountId: number; configs: MailConfig[] },
  ) {
    console.debug('receive emails', client.id);
    if (!this.clientsPool.has(client.id)) {
      this.registerClient(client, { accountId: message.accountId });
    }
    this.tasksPool.createTask(message.accountId, message.configs);
  }

  broadcastMessage(mailerEvent: MailerEvent) {
    this.wss.emit(MAILER_EVENT_NAME, mailerEvent);
  }
}
