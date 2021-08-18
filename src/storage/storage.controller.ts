import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('storage')
export class StorageController {
  /**
   * @returns 用户给邮件password字段加密的KEY
   */
  @UseGuards(AuthGuard())
  @Get('stat')
  stat() {
    return {};
  }
}
