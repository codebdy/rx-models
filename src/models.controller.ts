import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('models')
export class OmnipotentController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
