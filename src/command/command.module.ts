import { Module } from '@nestjs/common';
import { CommandStorage } from './command.storage';
import { DeleteCommandService } from './delete-command.service';
import { PostCommandService } from './post-command.service';
import { QueryCommandService } from './query-command.service';

@Module({
  providers: [
    CommandStorage,
    QueryCommandService,
    PostCommandService,
    DeleteCommandService,
  ],
  exports: [
    CommandStorage,
    QueryCommandService,
    PostCommandService,
    DeleteCommandService,
  ],
})
export class CommandModule {}
