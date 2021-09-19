import { Global, Module } from '@nestjs/common';

import { RxBaseService } from './rxbase.service';

@Global()
@Module({
  providers: [RxBaseService],
  exports: [RxBaseService],
})
export class RxBaseModule {}
