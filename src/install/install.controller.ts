import { Controller, Request, Post, Get } from '@nestjs/common';
import { InstallService } from './install.service';

@Controller()
export class InstallController {
  constructor(private readonly authService: InstallService) {}

  @Post('install')
  async intstall(@Request() req) {
    //return this.authService.login(req.user);
  }

  @Get('me')
  isInstalled(@Request() req) {
    //return req.user;
  }
}
