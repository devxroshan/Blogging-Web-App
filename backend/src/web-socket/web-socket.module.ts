import { Module, Global } from '@nestjs/common';
import { WsService } from './web-socket.service';
import { WsGateway } from './web-socket.gatway'; 


@Global()
@Module({
  providers: [WsGateway, WsService],
  exports: [WsService], // so other modules can use it
})
export class WsModule {}

