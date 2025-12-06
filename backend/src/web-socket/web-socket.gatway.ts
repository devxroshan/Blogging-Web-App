import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsService } from './web-socket.service';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'src/common/utils/types';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private wsService: WsService,
    private configService: ConfigService,
  ) {}

  // When gateway initializes, store server globally
  afterInit() {
    this.wsService.setServer(this.server);
  }

  handleConnection(client: Socket) {
    if(this.configService.get('NODE_ENV') == Environment.DEV)
        console.log('Client connected:', client.id);
  }

  @SubscribeMessage('joinUser')
  joinUser(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(`user:${userId}`);
    client.emit('joined', `user:${userId}`);
  }
}
