import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/typeorm/typeorm.module';
import { PackageManageService } from './package-manage.service';

@Module({
  imports: [TypeOrmModule],
  providers: [PackageManageService],
  exports: [PackageManageService],
})
export class PackageManageModule {}
