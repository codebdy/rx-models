import { Module } from '@nestjs/common';
import { InstallController } from './install.controller';
import { InstallService } from './install.service';

@Module({
  providers: [InstallService],
  exports: [InstallService],
  controllers: [InstallController],
})
export class InstallModule {}
