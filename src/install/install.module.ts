import { Module } from '@nestjs/common';
import { PackageManageModule } from 'src/package-manage/package-manage.module';
import { TypeOrmWithSchemaModule } from 'src/typeorm-with-schema/typeorm-with-schema.module';
import { InstallController } from './install.controller';
import { InstallService } from './install.service';

@Module({
  imports: [TypeOrmWithSchemaModule, PackageManageModule],
  providers: [InstallService],
  exports: [InstallService],
  controllers: [InstallController],
})
export class InstallModule {}
