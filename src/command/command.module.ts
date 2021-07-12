import { Module } from '@nestjs/common';
import { CommandStorage } from './command.storage';
import { PostCommandService } from './post-command.service';
import { QueryCommandService } from './query-command.service';

@Module({
  providers: [CommandStorage, QueryCommandService, PostCommandService],
  exports: [CommandStorage, QueryCommandService, PostCommandService],
})
export class CommandModule {}
