import { Controller, Post, Get, Body, HttpException } from '@nestjs/common';
import { InstallService } from './install.service';

@Controller()
export class InstallController {
  constructor(private readonly installService: InstallService) {}

  @Post('install')
  async intstall(@Body() body) {
    try {
      return await this.installService.install(body);
    } catch (error: any) {
      console.error('Install error:', error);
      throw new HttpException(
        {
          status: 500,
          error: error.message,
        },
        500,
      );
    }
  }

  @Get('is-installed')
  async isInstalled() {
    return await this.installService.isInstalled();
  }
}
