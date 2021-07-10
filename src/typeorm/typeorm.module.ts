import { Module } from '@nestjs/common';
import { TypeOrmService } from './typeorm.service';

@Module({
  providers: [TypeOrmService],
  exports: [TypeOrmService],
})
export class TypeOrmModule {}
