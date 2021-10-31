import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CHANNEL_RX_EVENT } from 'src/util/consts';

@Injectable()
@WebSocketGateway({ namespace: CHANNEL_RX_EVENT })
export class RxEventGateway {
  @WebSocketServer() wsServer: Server;

  broadcastEvent() {
    this.wsServer.emit('appEvent', {});
  }
}
