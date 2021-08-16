import { Injectable } from '@nestjs/common';
import { MailerReceiveTask } from './mailer.receive-task';

@Injectable()
export class MailerReceiveTaskPool {
  private pool = new Map<string, MailerReceiveTask | undefined>();

  addTask(task: MailerReceiveTask) {
    if (!this.pool.get(task.key)) {
      this.pool.set(task.key, task);
    }
  }

  removeTask(key: string) {
    this.pool.delete(key);
  }
}
