import { Injectable } from '@nestjs/common';
import { MailConfig } from 'src/entity-interface/MailConfig';
import { MailerClientsPool } from './mailer.clients-pool';
import { ReceiveTask } from './receive-task';

export interface TasksPoolRemover {
  removeTask(accountId: number): void;
}

@Injectable()
export class MailerReceiveTasksPool implements TasksPoolRemover {
  private pool = new Map<number, ReceiveTask>();

  constructor(private readonly clientsPool: MailerClientsPool) {}

  createTask(accountId: number, configs: MailConfig[]) {
    let task = this.pool.get(accountId);
    if (!task) {
      task = new ReceiveTask(this.clientsPool, this, accountId, configs);
      this.pool.set(accountId, task);
      task.doReceive();
    } else {
      task.addConfigs(configs);
    }
  }

  removeTask(accountId: number) {
    this.pool.delete(accountId);
  }

  getTask(accountId: number) {
    return this.pool.get(accountId);
  }
}
