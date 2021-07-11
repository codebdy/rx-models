import { Module } from '@nestjs/common';
import { CommandStorage } from './command.storage';
import { QueryCommandService } from './query-command.service';

@Module({
  providers: [CommandStorage, QueryCommandService],
  exports: [CommandStorage, QueryCommandService],
})
export class CommandModule {}
