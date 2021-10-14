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
    console.debug('socket client counts：', this.pool.size);
  }

  removeClient(id: string) {
    this.pool.delete(id);
  }

  has(id: string) {
    return this.pool.has(id);
  }

  getByAccountId(id: number) {
    const items = [];
    for (const item of this.pool) {
      if (item[1].accountId === id) {
        items.push(item[1]);
      }
    }

    return items;
  }
}
