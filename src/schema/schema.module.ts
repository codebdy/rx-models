import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';

@Module({
  providers: [SchemaService],
  exports: [SchemaService],
})
export class SchemaModule {}
