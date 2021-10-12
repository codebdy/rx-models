import { Mail } from 'src/entity-interface/Mail';
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
  private aborted = false;
  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
    private readonly tasksPool: ISendTasksPool,
    private readonly mail: Mail,
  ) {}

  nextJob(): IJob | undefined {
    if (this.mail.id) {
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
      this.tasksPool.removeTask(this.mail?.id);
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

  start() {
    this.nextJob()?.start();
  }

  emit(event: MailerEvent) {
    this.lastEvent = event;
    this.emitStatusEvent();
  }

  emitStatusEvent() {
    const client = this.clientsPool.getByAccountId(this.mail.owner?.id);
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
      this.tasksPool.removeTask(this.mail.id);
    } else {
      this.lastEvent = {
        type: MailerEventType.cancelling,
        message: 'Cancelling...',
      };
    }

    this.emitStatusEvent();
    this.currentJob?.abort();
    this.aborted = true;
  }
}
