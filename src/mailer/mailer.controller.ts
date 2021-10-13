import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
