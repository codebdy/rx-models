import { Module } from '@nestjs/common';
import { PackageManageModule } from 'src/package-manage/package-manage.module';
import { TypeOrmModule } from 'src/typeorm/typeorm.module';
import { InstallController } from './install.controller';
import { InstallService } from './install.service';

@Module({
  imports: [TypeOrmModule, PackageManageModule],
  providers: [InstallService],
  exports: [InstallService],
  controllers: [InstallController],
})
export class InstallModule {}
