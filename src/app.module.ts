import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagicModule } from './magic/magic.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, MagicModule, UploadModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
