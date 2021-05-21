import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagicModule } from './magic/magic.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, MagicModule, UsersModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
