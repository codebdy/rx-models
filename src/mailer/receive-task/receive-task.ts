import { MailConfig } from 'src/entity-interface/MailConfig';
import { EVENT_MAIL_RECEIVE_PROGRESS } from '../consts';
import { MailClient, MailerClientsPool } from '../mailer.clients-pool';
import { MailerEvent, MailerEventType } from '../mailer.event';
import { TasksPool } from '../mailer.receive-tasks-pool';
import { Job } from './job';
import { JobOwner } from './job-owner';
import { MailAddressJob } from './mail-address-job';

export class ReceiveTask implements JobOwner {
  lastEvent?: MailerEvent;
  private currentJob: Job;
  constructor(
    private readonly clientsPool: MailerClientsPool,
    private readonly tasksPool: TasksPool,
    private readonly accountId: number,
    private configs: MailConfig[],
  ) {}

  nextJob() {
    if (this.configs.length > 0) {
      this.currentJob = new MailAddressJob(this.configs.pop(), this);
      return this.currentJob;
    } else {
      //结束任务
      this.tasksPool.removeTask(this.accountId);
      this.lastEvent = {
        type: MailerEventType.finished,
      };
      this.emitStatusEvent();
    }
  }

  finishJob(): void {
    this.nextJob()?.start();
  }

  addConfigs(configs: MailConfig[]) {
    for (const config of configs) {
      if (!this.configs.find((aConfig) => aConfig.address === config.address)) {
        this.configs.push(config);
      }
    }
  }

  start() {
    this.nextJob()?.start();
  }

  emit(event: MailerEvent) {
    this.lastEvent = event;
    this.emitStatusEvent();
    console.log('哈哈', event);
  }

  emitStatusEvent() {
    const client = this.clientsPool.getByAccountId(this.accountId);
    if (client && client.socket.connected) {
      this.emitStatusToClient(client);
    }
  }

  emitStatusToClient(client: MailClient) {
    if (this.lastEvent) {
      client.socket.emit(EVENT_MAIL_RECEIVE_PROGRESS, this.lastEvent);
    }
  }

  abort() {
    if (this.lastEvent?.type === MailerEventType.error) {
      this.lastEvent = {
        type: MailerEventType.aborted,
      };
      this.tasksPool.removeTask(this.accountId);
    } else {
      this.lastEvent = {
        type: MailerEventType.cancelling,
        message: 'Cancelling...',
      };
    }

    this.emitStatusEvent();
    this.currentJob?.abort();
    this.configs = [];
  }
}
