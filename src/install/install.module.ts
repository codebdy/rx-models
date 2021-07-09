import { Module } from '@nestjs/common';
import { TypeOrmWithSchemaModule } from 'src/typeorm-with-schema/typeorm-with-schema.module';
import { InstallController } from './install.controller';
import { InstallService } from './install.service';

@Module({
  imports: [TypeOrmWithSchemaModule],
  providers: [InstallService],
  exports: [InstallService],
  controllers: [InstallController],
})
export class InstallModule {}
