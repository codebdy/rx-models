import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
