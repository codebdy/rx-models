import { Module } from '@nestjs/common';
import { TypeOrmWithSchemaModule } from 'src/typeorm-with-schema/typeorm-with-schema.module';
import { PackageManageService } from './package-manage.service';

@Module({
  imports: [TypeOrmWithSchemaModule],
  providers: [PackageManageService],
  exports: [PackageManageService],
})
export class PackageManageModule {}
