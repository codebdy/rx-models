import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MailConfig } from 'src/entity-interface/MailConfig';
import { MailerReceiveService } from './mailer.receive-service';

@Controller('mailer')
export class MailerController {
  constructor(private mailService: MailerReceiveService) {}

  @UseGuards(AuthGuard())
  @Post()
  receiveMails(@Body() configs: MailConfig[]) {
    this.mailService.receiveMails(configs);
    return { status: 'start receive mail' };
  }
}
