import {
  Body,
  Controller,
  HttpException,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MailConfig } from 'src/entity-interface/MailConfig';
import { sleep } from 'src/util/sleep';
import { CRYPTO_KEY } from './consts';
import { MailerReceiveService } from './mailer.receive-service';

@Controller('mailer')
export class MailerController {
  constructor(private mailService: MailerReceiveService) {}

  @UseGuards(AuthGuard())
  @Post('receive')
  async receiveMails(@Body() configs: MailConfig[]) {
    try {
      await sleep(1000);
      this.mailService.receiveMails(configs);
      return { success: true };
    } catch (error: any) {
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
  @Post('cancel')
  async cancelReceiving(@Body() configs: MailConfig[]) {
    await sleep(1000);
    this.mailService.receiveMails(configs);
    return { success: true };
  }

  /**
   * @returns 用户给邮件password字段加密的KEY
   */
  @UseGuards(AuthGuard())
  @Get('crypto-key')
  cryptoKey() {
    return { cryptoKey: CRYPTO_KEY };
  }
}
