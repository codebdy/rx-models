import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CRYPTO_KEY } from './consts';

@Controller('mailer')
export class MailerController {
  /**
   * @returns 用户给邮件password字段加密的KEY
   */
  @UseGuards(AuthGuard())
  @Get('crypto-key')
  cryptoKey() {
    return { cryptoKey: CRYPTO_KEY };
  }

  @Post('send-mail')
  sendMail() {}
}
