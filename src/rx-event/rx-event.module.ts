import { Global, Module } from '@nestjs/common';
import { RxEventGateway } from './rx-event.gateway';

@Global()
@Module({
  providers: [RxEventGateway],
  exports: [RxEventGateway],
})
export class RxEventModule {}
