import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  Request,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { sleep } from 'src/util/sleep';
import { CRYPTO_KEY } from './consts';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendService } from './mailer.send-service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly sendService: SendService) {}

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
    try {
      await sleep(500);
      //不等待处理结束就返回结果
      this.sendService.sendMessage({
        attachments: body.attachments,
        ...JSON.parse(body.others),
      });
      return {
        status: 'sending',
      };
    } catch (error: any) {
      console.error('Send mail error:', error);
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
