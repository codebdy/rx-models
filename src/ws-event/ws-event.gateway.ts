import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/ws-event' })
export class WSEventGatewayOnGatewayInit {
  @WebSocketServer() wsServer: Server;

  broadcastEvent() {
    this.wsServer.emit('appEvent', {});
  }
}
