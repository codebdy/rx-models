import { Mail } from 'src/entity-interface/Mail';
import { SendStatus } from 'src/entity-interface/SendStatus';
import { StorageService } from 'src/storage/storage.service';
import { EntityManager } from 'typeorm';
import { EVENT_MAIL_SENDING_EVENT } from '../consts';
import { MailerClientsPool } from '../mailer.clients-pool';
import { ISendJob } from './i-send-job';
import { ISendJobOwner } from './i-send-job-owner';
import { ISendTasksPool } from './i-send-tasks-pool';
import { MailerSendEvent, MailerSendEventType } from './send-event';
import { SendJob } from './send-job';

/**
 * 一个Task对应一个账号
 */
export class SendTask implements ISendJobOwner {
  private currentJob: ISendJob;
  private aborted = false;
  private errorJobs: ISendJob[] = [];
  constructor(
    private readonly entityManger: EntityManager,
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
    private readonly tasksPool: ISendTasksPool,
    private readonly accountId: number,
    private readonly mails: Mail[],
  ) {}

  onErrorJob(job: ISendJob): void {
    this.errorJobs.push(job);
  }

  emit(event: MailerSendEvent): void {
    const clients = this.clientsPool.getByAccountId(this.accountId);
    for (const client of clients) {
      if (client && client.socket.connected) {
        client.socket.emit(EVENT_MAIL_SENDING_EVENT, event);
      }
    }
  }

  onQueueChange(): void {
    const queue = this.currentJob ? [this.currentJob.toQueueItem()] : [];
    for (const errorJob of this.errorJobs) {
      queue.push(errorJob.toQueueItem());
    }

    for (const waitingMail of this.mails) {
      queue.push({
        mailId: waitingMail.id,
        mailSubject: waitingMail.subject,
        status: SendStatus.WAITING,
        canCancel: true,
      });
    }

    this.emit({
      type: MailerSendEventType.sendQueue,
      mailsQueue: queue,
    });
  }

  nextJob(): ISendJob | undefined {
    if (this.mails.length) {
      this.currentJob = new SendJob(
        this.entityManger,
        this.storageService,
        this,
        this.mails.pop(),
      );
      return this.currentJob;
    } else {
      //结束任务
      this.tasksPool.removeTask(this.accountId);
      this.currentJob = undefined;
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

    //this.emitStatusEvent();
    this.currentJob?.abort();
    this.mails.length = 0;
    this.currentJob = undefined;
    this.aborted = true;
    this.onQueueChange();
  }
}
