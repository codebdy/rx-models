import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { MailerClientsPool } from '../mailer.clients-pool';
import { SendTask } from './send-task';
import { ISendTasksPool } from './i-send-tasks-pool';
import { Mail } from 'src/entity-interface/Mail';
import { EntityManager } from 'typeorm';

@Injectable()
export class MailerSendTasksPool implements ISendTasksPool {
  private pool = new Map<number, SendTask>();

  constructor(
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
  ) {}

  async createTask(mail: Mail, entityManger: EntityManager) {
    let task = this.pool.get(mail.owner.id);
    if (!task) {
      task = new SendTask(
        entityManger,
        this.storageService,
        this.clientsPool,
        this,
        mail.owner.id,
        [mail],
      );
      this.pool.set(mail.owner.id, task);
      await task.start();
    } else {
      task.addMail(mail);
    }
  }

  removeTask(accountId: number) {
    this.pool.delete(accountId);
  }

  getTask(accountId: number) {
    return this.pool.get(accountId);
  }
}
