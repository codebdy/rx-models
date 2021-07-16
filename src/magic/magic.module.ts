import { Module } from '@nestjs/common';

import { CommandModule } from 'src/command/command.module';
import { SchemaModule } from 'src/schema/schema.module';
import { MagicController } from './magic.controller';

@Module({
  imports: [SchemaModule, CommandModule],
  controllers: [MagicController],
})
export class MagicModule {}
