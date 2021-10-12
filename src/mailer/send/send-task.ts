import { MailConfig } from 'src/entity-interface/MailConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { EVENT_MAIL_RECEIVE_PROGRESS } from '../consts';
import { IJob } from '../job/i-job';
import { JobOwner } from '../job/job-owner';
import { MailClient, MailerClientsPool } from '../mailer.clients-pool';
import { MailerEvent, MailerEventType } from '../mailer.event';
import { ISendTasksPool } from './i-send-tasks-pool';

export class SendTask implements JobOwner {
  lastEvent?: MailerEvent;
  private currentJob: IJob;
  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
    private readonly tasksPool: ISendTasksPool,
    private readonly accountId: number,
    private configs: MailConfig[],
  ) {}

  nextJob(): IJob | undefined {
    if (this.configs.length > 0) {
      /*this.currentJob = new MailAddressJob(
        this.typeOrmService,
        this.storageService,
        this.configs.pop(),
        this,
        this.accountId,
      );
      return this.currentJob;*/
      return undefined;
    } else {
      //结束任务
      this.tasksPool.removeTask(this.accountId);
      this.lastEvent = {
        type: MailerEventType.finished,
      };
      this.emitStatusEvent();
      this.lastEvent = undefined;
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

  continue() {
    this.lastEvent = undefined;
    this.currentJob?.continue();
  }
}
