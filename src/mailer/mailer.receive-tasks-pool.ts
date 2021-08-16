import { Injectable } from '@nestjs/common';
import { MailConfig } from 'src/entity-interface/MailConfig';
import { EVENT_MAIL_RECEIVE_PROGRESS } from './consts';
import { MailerClientsPool } from './mailer.clients-pool';

export interface TasksPoolRemover {
  removeTask(accountId: number): void;
}

export class ReceiveTask {
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
    const client = this.clientsPool.getByAccountId(this.accountId);
    if (client && client.socket.connected) {
      client.socket.emit(EVENT_MAIL_RECEIVE_PROGRESS, { message: '哈哈' });
    }
  }
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
}
