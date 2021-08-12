import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MailerReceiveService } from './mailer.receive-service';

@Controller('mailer')
export class MailerController {
  constructor(private mailService: MailerReceiveService) {}

  @UseGuards(AuthGuard())
  @Post()
  receiveMails(@Body() config: { accountId: number; emailAddress: string }) {
    this.mailService.receiveMails(config);
    return { status: 'start service' };
  }
}
