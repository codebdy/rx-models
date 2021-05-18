import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get/:json?')
  getByJson(@Param('json') json): string {
    return json;
    //this.appService.getHello();
  }
}
