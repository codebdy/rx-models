import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { SmtpConfig } from 'src/entity-interface/SmtpConfig';
import { CRYPTO_KEY } from './consts';
import { MailerTestService } from './mailer.test-service';
import { MailerSendService } from './send/mailer.send.service';

@Controller('mailer')
export class MailerController {
  constructor(
    private readonly sendService: MailerSendService,
    private readonly testService: MailerTestService,
  ) {}

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
  async testPOP3(@Body() body: MailReceiveConfig) {
    try {
      return await this.testService.testPOP3(body);
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
  async testIMAP4(@Body() body: MailReceiveConfig) {
    try {
      return await this.testService.testIMAP4(body);
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
  async testSMTP(@Body() body: SmtpConfig) {
    try {
      return await this.testService.testSMTP(body);
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
