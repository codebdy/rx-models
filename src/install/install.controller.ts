import { Controller, Post, Get, Body, HttpException } from '@nestjs/common';
import { PackageManageService } from 'src/package-manage/package-manage.service';
import { sleep } from 'src/util/sleep';
import { InstallService } from './install.service';

@Controller()
export class InstallController {
  constructor(
    private readonly installService: InstallService,
    private readonly packageManage: PackageManageService,
  ) {}

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

  @Post('publish-package')
  async publishPackage(@Body() body) {
    try {
      await sleep(1000);
      return await this.packageManage.publishPackages([body]);
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
}
