import { Module } from '@nestjs/common';
import { QueryCommandService } from './query/query.command.service';

@Module({
  providers: [QueryCommandService],
  exports: [QueryCommandService],
})
export class CommandModule {}
