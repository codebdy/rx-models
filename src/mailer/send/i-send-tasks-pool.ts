import { SendTask } from './send-task';

export interface ISendTasksPool {
  getTask(accountId: number): SendTask;
  removeTask(accountId: number): void;
}
