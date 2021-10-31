import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CHANNEL_RX_EVENT, RX_EVENT } from './consts';
import { RxEvent } from './rx-event';

@Injectable()
@WebSocketGateway({ namespace: CHANNEL_RX_EVENT })
export class RxEventGateway {
  @WebSocketServer() wsServer: Server;

  broadcastEvent(event: RxEvent) {
    this.wsServer.emit(RX_EVENT, event);
  }
}
