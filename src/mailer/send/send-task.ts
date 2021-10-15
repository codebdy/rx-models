import { Mail } from 'src/entity-interface/Mail';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { MailClient, MailerClientsPool } from '../mailer.clients-pool';
import { ISendJob } from './i-send-job';
import { ISendJobOwner } from './i-send-job-owner';
import { ISendTasksPool } from './i-send-tasks-pool';
import { MailerSendEvent } from './send-event';
import { SendJob } from './send-job';

/**
 * 一个Task对应一个账号
 */
export class SendTask implements ISendJobOwner {
  private currentJob: ISendJob;
  private aborted = false;
  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
    private readonly tasksPool: ISendTasksPool,
    private readonly accountId: number,
    private readonly mails: Mail[],
  ) {}

  emit(event: MailerSendEvent): void {
    throw new Error('Method not implemented.');
  }

  onQueueChange(): void {
    throw new Error('Method not implemented.');
  }

  nextJob(): ISendJob | undefined {
    if (this.mails.length) {
      this.currentJob = new SendJob(
        this.typeOrmService,
        this.storageService,
        this,
        this.mails.pop(),
      );
      return this.currentJob;
    } else {
      //结束任务
      this.tasksPool.removeTask(this.accountId);
      /*this.lastEvent = {
        type: MailerEventType.finished,
      };
      this.emitStatusEvent();
      this.lastEvent = undefined;*/
    }
  }

  finishJob(): void {
    this.nextJob()?.start();
  }

  addMail(mail: Mail) {
    this.mails.push(mail);
  }

  async start() {
    await this.nextJob()?.start();
  }

  //emit(event: MailerSendEvent) {
  //  this.emitStatusEvent();
  //}

  emitStatusEvent() {
    const clients = this.clientsPool.getByAccountId(this.accountId);
    for (const client of clients) {
      if (client && client.socket.connected) {
        this.emitStatusToClient(client);
      }
    }
  }

  emitStatusToClient(client: MailClient) {
    //client.socket.emit(EVENT_MAIL_SEND_QUEUE, this.lastEvent);
  }

  abort() {
   /* if (this.lastEvent?.type === MailerEventType.error) {
      this.lastEvent = {
        type: MailerEventType.aborted,
      };
      this.tasksPool.removeTask(this.accountId);
    } else {
      this.lastEvent = {
        type: MailerEventType.cancelling,
        message: 'Cancelling...',
      };
    }*/

    this.emitStatusEvent();
    this.currentJob?.abort();
    this.aborted = true;
  }
}
