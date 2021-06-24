import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagicModule } from './magic/magic.module';
import { TypeOrmWithSchemaModule } from './typeorm-with-schema/typeorm-with-schema.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmWithSchemaModule,
    AuthModule,
    MagicModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
