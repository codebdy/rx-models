import { Module } from '@nestjs/common';
import { TypeOrmWithSchemaService } from './typeorm-with-schema.service';

@Module({
  providers: [TypeOrmWithSchemaService],
})
export class TypeOrmWithSchemaModule {}
