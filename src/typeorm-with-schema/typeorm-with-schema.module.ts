import { Module } from '@nestjs/common';
import { TypeOrmWithSchemaService } from './typeorm-with-schema.service';

@Module({
  providers: [TypeOrmWithSchemaService],
  exports: [TypeOrmWithSchemaService],
})
export class TypeOrmWithSchemaModule {}
