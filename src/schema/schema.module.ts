import { Module } from '@nestjs/common';
import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';

@Module({
  providers: [SchemaService],
  exports: [SchemaService],
  controllers: [SchemaController],
})
export class SchemaModule {}
