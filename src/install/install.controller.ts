/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Request, Post, Get } from '@nestjs/common';
import { DB_CONFIG_FILE } from 'src/util/consts';
import { InstallService } from './install.service';

@Controller()
export class InstallController {
  constructor(private readonly authService: InstallService) {}

  @Post('install')
  async intstall(@Request() req) {
    const fs = require('fs');

    fs.stat(DB_CONFIG_FILE, (err) => {
      console.log(err);
    });
    //return this.authService.login(req.user);
  }

  @Get('is-installed')
  async isInstalled() {
    const fs = require('fs');
    return { installed: fs.existsSync(DB_CONFIG_FILE) };
  }
}
