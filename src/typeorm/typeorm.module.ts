import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { TypeOrmService } from './typeorm.service';

@Module({
  imports: [SchemaModule],
  providers: [TypeOrmService],
  exports: [TypeOrmService],
})
export class TypeOrmModule {}
