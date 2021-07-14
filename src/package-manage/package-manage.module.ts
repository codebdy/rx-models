import { Module } from '@nestjs/common';
import { PackageManageService } from './package-manage.service';

@Module({
  providers: [PackageManageService],
  exports: [PackageManageService],
})
export class PackageManageModule {}
