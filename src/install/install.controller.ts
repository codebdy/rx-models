import { Controller, Post, Get, Body } from '@nestjs/common';
import { InstallService } from './install.service';

@Controller()
export class InstallController {
  constructor(private readonly installService: InstallService) {}

  @Post('install')
  async intstall(@Body() body) {
    return await this.installService.install(body);
  }

  @Get('is-installed')
  async isInstalled() {
    return await this.installService.isInstalled();
  }
}
