import { Module } from '@nestjs/common';
import { DirectiveStorage } from './directivestorage';
import { DeleteDirectiveService } from './delete-directive.service';
import { PostDirectiveService } from './post-directive.service';
import { QueryDirectiveService } from './query-directive.service';

@Module({
  providers: [
    DirectiveStorage,
    QueryDirectiveService,
    PostDirectiveService,
    DeleteDirectiveService,
  ],
  exports: [
    DirectiveStorage,
    QueryDirectiveService,
    PostDirectiveService,
    DeleteDirectiveService,
  ],
})
export class CommandModule {}
