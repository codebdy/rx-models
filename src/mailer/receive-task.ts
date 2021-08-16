import { MailConfig } from 'src/entity-interface/MailConfig';
import { EVENT_MAIL_RECEIVE_PROGRESS } from './consts';
import { MailClient, MailerClientsPool } from './mailer.clients-pool';
import { MailerEvent, MailerEventType } from './mailer.event';
import { TasksPoolRemover } from './mailer.receive-tasks-pool';

export class ReceiveTask {
  lastEvent?: MailerEvent;
  constructor(
    private readonly clientsPool: MailerClientsPool,
    private readonly tasksPoolRemover: TasksPoolRemover,
    private readonly accountId: number,
    private readonly configs: MailConfig[],
  ) {}

  addConfigs(configs: MailConfig[]) {
    for (const config of configs) {
      if (!this.configs.find((aConfig) => aConfig.address === config.address)) {
        this.configs.push(config);
      }
    }
  }

  doReceive() {
    this.lastEvent = {
      type: MailerEventType.login,
      mailAddress: 'lizongbin@hotmail.com',
      message: '正在登录',
    };
    this.emitStatusEvent();
  }

  emitStatusEvent() {
    const client = this.clientsPool.getByAccountId(this.accountId);
    if (client && client.socket.connected) {
      this.emitStatusToClient(client);
    }
  }

  emitStatusToClient(client: MailClient) {
    client.socket.emit(EVENT_MAIL_RECEIVE_PROGRESS, this.lastEvent);
  }

  abort() {
    this.lastEvent = {
      type: MailerEventType.aborted,
    };
    this.emitStatusEvent();
    this.lastEvent = undefined;
    this.tasksPoolRemover.removeTask(this.accountId);
  }
}
