import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { sleep } from 'src/util/sleep';
import { CRYPTO_KEY } from './consts';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @UseGuards(AuthGuard())
  @Post('send-mail')
  @UseInterceptors(FileInterceptor('attachments'))
  async sendMail(
    @Request() req,
    @UploadedFile() attachments: Express.Multer.File,
    @Body() body: any,
  ) {

    await sleep(1000);
  }
}
