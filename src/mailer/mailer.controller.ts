import { Controller, Get, HttpException, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { sleep } from 'src/util/sleep';
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
    try {
      await sleep(500);
      return { status: false };
    } catch (error: any) {
      console.error('testPOP3 error:', error);
      throw new HttpException(
        {
          status: 500,
          error: error.message,
        },
        500,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Post('test-imap4')
  async testIMAP4() {
    try {
      await sleep(500);
      return { status: false };
    } catch (error: any) {
      console.error('testIMAP4 error:', error);
      throw new HttpException(
        {
          status: 500,
          error: error.message,
        },
        500,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Post('test-smtp')
  async testSMTP() {
    try {
      await sleep(500);
      return { status: false };
    } catch (error: any) {
      console.error('testSMTP error:', error);
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
