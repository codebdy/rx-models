import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

export interface MailClient {
  accountId: number;
  socket: Socket;
}

@Injectable()
export class MailerClientsPool {
  private pool = new Map<string, MailClient>();

  addClient(id: string, client: MailClient) {
    this.pool.set(id, client);
  }

  removeClient(id: string) {
    this.pool.delete(id);
  }

  has(id: string) {
    return this.pool.has(id);
  }

  getByAccountId(id: number) {
    for (const item of this.pool) {
      if (item[1].accountId === id) {
        return item[1];
      }
    }
  }
}
