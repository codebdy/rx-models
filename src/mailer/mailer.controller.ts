import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CRYPTO_KEY } from './consts';
import { MailerSendService } from './send/mailer.send.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly sendService: MailerSendService) {}

  /**
   * @returns 用户给邮件password字段加密的KEY
   */
  @UseGuards(AuthGuard())
  @Get('crypto-key')
  cryptoKey() {
    return { cryptoKey: CRYPTO_KEY };
  }

  @UseGuards(AuthGuard())
  @Post('test-pop3')
  async testPOP3() {
    return { status: false };
  }

  @UseGuards(AuthGuard())
  @Post('test-imap4')
  async testIMAP4() {
    return { status: false };
  }

  @UseGuards(AuthGuard())
  @Post('test-smtp')
  async testSMTP() {
    return { status: false };
  }
}
